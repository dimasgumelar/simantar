import { router } from "@inertiajs/react";
import { INERTIA_OPTIONS } from "@/utils/constants";

export function inertiaGet(name, params = {}, urlParam = {}) {
    router.get(route(name, urlParam), params, INERTIA_OPTIONS);
}

export function parseStatus(params) {
    if (params === 0) {
        return "Menunggu";
    } else if (params === 1) {
        return "Dalam Proses";
    } else if (params === 2) {
        return "Selesai";
    }
    return "Tidak Diketahui";
}

export function parseStatusClass(params) {
    if (params === 0) {
        return "badge-error";
    } else if (params === 1) {
        return "badge-warning";
    } else if (params === 2) {
        return "badge-success";
    }
    return "badge-error";
}

export function parseCondition(params) {
    if (params === 1) {
        return "Baik";
    } else if (params === 2) {
        return "Cukup";
    } else if (params === 3) {
        return "Buruk";
    }
    return "Tidak Diketahui";
}

export function parseConditionClass(params) {
    if (params === 3) {
        return "badge-error";
    } else if (params === 2) {
        return "badge-warning";
    } else if (params === 1) {
        return "badge-success";
    }
    return "badge-error";
}

export function parseDate(params) {
    if (params) {
        const date = new Date(params);

        return date.toLocaleString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    } else {
        return "-";
    }
}

export function parseDateTime(params) {
    if (params) {
        const date = new Date(params);

        return date
            .toLocaleString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            .replace(".", ":");
    } else {
        return "-";
    }
}

export function showValueOrDash(params) {
    if (params) {
        return params;
    } else {
        return "-";
    }
}
