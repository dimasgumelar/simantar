import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { BadgeRole } from "@/Components/Badge";
import Roles from "@/utils/UserFromUsePage";

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

            {/* ================= GREETING ================= */}
            <div className="card bg-base-100 shadow-sm w-full mb-4">
                <div className="card-body">
                    <div className="flex items-center">
                        <div className="text-lg">
                            Hai! <strong>{userFromUsePage.name}</strong>
                        </div>
                        <div className="ml-3">
                            <BadgeRole roles={userFromUsePage.roles} />
                        </div>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
=======
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
>>>>>>> 0f9cf0dc8c41caec251da3251f08e200e038425e

            {/* ================= MENU UTAMA (GRID) ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

<<<<<<< HEAD
                {/* ================= PEMELIHARAAN ================= */}
                {(role.hasAdmin || role.hasKetuaTim || role.hasTeknisi) && (
                    <Link href={route("maintenances.index")}>
                        <div className="card bg-base-100 shadow-sm hover:shadow-md transition">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Pemeliharaan
                                </h2>

                                <div className="stats shadow mt-2">
                                    <div className="stat place-items-center">
                                        <div className="stat-title">
                                            Menunggu
                                        </div>
                                        <div className="stat-value text-error">
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
                                        <div className="stat-title">
                                            Selesai
                                        </div>
                                        <div className="stat-value text-success">
                                            {maintenance.completed}
                                        </div>
=======
                                <div className="stat place-items-center">
                                    <div className="stat-title">Selesai</div>
                                    <div className="stat-value text-info">
                                        {maintenance.completed}
>>>>>>> 0f9cf0dc8c41caec251da3251f08e200e038425e
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
<<<<<<< HEAD
                    </Link>
                )}
=======
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
>>>>>>> 0f9cf0dc8c41caec251da3251f08e200e038425e

                {/* ================= TASK ================= */}
                {(role.hasTeknisi || role.hasOperator) && (
                    <Link href={route("tasks.index")}>
                        <div className="card bg-base-100 shadow-sm hover:shadow-md transition">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Task
                                </h2>

<<<<<<< HEAD
                                <div className="stats shadow mt-2">
                                    <div className="stat place-items-center">
                                        <div className="stat-title">
                                            Menunggu
                                        </div>
                                        <div className="stat-value text-error">
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
                                        <div className="stat-title">
                                            Selesai
                                        </div>
                                        <div className="stat-value text-success">
                                            {task.completed}
                                        </div>
=======
                                <div className="stat place-items-center">
                                    <div className="stat-title">Selesai</div>
                                    <div className="stat-value text-info">
                                        {task.completed}
>>>>>>> 0f9cf0dc8c41caec251da3251f08e200e038425e
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
                    </Link>
                )}

            </div>

            {/* ================= MONITORING SIARAN (SENDIRI DI BAWAH) ================= */}
            {(role.hasAdmin ||
                role.hasKetuaTim ||
                role.hasTeknisi ||
                role.hasOperator) && (
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition border-l-4 border-primary w-full">
                    <div className="card-body">
                        <h2 className="card-title">
                            Monitoring Siaran
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Pencatatan dan pemantauan siaran harian
                        </p>

                        {/* ===== TAMBAHAN TOMBOL (TIDAK MENGUBAH KODE LAMA) ===== */}
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route("monitoring-siaran.create")}
                                className="btn btn-primary btn-sm"
                            >
                                Isi Data
                            </Link>

                            <Link
                                href={route("monitoring-siaran.index")}
                                className="btn btn-secondary btn-sm"
                            >
                                Filter Data
                            </Link>

                            <Link
                                href={route("monitoring-siaran.my-data")}
                                className="btn btn-accent btn-sm"
                            >
                                Data Saya
                            </Link>
                        </div>
                        {/* ===== END TAMBAHAN ===== */}
                    </div>
                </div>
            )}

{/* ================= MONITORING LIVE ================= */}
<div className="card bg-base-100 shadow-sm hover:shadow-md transition border-l-4 border-warning w-full mt-4">
    <div className="card-body">
        <h2 className="card-title">Persiapan Siaran Live Lapangan</h2>
        <p className="text-sm text-gray-500 mb-4">
            Monitoring persiapan siaran live di lapangan
        </p>
        <div className="flex flex-wrap gap-2">
            <Link
                href={route("monitoring-live.create")}
                className="btn btn-warning btn-sm"
            >
                + Isi Persiapan Live
            </Link>
            <Link
                href={route("monitoring-live.index")}
                className="btn btn-secondary btn-sm"
            >
                Filter Data
            </Link>
            <Link
                href={route("monitoring-live.my-data")}
                className="btn btn-accent btn-sm"
            >
                Data Saya
            </Link>
        </div>
    </div>
</div>

{/* ================= PELAKSANAAN SIARAN LIVE ================= */}
<div className="card bg-base-100 shadow-sm hover:shadow-md transition border-l-4 border-info w-full mt-4">
    <div className="card-body">
        <h2 className="card-title">Pelaksanaan Siaran Live Lapangan</h2>
        <p className="text-sm text-gray-500 mb-4">
            Monitoring pelaksanaan dan evaluasi siaran live
        </p>
        <div className="flex flex-wrap gap-2">
            <Link
                href={route("monitoring-pelaksanaan-live.create")}
                className="btn btn-info btn-sm"
            >
                + Isi Pelaksanaan Live
            </Link>
            <Link
                href={route("monitoring-pelaksanaan-live.index")}
                className="btn btn-secondary btn-sm"
            >
                Filter Data
            </Link>
            <Link
                href={route("monitoring-pelaksanaan-live.my-data")}
                className="btn btn-accent btn-sm"
            >
                Data Saya
            </Link>
        </div>
    </div>
</div>

        </AuthenticatedLayout>
    );
}
