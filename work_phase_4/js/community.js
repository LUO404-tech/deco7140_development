// js/community.js
// Community feed: GET existing posts, POST new posts, local-only replies,
// and cross-jump from "Browse Communities" → "Our Community Voices".

import { fetchGetData } from "./modules/getData.js";
import { postFormData } from "./modules/postFormData.js";

const API_URL = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/";
const HEADERS = {
    student_number: "s4979768",
    uqcloud_zone_id: "5cdfa10d",
};

const feedEl = document.getElementById("community-list");
const statusEl = document.getElementById("community-status");
const filterChips = document.querySelectorAll(".filters .chip");
const browseChips = document.querySelectorAll(".browse-to-voices");
const form = document.getElementById("community-form");
const feedback = document.getElementById("form-feedback");

let latestRows = [];
let filtersWired = false;

/* ------------------------------------------------------------
   Utilities
------------------------------------------------------------ */
function escapeHTML(s = "") {
    return String(s).replace(/[&<>"']/g, (m) => {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return map[m];
    });
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
}

// try to infer the category:
// 1) item.tag / item.category
// 2) message starting with "#cosplay ..."
function getCategory(item) {
    const explicit = (item.tag || item.category || "").toLowerCase().trim();
    if (explicit) return explicit;

    const msg = (item.message || item.content || "").trim();
    if (msg.startsWith("#")) {
        const firstWord = msg.split(/\s+/)[0];
        return firstWord.slice(1).toLowerCase();
    }
    return "";
}

/* ------------------------------------------------------------
   Reply UI
------------------------------------------------------------ */
function buildReplyForm(parentId) {
    const wrap = document.createElement("div");
    wrap.className = "reply-slot";
    // 👇 关键点：这里把两个按钮都改成 class="button ..."
    wrap.innerHTML = `
        <form class="reply-form" data-parent-id="${parentId}">
            <label class="reply-field">
                <span class="reply-label">Reply</span>
                <textarea name="message" required placeholder="Share your thoughts…"></textarea>
            </label>
            <div class="reply-row">
                <label class="reply-field">
                    <span class="reply-label">Name</span>
                    <input name="name" required autocomplete="name" />
                </label>
                <label class="reply-field">
                    <span class="reply-label">Email</span>
                    <input type="email" name="email" required autocomplete="email" />
                </label>
            </div>
            <div class="reply-actions">
                <button type="submit" class="button">Send reply</button>
                <button type="button" class="button button--ghost" data-reply-cancel>Cancel</button>
            </div>
        </form>
    `;
    return wrap;
}

function buildReplyBubble(name, message) {
    const div = document.createElement("div");
    div.className = "reply-card";
    div.innerHTML = `
        <p class="reply-meta">${escapeHTML(name)} replied</p>
        <p class="reply-text">${escapeHTML(message)}</p>
    `;
    return div;
}

/* ------------------------------------------------------------
   Card rendering
------------------------------------------------------------ */
function cardHTML(item) {
    const name = escapeHTML(item.name || item.title || "Anonymous");
    const msg = escapeHTML(item.message || item.content || "");
    const img = item.photo || item.image || "";
    const when = formatDate(item.created_at || item.timestamp);
    const category = getCategory(item);
    const tag = category
        ? `<p class="voice-tag"><span class="badge">${escapeHTML(category)}</span></p>`
        : "";

    return `
    <article class="card voice-card" data-post-id="${escapeHTML(item.id || "")}">
      ${img ? `<img class="voice-photo" src="${img}" alt="">` : ""}
      <div class="voice-body">
        <h3 class="voice-name">${name}</h3>
        ${when ? `<p class="voice-time">${when}</p>` : ""}
        ${msg ? `<p class="voice-text">${msg}</p>` : ""}
        ${tag}
        <div class="voice-actions">
            <!-- 这里也用全站的 .button -->
            <button class="button reply-btn" type="button" data-reply>Reply</button>
        </div>
        <div class="voice-replies" data-replies></div>
      </div>
    </article>
  `;
}

