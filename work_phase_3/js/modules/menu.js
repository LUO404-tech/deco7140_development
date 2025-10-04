// work_phase_3/js/modules/menu.js
// Mobile hamburger menu module

export function setupMenu() {
    const btn = document.querySelector(".menu-toggle"); // The hamburger button
    const menu = document.querySelector(".menu"); // The mobile navigation menu

    // Exit early if button or menu is not found
    if (!btn || !menu) return;

    // Attach click event listener to toggle menu visibility
    btn.addEventListener("click", () => {
        menu.classList.toggle("open"); // Toggle "open" state

        // Update ARIA attribute for accessibility
        const expanded = menu.classList.contains("open");
        btn.setAttribute("aria-expanded", String(expanded));
    });
}
