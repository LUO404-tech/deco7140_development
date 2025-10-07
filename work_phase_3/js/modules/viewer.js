// viewer.js
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery-grid img");

    // Create overlay container
    const overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    // Create overlay image element
    const overlayImage = document.createElement("img");
    overlayImage.classList.add("overlay-img");
    overlayImage.setAttribute("alt", "Enlarged image");
    overlay.appendChild(overlayImage);

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("overlay-close");
    closeBtn.setAttribute("aria-label", "Close image viewer");
    closeBtn.innerHTML = "&times;"; // × symbol
    overlay.appendChild(closeBtn);

    // Append overlay at the end of body
    document.body.appendChild(overlay);

    // Open overlay on image click
    images.forEach((img) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            overlayImage.src = img.src;
            overlay.classList.add("visible");
            document.body.classList.add("modal-open");
        });
    });

    // Close overlay on button click
    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("visible");
        overlayImage.src = "";
        document.body.classList.remove("modal-open");
    });

    // Close overlay on clicking background
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("visible");
            overlayImage.src = "";
            document.body.classList.remove("modal-open");
        }
    });

    // Close overlay on pressing Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            overlay.classList.remove("visible");
            overlayImage.src = "";
            document.body.classList.remove("modal-open");
        }
    });
});
