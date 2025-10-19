// =========================================================
// Minimal accessible hamburger for all pages
// - Toggles .is-open on the nav list
// - Updates aria-expanded
// - ESC closes and returns focus
// =========================================================
(function () {
    const btn = document.querySelector(".nav-toggle");
    const list = document.querySelector("#primary-nav");

    if (!btn || !list) return;

    function setOpen(open) {
        list.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        if (open) {
            // move focus to first link for convenience
            const firstLink = list.querySelector("a");
            firstLink && firstLink.focus();
        }
    }

    btn.addEventListener("click", () => {
        const open = !list.classList.contains("is-open");
        setOpen(open);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && list.classList.contains("is-open")) {
            setOpen(false);
            btn.focus();
        }
    });
})();
