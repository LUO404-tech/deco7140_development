// reflective_design.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("[reflective_design] page ready");

    // Example reflections linked to project values
    const reflections = [
        "Inclusivity makes every student feel welcome 🤝",
        "Privacy builds trust and safety 🔒",
        "Creativity brings joy and connection 🎨",
        "Transparency strengthens community bonds 🌐",
        "Fairness ensures equal opportunity for all ⚖️",
    ];

    // Choose one reflection based on the current day
    const today = new Date().getDate();
    const reflection = reflections[today % reflections.length];

    // Update placeholder content
    const placeholder = document.getElementById("api-placeholder");
    if (placeholder) {
        placeholder.innerHTML = `
            <h3>🌐 Daily Reflection</h3>
            <p>${reflection}</p>
        `;
    }
});
