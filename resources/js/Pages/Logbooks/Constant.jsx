import { Link } from "@inertiajs/react";

export function BreadcrumbsLogbooks() {
    return <Link href={route("logbooks.index")}>Logbook</Link>;
}

export const NOTE_CATEGORIES = [
    { id: "siaran", name: "Siaran" },
    { id: "bbm", name: "BBM" },
    { id: "lainnya", name: "Lainnya" },
];

export function noteCategoryLabel(category) {
    return (
        NOTE_CATEGORIES.find((item) => item.id === category)?.name ||
        category
    );
}
