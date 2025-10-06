// viewer.js
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery-grid img");

    // Create overlay container
    const overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    overlay.setAttribute("role", "dialog"); // Accessibility
    overlay.setAttribute("aria-modal", "true");

    // Insert overlay at the top of <body> to avoid scroll jump
    document.body.insertBefore(overlay, document.body.firstChild);

    // Create overlay image element
    const overlayImage = document.createElement("img");
    overlayImage.classList.add("overlay-img");
    overlayImage.setAttribute("alt", "Enlarged image"); // Fallback alt
    overlay.appendChild(overlayImage);

    // Close overlay on click
    overlay.addEventListener("click", () => {
        overlay.classList.remove("visible");
        overlayImage.src = "";
        document.body.classList.remove("modal-open");
    });

    // Close overlay on pressing Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            overlay.classList.remove("visible");
            overlayImage.src = "";
            document.body.classList.remove("modal-open");
        }
    });

    // Click to open image overlay
    images.forEach((img) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            overlayImage.src = img.src;
            overlay.classList.add("visible");
            document.body.classList.add("modal-open"); // Prevent background scroll
        });
    });
});
