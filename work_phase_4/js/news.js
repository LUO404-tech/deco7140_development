// js/news.js
// Event filter chips on the News page

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("events-list");
    const chips = document.querySelectorAll(".filters .chip");
    if (!list || !chips.length) return; // graceful no-op

    function applyFilter(value) {
        list.dataset.currentFilter = value;
        document.querySelectorAll(".event-card").forEach((card) => {
            const show = value === "all" || card.dataset.type === value;
            card.style.display = show ? "" : "none";
        });
    }

    chips.forEach((btn) => {
        btn.addEventListener("click", () => {
            chips.forEach((c) => {
                c.classList.remove("is-active");
                c.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-pressed", "true");
            applyFilter(btn.dataset.filter);
        });

        // Keyboard activation (Space/Enter) – a11y
        btn.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    applyFilter("all"); // initial
});