function attachReplyHandlers() {
    feedEl.querySelectorAll("[data-reply]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".voice-card");
            const replies = card.querySelector("[data-replies]");
            if (replies.querySelector(".reply-form")) return;

            const postId = card.dataset.postId || "";
            const formWrap = buildReplyForm(postId);
            replies.prepend(formWrap);

            const formEl = formWrap.querySelector("form");
            const cancelBtn = formWrap.querySelector("[data-reply-cancel]");

            formEl.addEventListener("submit", (e) => {
                e.preventDefault();
                const formData = new FormData(formEl);
                const replyName = formData.get("name") || "Anonymous";
                const replyMsg = formData.get("message") || "";
                replies.appendChild(buildReplyBubble(replyName, replyMsg));
                formWrap.remove();
            });

            cancelBtn.addEventListener("click", () => {
                formWrap.remove();
            });
        });
    });
}

/* ------------------------------------------------------------
   Filtering
------------------------------------------------------------ */
function applyFilter(rows, value) {
    if (value === "all") return rows;
    return rows.filter((r) => getCategory(r) === value.toLowerCase());
}

function renderFiltered(filterValue) {
    const list = applyFilter(latestRows, filterValue);
    if (!list.length) {
        statusEl.textContent = "No community stories yet. Be the first to share!";
        feedEl.innerHTML = "";
        return;
    }
    statusEl.textContent = "";
    feedEl.innerHTML = list.map(cardHTML).join("");
    attachReplyHandlers();
}

function activateFilterChip(value) {
    filterChips.forEach((c) => {
        const isActive = c.dataset.filter === value;
        c.classList.toggle("is-active", isActive);
        c.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
}

function wireFilterChipsOnce() {
    if (filtersWired) return;
    filtersWired = true;

    filterChips.forEach((btn) => {
        btn.addEventListener("click", () => {
            const value = btn.dataset.filter;
            activateFilterChip(value);
            renderFiltered(value);
        });
    });
}

/* ------------------------------------------------------------
   GET
------------------------------------------------------------ */
async function loadVoices() {
    statusEl.textContent = "Loading…";

    const url = `${API_URL}?_t=${Date.now()}`;
    const data = await fetchGetData(url, HEADERS);

    if (!Array.isArray(data)) {
        statusEl.textContent = "Unable to load community content.";
        console.error("GET /community returned:", data);
        return;
    }

    latestRows = data
        .slice()
        .sort(
            (a, b) =>
                new Date(b.created_at || b.timestamp || 0) -
                new Date(a.created_at || a.timestamp || 0)
        );

    const active = document.querySelector(".filters .chip.is-active")?.dataset.filter || "all";
    renderFiltered(active);
    wireFilterChipsOnce();
}

/* ------------------------------------------------------------
   POST (bottom form)
------------------------------------------------------------ */
function wireForm() {
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (feedback) feedback.textContent = "Submitting…";

        // prefix message with #category so that GET can group it
        const categorySelect = document.getElementById("community-category");
        const msgEl = form.querySelector("textarea[name='message']");
        if (categorySelect) {
            const cat = (categorySelect.value || "").trim();
            if (cat && msgEl && !msgEl.value.trim().startsWith("#")) {
                msgEl.value = `#${cat} ${msgEl.value}`.trim();
            }
        }

        const { ok, data } = await postFormData(form, API_URL, HEADERS);

        if (ok && data?.status === "success") {
            if (feedback) feedback.textContent = data.message || "Thanks for joining!";
            form.reset();
            await loadVoices();
        } else {
            const message =
                data?.message ||
                "Something went wrong. Please check your fields and try again.";
            if (feedback) feedback.textContent = message;
            console.warn("POST /community error:", data);
        }
    });
}

/* ------------------------------------------------------------
   Top "Browse Communities" → scroll + filter
------------------------------------------------------------ */
function wireBrowseChips() {
    const voicesSection = document.getElementById("feed");
    browseChips.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filterValue = btn.dataset.filter;
            if (voicesSection) {
                voicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            activateFilterChip(filterValue);
            renderFiltered(filterValue);
        });
    });
}

/* ------------------------------------------------------------
   Init
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    loadVoices();
    wireForm();
    wireBrowseChips();
});
