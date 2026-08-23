// Validated categorical + status palette (light-surface only — this app has
// no dark theme toggle yet). Slot order is the CVD-safety mechanism: keep it
// fixed, never cycle or reassign per-series.
export const CHART_SERIES = {
    blue: "#2a78d6",
    orange: "#eb6834",
    aqua: "#1baf7a",
};

export const STATUS_COLORS = {
    good: "#0ca30c",
    warning: "#fab219",
};

export const CHART_INK = {
    primary: "#0b0b0b",
    secondary: "#52514e",
    muted: "#898781",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    surface: "#fcfcfb",
};

export function formatShortDate(dateStr) {
    const [, month, day] = dateStr.split("-");
    return `${day}/${month}`;
}

export function formatDurationMinutes(minutes) {
    const total = Math.round(minutes || 0);
    if (total <= 0) return "0m";
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}j`;
    return `${hours}j ${mins}m`;
}

export function formatFullDate(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
