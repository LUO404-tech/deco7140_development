import { fetchGetData } from "./modules/getData.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[Reflective Design] page ready");

    /* ================================
       Accordion Toggle Functionality (using site_map.js approach)
    ================================ */
    const headers = document.querySelectorAll(".accordion-header");
    console.log("Accordion headers found:", headers.length);

    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            console.log("Clicked accordion:", header.textContent.trim());

            // Toggle the clicked section only
            if (content.style.display === "block") {
                content.style.display = "none";
                header.parentElement.classList.remove("active");
                console.log("Closed:", header.textContent.trim());
            } else {
                content.style.display = "block";
                header.parentElement.classList.add("active");
                console.log("Opened:", header.textContent.trim());
            }
        });

        // Initialize: close all accordions by default
        const content = header.nextElementSibling;
        content.style.display = "none";
        header.parentElement.classList.remove("active");
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

    fetchGetData("https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/", {
        student_number: "s4979768",
        uqcloud_zone_id: "5cdfa10d",
    }).then((data) => {
        if (!data) {
            container.innerHTML =
                '<p class="text-danger">Unable to load community members.</p>';
            return;
        }
        data.forEach((member) => {
            const card = document.createElement("div");
            card.className = "card mb-3";
            card.innerHTML = `
                <div class="card-body">
                <h5 class="card-title">${member.name}</h5>
                <p class="card-text">${member.message || "No message provided."}</p>
                </div>
            `;
            container.appendChild(card);
        });
    });
});
