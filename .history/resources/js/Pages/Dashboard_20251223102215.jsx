import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BadgeRole } from "@/Components/Badge";
import Roles from "@/utils/UserFromUsePage";
import { Link } from "@inertiajs/react";

export default function Dashboard({ maintenance, task }) {
    const { userFromUsePage, role } = Roles();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Beranda
                </h2>
            }
        >
            <Head title="Beranda" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex flex-row items-center">
                        <div>Hai! {userFromUsePage.name}</div>
                        <div className="ml-2">
                            <BadgeRole roles={userFromUsePage.roles} />
                        </div>
                    </div>
                </div>
            </div>
            {(role.hasAdmin || role.hasKetuaTim || role.hasTeknisi) && (
                <Link href={route("maintenances.index")}>
                    <div className="card bg-base-100 shadow-sm w-full">
                        <div className="card-body">
                            <h2 className="card-title">Pemeliharan</h2>
                            <div className="stats shadow">
                                <div className="stat place-items-center">
                                    <div className="stat-title">Menunggu</div>
                                    <div className="stat-value text-primary">
                                        {maintenance.pending}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">
                                        Dalam Proses
                                    </div>
                                    <div className="stat-value text-warning">
                                        {maintenance.inprogress}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Selesai</div>
                                    <div className="stat-value text-info">
                                        {maintenance.completed}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Ditolak</div>
                                    <div className="stat-value text-error">
                                        {maintenance.rejected}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Disetujui</div>
                                    <div className="stat-value text-success">
                                        {maintenance.approved}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
            {(role.hasTeknisi || role.hasOperator) && (
                <Link href={route("tasks.index")}>
                    <div className="card bg-base-100 shadow-sm w-full">
                        <div className="card-body">
                            <h2 className="card-title">Task</h2>
                            <div className="stats shadow">
                                <div className="stat place-items-center">
                                    <div className="stat-title">Menunggu</div>
                                    <div className="stat-value text-primary">
                                        {task.pending}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">
                                        Dalam Proses
                                    </div>
                                    <div className="stat-value text-warning">
                                        {task.inprogress}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Selesai</div>
                                    <div className="stat-value text-info">
                                        {task.completed}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Ditolak</div>
                                    <div className="stat-value text-error">
                                        {task.rejected}
                                    </div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Disetujui</div>
                                    <div className="stat-value text-success">
                                        {task.approved}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </AuthenticatedLayout>
    );
}
