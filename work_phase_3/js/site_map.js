// site_map.js
// JavaScript for the Site Map page

import { setupMenu } from "./modules/menu.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[site_map] page ready");

    // Initialize hamburger menu
    setupMenu();

    // ================================
    // Accordion Logic
    // ================================
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;

            // Toggle the clicked section
            content.style.display = content.style.display === "block" ? "none" : "block";

            // Optional: Close other open sections (accordion behavior)
            headers.forEach((other) => {
                if (other !== header) {
                    other.nextElementSibling.style.display = "none";
                }
            });
        });
    });
});
