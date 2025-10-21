// js/community.js
// Load & submit "Our Community Voices" using the DECO7140 Community endpoint.

import { fetchGetData } from "./modules/getData.js";
import { postFormData } from "./modules/postFormData.js";

/* ------------------------------------------------------------------ */
/* API config (use the same base you used in WP3/A3)                  */
/* ------------------------------------------------------------------ */
const API_URL = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/";

const HEADERS = {
    student_number: "s4979768",
    uqcloud_zone_id: "5cdfa10d",
};

/* ------------------------------------------------------------------ */
/* DOM refs                                                           */
/* ------------------------------------------------------------------ */
const feedEl = document.getElementById("community-list");
const statusEl = document.getElementById("community-status");
const chips = document.querySelectorAll(".filters .chip");

// For POST
const form = document.getElementById("community-form");
const feedback = document.getElementById("form-feedback");

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function escapeHTML(s = "") {
    return String(s).replace(
        /[&<>"']/g,
        (m) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            }[m])
    );
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
}

function cardHTML(item) {
    const name = escapeHTML(item.name || item.title || "Anonymous");
    const msg = escapeHTML(item.message || item.content || "");
    const img = item.photo || item.image || "";
    const when = formatDate(item.created_at || item.timestamp);
    const tag = item.tag ? `<span class="badge">${escapeHTML(item.tag)}</span>` : "";

    return `
    <article class="card voice-card">
      ${img ? `<img class="voice-photo" src="${img}" alt="">` : ""}
      <div class="voice-body">
        <h3 class="voice-name">${name}</h3>
        ${when ? `<p class="voice-time">${when}</p>` : ""}
        ${msg ? `<p class="voice-text">${msg}</p>` : ""}
        ${tag ? `<p class="voice-tag">${tag}</p>` : ""}
      </div>
    </article>
  `;
}

function render(list) {
    if (!Array.isArray(list) || list.length === 0) {
        statusEl.textContent = "No community stories yet. Be the first to share!";
        feedEl.innerHTML = "";
        return;
    }
    statusEl.textContent = "";
    feedEl.innerHTML = list.map(cardHTML).join("");
}

// Optional chip filter (only works if your data contains tag/category)
function applyFilter(rows, value) {
    if (value === "all") return rows;
    return rows.filter((r) => (r.tag || r.category || "").toLowerCase() === value);
}

/* ------------------------------------------------------------------ */
/* GET: load voices                                                   */
/* ------------------------------------------------------------------ */
async function loadVoices() {
    statusEl.textContent = "Loading…";

    // Cache-buster to avoid stale GETs during development
    const url = `${API_URL}?_t=${Date.now()}`;
    const data = await fetchGetData(url, HEADERS);

    if (!Array.isArray(data)) {
        statusEl.textContent = "Unable to load community content.";
        console.error("GET /community returned:", data);
        return;
    }

    // Sort newest first if timestamp is present
    const rows = data
        .slice()
        .sort(
            (a, b) =>
                new Date(b.created_at || b.timestamp || 0) -
                new Date(a.created_at || a.timestamp || 0)
        );

    const active = document.querySelector(".filters .chip.is-active")?.dataset.filter || "all";
    render(applyFilter(rows, active));

    // Wire chips once (idempotent listeners are fine in this context)
    chips.forEach((btn) => {
        btn.addEventListener("click", () => {
            chips.forEach((c) => {
                c.classList.remove("is-active");
                c.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-pressed", "true");
            render(applyFilter(rows, btn.dataset.filter));
        });
        btn.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

/* ------------------------------------------------------------------ */
/* POST: intercept form submit                                        */
/* ------------------------------------------------------------------ */
function wireForm() {
    if (!form) return; // page may omit the form

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent default GET ?name=... in the address bar
        if (feedback) feedback.textContent = "Submitting…";

        const { ok, data } = await postFormData(form, API_URL, HEADERS);

        if (ok && data?.status === "success") {
            if (feedback) feedback.textContent = data.message || "Thanks for joining!";
            form.reset();
            await loadVoices(); // refresh list so the new entry appears immediately
        } else {
            const message =
                data?.message ||
                "Something went wrong. Please check your fields and try again.";
            if (feedback) feedback.textContent = message;
            console.warn("POST /community error:", data);
        }
    });
}

/* ------------------------------------------------------------------ */
/* Init                                                               */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    loadVoices();
    wireForm();
});
