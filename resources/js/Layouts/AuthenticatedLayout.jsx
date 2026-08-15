import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaHome, FaUser, FaBroadcastTower, FaBook } from "react-icons/fa";
import FlashToast from "@/Components/FlashToast";

export default function AuthenticatedLayout({ children }) {
    const { props } = usePage();
    const userFromUsePage = props.auth.user;

    const menuItems = [
        {
            label: "Beranda",
            icon: <FaHome />,
            routeStr: "dashboard",
            roles: ["admin", "ketua tim", "teknisi", "operator", "koordinator"],
        },
        {
            label: "Pengguna",
            icon: <FaUser />,
            routeStr: "users.index",
            roles: ["admin", "ketua tim"],
        },
        {
            label: "Transmisi",
            icon: <FaBroadcastTower />,
            routeStr: "transmissions.index",
            roles: ["admin", "ketua tim", "teknisi", "operator", "koordinator"],
        },
        {
            label: "Logbook",
            icon: <FaBook />,
            routeStr: "logbooks.index",
            roles: ["admin", "ketua tim", "teknisi", "operator", "koordinator"],
        },
    ];
    const userRoleNames =
        userFromUsePage?.roles?.map((role) => role.name) ?? [];

    const [open, setOpen] = useState(
        () => JSON.parse(localStorage.getItem("sidebar-open")) ?? true
    );

    useEffect(() => {
        localStorage.setItem("sidebar-open", JSON.stringify(open));
    }, [open]);

    return (
        <div className="flex h-screen">
            <FlashToast />
            {/* Sidebar */}
            <div
                className={`hidden sm:flex bg-base-200 p-4 flex-col transition-width duration-300 ${
                    open ? "w-60" : "w-16"
                }`}
            >
                {menuItems
                    .filter((item) =>
                        item.roles.some((role) => userRoleNames.includes(role))
                    )
                    .map(({ label, icon, routeStr }) => (
                        <Link
                            key={label}
                            className={`flex items-center h-10 rounded hover:bg-base-300 ${
                                open ? "gap-4 px-3" : "justify-center"
                            }`}
                            href={route(routeStr)}
                        >
                            <span className="flex-shrink-0 text-lg leading-none">
                                {icon}
                            </span>
                            {open && <span>{label}</span>}
                        </Link>
                    ))}
            </div>

            {/* Content area */}
            <div className="flex flex-col h-screen bg-base-100 w-full">
                {/* Sticky Navbar */}
                <div className="navbar h-16 bg-base-100 shadow-sm">
                    <div className="flex-none">
                        <button
                            className="btn btn-square btn-ghost hidden sm:flex"
                            onClick={() => setOpen(!open)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-5 w-5 stroke-current"
                            >
                                {" "}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>{" "}
                            </svg>
                        </button>
                        <div className="drawer flex sm:hidden">
                            <input
                                id="my-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />
                            <div className="drawer-content">
                                {/* Page content here */}
                                <label
                                    htmlFor="my-drawer"
                                    className="btn btn-square btn-ghost drawer-button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-5 w-5 stroke-current"
                                    >
                                        {" "}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        ></path>{" "}
                                    </svg>
                                </label>
                            </div>
                            <div className="drawer-side">
                                <label
                                    htmlFor="my-drawer"
                                    aria-label="close sidebar"
                                    className="drawer-overlay"
                                ></label>
                                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                                    {/* Sidebar content here */}
                                    {menuItems
                                        .filter((item) =>
                                            item.roles.some((role) =>
                                                userRoleNames.includes(role)
                                            )
                                        )
                                        .map(({ label, icon, routeStr }) => (
                                            <Link
                                                key={label}
                                                href={route(routeStr)}
                                                className="flex items-center space-x-4 hover:bg-base-300 rounded p-2"
                                            >
                                                {icon}
                                                <span>{label}</span>
                                            </Link>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Link
                            className="btn btn-ghost text-xl"
                            href={route("dashboard")}
                        >
                            SIMANTAR
                        </Link>
                    </div>
                    <div className="dropdown dropdown-end mr-3">
                        <div
                            tabIndex={0}
                            role="button"
                            className={`btn btn-ghost btn-circle ${
                                userFromUsePage?.photo_path
                                    ? "avatar"
                                    : "avatar avatar-placeholder"
                            }`}
                        >
                            {userFromUsePage?.photo_path ? (
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Foto profil"
                                        src={`/storage/${userFromUsePage.photo_path}`}
                                    />
                                </div>
                            ) : (
                                <div className="bg-neutral text-neutral-content w-10 rounded-full">
                                    <span>
                                        {userFromUsePage?.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link
                                    href={route("profile.edit")}
                                    className="text-base-content"
                                >
                                    Profil
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    onSuccess={() => window.location.reload()}
                                    className="text-base-content"
                                >
                                    Keluar
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
