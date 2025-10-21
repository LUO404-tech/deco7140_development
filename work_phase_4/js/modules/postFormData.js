// js/modules/postFormData.js
// POST a <form> using fetch + FormData, with required headers.
export async function postFormData(formEl, url, headers = {}) {
    const body = new FormData(formEl);
    try {
        const res = await fetch(url, { method: "POST", headers, body });
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, data };
    } catch (err) {
        console.error("POST failed:", err);
        return { ok: false, data: { message: "Network error" } };
    }
}
