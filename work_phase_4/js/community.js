// js/community.js
// Page script for Community Hubs: loads "Our Community Voices" via the course API
import { fetchGetData } from "./modules/getData.js";

// ✏️ TODO: Replace with the same endpoint you used in WP3/A3 (same base + path)
export const API_URL =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/";

// ✏️ TODO: Replace with YOUR student number and zone id (as per the API docs)
const HEADERS = {
    student_number: "s4979768",
    uqcloud_zone_id: "5cdfa10d",
};

// If true, show only your own entries (by zone id). Set to false to show all.
const ONLY_MINE = true;

const feedEl = document.getElementById("community-list");
const statusEl = document.getElementById("community-status");
const chips = document.querySelectorAll(".filters .chip");

function escapeHTML(s = "") {
    return String(s).replace(
        /[&<>"']/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );
}

function cardHTML(item) {
    const name = escapeHTML(item.name || item.title || "Anonymous");
    const msg = escapeHTML(item.message || item.content || "");
    const img = item.photo || item.image || "";
    const tag = item.tag ? `<span class="badge">${escapeHTML(item.tag)}</span>` : "";

    return `
    <article class="card voice-card">
      ${img ? `<img class="voice-photo" src="${img}" alt="">` : ""}
      <div class="voice-body">
        <h3 class="voice-name">${name}</h3>
        ${msg ? `<p class="voice-text">${msg}</p>` : ""}
        ${tag ? `<p class="voice-tag">${tag}</p>` : ""}
      </div>
    </article>
  `;
}

function render(list) {
    if (!list.length) {
        statusEl.textContent = "No community stories yet. Be the first to share!";
        feedEl.innerHTML = "";
        return;
    }
    statusEl.textContent = "";
    feedEl.innerHTML = list.map(cardHTML).join("");
}

function applyFilter(rows, value) {
    if (value === "all") return rows;
    return rows.filter((r) => (r.tag || r.category || "").toLowerCase() === value);
}

async function loadVoices() {
    statusEl.textContent = "Loading…";
    const data = await fetchGetData(API_URL, HEADERS);

    if (!Array.isArray(data)) {
        statusEl.textContent = "Unable to load community content.";
        return;
    }

    let rows = ONLY_MINE
        ? data.filter((d) => (d.uqcloud_zone_id || d.zone_id) === HEADERS.uqcloud_zone_id)
        : data;

    // Sort by newest first if timestamps exist
    rows.sort(
        (a, b) =>
            new Date(b.created_at || b.timestamp || 0) -
            new Date(a.created_at || a.timestamp || 0)
    );

    // Initial render with current active chip
    const active = document.querySelector(".filters .chip.is-active")?.dataset.filter || "all";
    render(applyFilter(rows, active));

    // Wire filter chips
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

document.addEventListener("DOMContentLoaded", loadVoices);
