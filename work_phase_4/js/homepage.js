// js/homepage.js
import { setupMenu } from "./modules/menu.js";

// Simple keyword → URL routing table
const ROUTES = [
    { pattern: /(calendar|schedule|timetable|week)/i, url: "news.html#calendar-heading" },
    {
        pattern: /(event|news|update|workshop|competition|club|clubs)/i,
        url: (q) => "news.html?q=" + encodeURIComponent(q),
    },
    { pattern: /(hub|community|voice|join|post)/i, url: "hubs.html" },
    { pattern: /(learn|tutorial|guide|studio|course)/i, url: "learning.html" },
    { pattern: /(support|help|safety|contact)/i, url: "support.html" },
    { pattern: /(intro(duction)?|about|overview)/i, url: "introduction.html" },
];

function navigateByQuery(q) {
    for (const r of ROUTES) {
        if (r.pattern.test(q)) {
            const url = typeof r.url === "function" ? r.url(q) : r.url;
            window.location.href = url;
            return true;
        }
    }
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();

    const form = document.getElementById("site-search");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    // Submit → try route match; else fall back to News with ?q=
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim().toLowerCase();
        if (!q) {
            input.focus();
            return;
        }

        if (navigateByQuery(q)) return; // matched a route; navigated already
        window.location.href = "news.html?q=" + encodeURIComponent(q); // fallback
    });

    // Quick links with data-search attribute trigger the same submit flow
    document.querySelectorAll("[data-search]").forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            input.value = a.getAttribute("data-search") || a.textContent.trim();
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
    });
});
