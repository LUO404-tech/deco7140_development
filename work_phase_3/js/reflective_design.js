import { fetchGetData } from "./modules/getData.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[Reflective Design] page ready");

    /* ================================
       Accordion Toggle Functionality
       (adapted from site_map.js)
    ================================ */
    const headers = document.querySelectorAll(".accordion-header");
    console.log("Accordion headers found:", headers.length);

    headers.forEach((header) => {
        const content = header.nextElementSibling;

        // Close all by default
        content.style.display = "none";
        header.parentElement.classList.remove("active");

        header.addEventListener("click", () => {
            console.log("Clicked accordion:", header.textContent.trim());

            // Toggle clicked section
            if (content.style.display === "block") {
                content.style.display = "none";
                header.parentElement.classList.remove("active");
                console.log("Closed:", header.textContent.trim());
            } else {
                // Close others before opening current
                headers.forEach((h) => {
                    h.nextElementSibling.style.display = "none";
                    h.parentElement.classList.remove("active");
                });

                content.style.display = "block";
                header.parentElement.classList.add("active");
                console.log("Opened:", header.textContent.trim());
            }
        });
    });

    // Optionally open the first accordion by default
    if (headers.length > 0) {
        const firstContent = headers[0].nextElementSibling;
        firstContent.style.display = "block";
        headers[0].parentElement.classList.add("active");
    }

    /* ================================
       Fetch Community Data from API
    ================================ */
    const container = document.getElementById("community-list");
    const loadingElement = document.getElementById("community-loading");
    const emptyElement = document.getElementById("community-empty");

    fetchGetData("https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/", {
        student_number: "s4979768",
        uqcloud_zone_id: "5cdfa10d",
    }).then((data) => {
        // Hide loading state
        if (loadingElement) loadingElement.style.display = "none";

        if (!data) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Unable to load community members. Please try again later.</p>
                </div>`;
            return;
        }

        if (data.length === 0) {
            if (emptyElement) emptyElement.style.display = "block";
            return;
        }

        // Hide empty state if we have data
        if (emptyElement) emptyElement.style.display = "none";

        // Create cards for each community member
        data.forEach((member) => {
            const card = document.createElement("div");
            card.className = "community-card";
            card.innerHTML = `
                ${
                    member.photo
                        ? `<img src="${member.photo}" alt="${member.name}'s contribution" class="community-photo">`
                        : ""
                }
                <h4>${member.name}</h4>
                <p>${member.message || "No message provided."}</p>
                <small class="text-muted">Community Member</small>
            `;
            container.appendChild(card);
        });
    });
});
