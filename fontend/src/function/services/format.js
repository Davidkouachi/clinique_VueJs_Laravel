export function formaDateHeure(value) {
    if (!value) return '';

    // Convertit en objet Date même si " " à la place de "T"
    const date = new Date(value.replace(' ', 'T'));

    if (isNaN(date.getTime())) return value; // si conversion échoue

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
}

export function formatDate(value, options = {}) {
    if (!value) return '';

    const {
        time = false,
        separator = '/',
        locale = 'fr-FR'
    } = options;

    let date;

    // Gestion des différents formats
    if (value instanceof Date) {
        date = value;
    } else if (typeof value === 'string') {
        date = new Date(value.replace(' ', 'T'));
    } else {
        return '';
    }

    if (isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let result = `${day}${separator}${month}${separator}${year}`;

    if (time) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        result += ` à ${hours}:${minutes}:${seconds}`;
    }

    return result;
}

export function formatDateForApi(value, withTime = true) {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return null;

    const pad = (n) => String(n).padStart(2, '0');

    const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    if (!withTime) return d;

    const t = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    return `${d} ${t}`;
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function number(value) {
    if (value === null || value === undefined) return ''

    return value.toString().replace(/[^\d]/g, '')
}

export function formatPrice(price, device) {

    const formatted = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: device.decimal,
        maximumFractionDigits: device.decimal
    }).format(price)

    return device.position === 'before'
        ? `${device.symbol} ${formatted}`
        : `${formatted} ${device.symbol}`
}

export function formatNumberShort(value) {
    if (!value) return 0;

    const num = Number(value);

    if (num < 1000) return num;

    if (num < 1000000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }

    if (num < 1000000000) {
        return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
    }

    return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 1) + 'B';
}





