// ---------- Utilities ----------
const supportsDialog = () => typeof HTMLDialogElement === "function";
const openDialog = (dlg) =>
    supportsDialog() ? dlg.showModal() : dlg.classList.add("is-open");
const closeDialog = (dlg) =>
    supportsDialog() ? dlg.close() : dlg.classList.remove("is-open");

// ---------- Open/close wiring ----------
const guidesDlg = document.getElementById("guides-dialog");
const videosDlg = document.getElementById("videos-dialog");
const qaDlg = document.getElementById("qa-dialog");

document.getElementById("open-guides")?.addEventListener("click", () => openDialog(guidesDlg));
document.getElementById("open-videos")?.addEventListener("click", () => openDialog(videosDlg));
document.getElementById("open-qa")?.addEventListener("click", () => openDialog(qaDlg));

document
    .getElementById("close-guides")
    ?.addEventListener("click", () => closeDialog(guidesDlg));
document
    .getElementById("close-videos")
    ?.addEventListener("click", () => closeDialog(videosDlg));
document.getElementById("close-qa")?.addEventListener("click", () => closeDialog(qaDlg));

// ---------- Video Tutorials ----------
const VIDEO_DATA = [
    {
        category: "Cosplay",
        title: "Tutorial",
        url: "https://youtu.be/6fe4aVzQknM?si=gy59-fepoM-Dwd_h",
    },
    {
        category: "Knitting",
        title: "Tutorial",
        url: "https://youtu.be/p_R1UDsNOMk?si=ZuOWaBJ1JM3Vp55C",
    },
    {
        category: "Anime",
        title: "Tutorial",
        url: "https://youtu.be/T5WHINEOekQ?si=fOeeyqlbfiP8jLE4",
    },
    {
        category: "Dance",
        title: "Tutorial",
        url: "https://youtu.be/kbUzi7meesU?si=XnPv__veZmrIJgNP",
    },
];

const renderVideos = (filter) => {
    const list = document.getElementById("video-list");
    list.innerHTML = "";
    list.setAttribute("aria-busy", "true");

    const cats = ["Anime", "Cosplay", "Dance", "Knitting"];
    const within = (c) => filter === "All" || c === filter;

    cats.forEach((cat) => {
        const items = VIDEO_DATA.filter((v) => within(v.category) && v.category === cat);
        if (!items.length) return;
        const group = document.createElement("li");
        group.className = "video-group";
        group.innerHTML = `
      <h4 class="video-group__title">${cat}</h4>
      <div class="video-group__list">
        ${items
            .map(
                (v) =>
                    `<a class="video-link" href="${v.url}" target="_blank" rel="noopener">${v.title}</a>`
            )
            .join("")}
      </div>`;
        list.appendChild(group);
    });

    list.setAttribute("aria-busy", "false");
};
document
    .getElementById("video-filter")
    ?.addEventListener("change", (e) => renderVideos(e.target.value));
renderVideos("All");

// ---------- FAQ (accordion) ----------
const FAQ_DATA = [
    {
        category: "Cosplay",
        q: "How do I choose my first cosplay?",
        a: "Pick a character you love, start simple, and focus on comfort and safety for your first event.",
    },
    {
        category: "Knitting",
        q: "What’s a sensible beginner budget?",
        a: "A basic kit (needles + acrylic yarn) can be under $30; upgrade materials as you learn.",
    },
    {
        category: "Anime",
        q: "Good beginner drawing drills?",
        a: "Try daily 10-minute face/pose sketches. Use references and keep a simple warm-up routine.",
    },
    {
        category: "Dance",
        q: "How often should I practice as a beginner?",
        a: "Aim for 20–30 minutes, 3–4 times a week. Record yourself to track progress.",
    },
];

const renderFAQ = (filter) => {
    const list = document.getElementById("faq-list");
    list.innerHTML = "";
    list.setAttribute("aria-busy", "true");

    FAQ_DATA.filter((i) => filter === "All" || i.category === filter).forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "faq-item";
        const panelId = `faq-${idx}`;
        li.innerHTML = `
      <button class="faq__btn" aria-expanded="false" aria-controls="${panelId}">
        ${item.q}
      </button>
      <div id="${panelId}" class="faq__panel" hidden>
        <p>${item.a}</p>
      </div>`;
        list.appendChild(li);
    });

    // toggle
    list.querySelectorAll(".faq__btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const expanded = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!expanded));
            const panel = document.getElementById(btn.getAttribute("aria-controls"));
            panel.hidden = expanded;
        });
    });

    list.setAttribute("aria-busy", "false");
};
document
    .getElementById("qa-filter")
    ?.addEventListener("change", (e) => renderFAQ(e.target.value));
renderFAQ("All");

// ---------- Email button (no backend) ----------
document.getElementById("qa-email-btn")?.addEventListener("click", () => {
    const sel = document.getElementById("qa-filter");
    const cat = sel?.value && sel.value !== "All" ? sel.value : "General";
    const subject = encodeURIComponent(`[Learning Studio] Question — ${cat}`);
    const body = encodeURIComponent(
        `Category: ${cat}\n\nQuestion:\n(Write your question here)\n\n— Sent from Learning Studio`
    );
    // TODO: replace with your email
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
});
