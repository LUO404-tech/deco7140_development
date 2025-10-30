// js/support.js
"use strict";

// -------- clipboard helpers --------
function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
}

async function copyToClipboard(text) {
    if (!text) return false;

    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // fall through to legacy
        }
    }
    return legacyCopy(text);
}

function getTextFromElement(el) {
    if (!el) return "";
    const isForm = el.matches("input,textarea");
    const raw = isForm ? el.value : el.textContent;
    return (raw || "").trim();
}

function showCopyFeedback(btn, ok, msgOK = "Copied!", msgERR = "Copy failed") {
    const feedbackSel = btn.getAttribute("data-feedback");
    const feedbackNode =
        (feedbackSel && document.querySelector(feedbackSel)) ||
        (btn.nextElementSibling &&
            btn.nextElementSibling.classList &&
            btn.nextElementSibling.classList.contains("inline-note") &&
            btn.nextElementSibling);

    if (feedbackNode) {
        if (!feedbackNode.hasAttribute("role")) {
            feedbackNode.setAttribute("role", "status");
        }
        feedbackNode.textContent = ok ? msgOK : msgERR;
        clearTimeout(feedbackNode._copyTimer);
        feedbackNode._copyTimer = setTimeout(() => {
            feedbackNode.textContent = "";
        }, 1600);
    } else {
        const prev = btn.textContent;
        btn.textContent = ok ? msgOK : msgERR;
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
            btn.textContent = prev;
        }, 1200);
    }
}

function pulseCopiedTarget(el) {
    if (!el) return;
    el.setAttribute("data-copied", "true");
    clearTimeout(el._pulseTimer);
    el._pulseTimer = setTimeout(() => {
        el.removeAttribute("data-copied");
    }, 1200);
}

// create hidden live region once
let live = document.getElementById("copy-live");
if (!live) {
    live = document.createElement("div");
    live.id = "copy-live";
    live.setAttribute("aria-live", "polite");
    live.style.position = "absolute";
    live.style.width = "1px";
    live.style.height = "1px";
    live.style.overflow = "hidden";
    live.style.clip = "rect(1px, 1px, 1px, 1px)";
    live.style.clipPath = "inset(50%)";
    live.style.whiteSpace = "nowrap";
    live.style.margin = "-1px";
    document.body.appendChild(live);
}

function updateLive(msg) {
    live.textContent = msg || "";
}

async function handleCopy(btn, evt) {
    // prevent <a> navigation if we are only copying
    if (btn.tagName === "A") {
        evt.preventDefault();
    }

    let text = btn.getAttribute("data-copy-text") || "";
    let sourceEl = null;

    if (!text) {
        const selector = btn.getAttribute("data-copy");
        sourceEl = selector ? document.querySelector(selector) : null;
        text = getTextFromElement(sourceEl);
    }

    const ok = await copyToClipboard(text);
    showCopyFeedback(btn, ok);

    if (ok) {
        if (sourceEl) {
            pulseCopiedTarget(sourceEl);
        }
        updateLive("Email address copied to clipboard.");
    } else {
        updateLive("Copy failed.");
    }
}

// -------- accordion helpers --------
function initAccordion() {
    const buttons = document.querySelectorAll(".accordion .item .header");
    buttons.forEach((btn) => {
        const panelId = btn.getAttribute("aria-controls");
        if (!panelId) return;
        const panel = document.getElementById(panelId);
        if (!panel) return;

        // click
        btn.addEventListener("click", () => {
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!isOpen));
            panel.hidden = isOpen;
        });

        // keyboard
        btn.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!isOpen));
            panel.hidden = isOpen;
        });
    });
}

// -------- boot --------
document.addEventListener("DOMContentLoaded", () => {
    // delegate copy buttons
    document.addEventListener("click", (evt) => {
        const copyBtn = evt.target.closest("[data-copy],[data-copy-text],.js-copy");
        if (copyBtn) {
            handleCopy(copyBtn, evt);
        }
    });

    // init accordion for this page
    initAccordion();
});

// optional global hook
window.Support = {
    copyToClipboard,
};
