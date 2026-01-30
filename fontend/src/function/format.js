/**
 * Autorise uniquement les chiffres (0–9)
 * @param {string} id - id de l'input
 * @param {number} maxLength - nombre maximum de caractères
 */
export const onlyNumbers = (id, maxLength = null) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', () => {
        let value = input.value.replace(/[^0-9]/g, '');

        if (maxLength) {
            value = value.slice(0, maxLength);
        }

        input.value = value;
    });
};

/**
 * Force la saisie en MAJUSCULES
 * @param {string} id - id de l'input
 * @param {number} maxLength - nombre maximum de caractères
 */
export const onlyUppercase = (id, maxLength = null) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', () => {
        let value = input.value.toUpperCase();

        if (maxLength) {
            value = value.slice(0, maxLength);
        }

        input.value = value;
    });
};
