// secureStorage.js

const SECRET_KEY = "MaCléUltraSecrète!2025"; // clé secrète

// --- Encode en UTF-8 puis en Base64 ---
// function utf8ToBase64(str) {
//     return btoa(unescape(encodeURIComponent(str)));
// }

// function base64ToUtf8(str) {
//     return decodeURIComponent(escape(atob(str)));
// }

function utf8ToBase64(str) {
    return btoa(
        new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

function base64ToUtf8(str) {
    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

// --- XOR simple avec clé --- 
// function xorEncrypt(str, key) {
//     let result = "";
//     for (let i = 0; i < str.length; i++) {
//         result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
//     }
//     return result;
// }

function xorEncrypt(str, key) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return String.fromCharCode(...result);
}

// --- Génère une clé dynamique basée sur la clé secrète + sel ---
function deriveKey(secret, salt = "") {
    let hash = 0;
    const combined = secret + salt;
    for (let i = 0; i < combined.length; i++) {
        hash = (hash << 5) - hash + combined.charCodeAt(i);
        hash |= 0;
    }
    let key = "";
    for (let i = 0; i < 16; i++) {
        key += String.fromCharCode((hash >> (i * 2)) & 0xff);
    }
    return key;
}

// function encryptLocal(value) {
//     const str = typeof value === "string" ? value : JSON.stringify(value);
//     const key = deriveKey(SECRET_KEY); // ❌ plus de sel dynamique

//     const xored = xorEncrypt(str, key);
//     return utf8ToBase64(xored); // juste Base64
// }

// function decryptLocal(cipherText) {
//     try {
//         const decoded = base64ToUtf8(cipherText);
//         const key = deriveKey(SECRET_KEY); // ❌ plus de sel
//         const original = xorEncrypt(decoded, key);

//         try {
//             return JSON.parse(original);
//         } catch {
//             return original;
//         }
//     } catch {
//         return null;
//     }
// }

function encryptLocal(value) {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    const key = deriveKey(SECRET_KEY);

    const xored = xorEncrypt(str, key);

    return btoa(xored); // simple et stable
}

function decryptLocal(cipherText) {
    try {
        const decoded = atob(cipherText);
        const key = deriveKey(SECRET_KEY);

        const original = xorEncrypt(decoded, key);

        try {
            return JSON.parse(original);
        } catch {
            return original;
        }
    } catch (e) {
        console.error("Decrypt error:", e);
        return null;
    }
}

// --- API publique SYNCHRONE ---
export function setSecureItem(key, value) {
    try {
        const encrypted = encryptLocal(value);
        localStorage.setItem(key, encrypted);
    } catch (err) {
        console.error("Erreur setSecureItem:", err);
    }
}

export function getSecureItem(key) {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return decryptLocal(encrypted);
    } catch (err) {
        console.error("Erreur getSecureItem:", err);
        return null;
    }
}

export function removeSecureItem(key) {
    localStorage.removeItem(key);
}

export function clearSecureStorage() {
    localStorage.clear();
}