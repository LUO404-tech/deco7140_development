document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    if (btn && menu) {
        btn.addEventListener("click", () => menu.classList.toggle("open"));
    }
});
