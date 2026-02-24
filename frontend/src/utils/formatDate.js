export function parseToDate(input) {
    if (!input) return null;

    // If already a Date
    if (input instanceof Date) return input;

    // If numeric string or number
    if (typeof input === "number" || /^\d+$/.test(String(input))) {
        const n = Number(input);

        // if looks like seconds (10 digits) convert to ms
        if (String(n).length === 10) return new Date(n * 1000);
        return new Date(n); // assume already ms
    }

    // If ISO string
    const maybe = new Date(input);
    if (!isNaN(maybe)) return maybe;

    return null;
}

export function formatOrderDate(input, options = {}) {
    // options: { locale, showRelative (bool) }
    const { locale = undefined, showRelative = false } = options;
    const d = parseToDate(input);
    if (!d) return "";

    // If you want relative times for recent orders:
    if (showRelative) {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        const now = Date.now();
        const diffMs = d.getTime() - now;
        // const absMs = Math.abs(diffMs); // Unused

        const mins = Math.round(diffMs / (60 * 1000));
        const hours = Math.round(diffMs / (60 * 60 * 1000));
        const days = Math.round(diffMs / (24 * 60 * 60 * 1000));

        if (Math.abs(mins) < 60) return rtf.format(Math.round(mins), "minute");
        if (Math.abs(hours) < 48) return rtf.format(Math.round(hours), "hour");
        return rtf.format(Math.round(days), "day");
    }

    // Default: localized "13 Sept 2025, 05:45 PM" style
    return d.toLocaleString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
