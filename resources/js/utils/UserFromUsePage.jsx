import { usePage } from "@inertiajs/react";

export default function Roles() {
    const { props } = usePage();
    const userFromUsePage = props.auth.user;

    const role = {
        hasAdmin: userFromUsePage.roles.some((role) => role.name === "admin"),
        hasKetuaTim: userFromUsePage.roles.some(
            (role) => role.name === "ketua tim"
        ),
        hasTeknisi: userFromUsePage.roles.some(
            (role) => role.name === "teknisi"
        ),
        hasOperator: userFromUsePage.roles.some(
            (role) => role.name === "operator"
        ),
        hasKoordinator: userFromUsePage.roles.some(
            (role) => role.name === "koordinator"
        ),
    };

    return { userFromUsePage, role };
}
