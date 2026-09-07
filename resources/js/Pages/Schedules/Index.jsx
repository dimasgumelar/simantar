import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FaCalendarAlt, FaUserCog } from "react-icons/fa";
import Breadcrumbs from "@/Components/Breadcrumbs";
import TableNotFound from "@/Components/TableNotFound";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsJadwal } from "@/Pages/Schedules/Constant";

export default function SchedulesIndex({ transmissions }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsJadwal />, "Daftar"];
    const canManageAdmin = role.hasAdmin || role.hasSdm;

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal Dinas" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Transmisi</th>
                                    <th>Admin Transmisi</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transmissions.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada transmisi yang ditemukan."
                                        colspan={4}
                                    />
                                ) : (
                                    transmissions.map((transmission, index) => (
                                        <tr key={transmission.id}>
                                            <th>{index + 1}</th>
                                            <td>
                                                {transmission.name}
                                                {transmission.is_admin_transmisi && (
                                                    <span className="badge badge-outline badge-info ml-2">
                                                        Admin Anda
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {transmission.admin_transmisi
                                                    ?.name ?? (
                                                    <span className="text-base-content/50">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                {transmission.can_view_schedule && (
                                                    <Link
                                                        href={route(
                                                            "schedules.show",
                                                            transmission.id
                                                        )}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <FaCalendarAlt />
                                                        <span className="hidden sm:flex">
                                                            Lihat Jadwal
                                                        </span>
                                                    </Link>
                                                )}
                                                {canManageAdmin && (
                                                    <Link
                                                        href={route(
                                                            "schedules.admin-transmisi.edit",
                                                            transmission.id
                                                        )}
                                                        className="btn btn-sm btn-warning"
                                                    >
                                                        <FaUserCog />
                                                        <span className="hidden sm:flex">
                                                            Atur Admin
                                                        </span>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
