// js/modules/menu.js
export function setupMenu() {
    const btn = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    if (!btn || !menu) return;

    // Attach click event listener to toggle menu
    btn.addEventListener("click", () => {
        menu.classList.toggle("open");

        // Update accessibility attribute
        const expanded = menu.classList.contains("open");
        btn.setAttribute("aria-expanded", String(expanded));
    });
}
