import { usePage } from "@inertiajs/react";

export default function Roles() {
    const { props } = usePage();
    const userFromUsePage = props.user ?? {};
    const userRoles = userFromUsePage.roles ?? [];

    const role = {
        hasAdmin: userRoles.some((role) => role.name === "admin"),
        hasKetuaTim: userRoles.some((role) => role.name === "ketua tim"),
        hasTeknisi: userRoles.some((role) => role.name === "teknisi"),
        hasOperator: userRoles.some((role) => role.name === "operator"),
    };

    return { userFromUsePage, role };
}
