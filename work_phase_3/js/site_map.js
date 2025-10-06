// site_map.js
// JavaScript for the Site Map page

import { setupMenu } from "./modules/menu.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[site_map] page ready");

    // Initialize hamburger menu
    setupMenu();

    // ================================
    // Accordion Logic (multi-level support)
    // ================================
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;

            // Toggle the clicked section only
            if (content.style.display === "block") {
                content.style.display = "none";
                header.parentElement.classList.remove("active");
            } else {
                content.style.display = "block";
                header.parentElement.classList.add("active");
            }
        });
    });
});
