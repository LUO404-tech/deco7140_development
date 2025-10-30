// js/modules/accordion.js
export function initAccordion(root = document) {
    root.addEventListener("click", (event) => {
        const btn = event.target.closest(".accordion .item .header");
        if (!btn) return;

        const panelId = btn.getAttribute("aria-controls");
        if (!panelId) return;

        const panel = document.getElementById(panelId);
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
    });
}
