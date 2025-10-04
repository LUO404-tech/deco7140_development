// visceral_design.js
// JavaScript for the Visceral Design page

import { setupMenu } from "./modules/menu.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[visceral_design] page ready");

    // Initialize hamburger menu
    setupMenu();

    // Simple hover effect for cards
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.02)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });
});
