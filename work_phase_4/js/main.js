// =========================================================
// 1) Skip link auto-hide on initial load
//    - Keep the element for accessibility
//    - But if the browser focuses it on page load, blur it
//    - Also blur it on first mouse/touch so it doesn't stay visible
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const skip = document.querySelector(".skip-link");
    if (!skip) return;

    // if the browser auto-focused the skip link, remove focus
    if (document.activeElement === skip) {
        skip.blur();
    }

    // if the user clicks/taps anywhere, also remove focus from skip
    const clearSkip = () => {
        if (document.activeElement === skip) {
            skip.blur();
        }
        document.removeEventListener("mousedown", clearSkip);
        document.removeEventListener("touchstart", clearSkip);
    };

    document.addEventListener("mousedown", clearSkip);
    document.addEventListener("touchstart", clearSkip);
});

// =========================================================
// 2) Minimal accessible hamburger for all pages
//    - Toggles .is-open on the nav list
//    - Updates aria-expanded
//    - ESC closes and returns focus
// =========================================================
(function () {
    const btn = document.querySelector(".nav-toggle");
    const list = document.querySelector("#primary-nav");

    if (!btn || !list) return;

    function setOpen(open) {
        list.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        if (open) {
            const firstLink = list.querySelector("a");
            if (firstLink) {
                firstLink.focus();
            }
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
