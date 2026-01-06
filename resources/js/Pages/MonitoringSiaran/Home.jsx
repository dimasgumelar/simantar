import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Roles from "@/utils/UserFromUsePage";

export default function HomeMonitoringSiaran({}) {
    const { userFromUsePage, role } = Roles();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Monitroing Siaran
                </h2>
            }
        >
            <Head title="Monitroing Siaran" />

            {/* ================= MONITORING SIARAN (SENDIRI DI BAWAH) ================= */}
            {(role.hasAdmin ||
                role.hasKetuaTim ||
                role.hasTeknisi ||
                role.hasOperator) && (
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition border-l-4 border-primary w-full">
                    <div className="card-body">
                        <h2 className="card-title">Monitoring Siaran</h2>
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
        </AuthenticatedLayout>
    );
}
