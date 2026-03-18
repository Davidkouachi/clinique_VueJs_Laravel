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

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function number(value) {
    if (!value) return ''

    // autoriser seulement les chiffres
    return value.replace(/[^\d]/g, '')
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





