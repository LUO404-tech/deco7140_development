// js/login.js
// very simple front-end login demo (no real auth)

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const feedback = document.getElementById("login-feedback");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value.trim();

        if (!email || !password) {
            feedback.textContent = "Please enter both email and password.";
            feedback.className = "login-feedback error";
            return;
        }

        if (!/uq\.edu\.au$/.test(email) && !/student\.uq\.edu\.au$/.test(email)) {
            feedback.textContent =
                "Tip: use your UQ email (…@student.uq.edu.au) to match the project scenario.";
            feedback.className = "login-feedback error";
            return;
        }

        if (password.length < 6) {
            feedback.textContent = "Password should be at least 6 characters.";
            feedback.className = "login-feedback error";
            return;
        }

        // pretend success
        feedback.textContent = "Login successful. You can now return to Community Hubs.";
        feedback.className = "login-feedback ok";

        // optional: remember user for hubs page
        localStorage.setItem("deco7140_user_email", email);
    });
});
