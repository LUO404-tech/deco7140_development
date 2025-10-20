// js/modules/getData.js
export const fetchGetData = (url, headers = {}) =>
    fetch(url, { method: "GET", headers })
        .then((r) => {
            if (!r.ok) throw new Error(r.status);
            return r.json();
        })
        .catch((err) => {
            console.error("GET failed:", err);
            return null;
        });
