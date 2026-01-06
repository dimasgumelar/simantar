import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Roles from "@/utils/UserFromUsePage";

export default function HomeMonitoringLive({}) {
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

            {/* ================= MONITORING LIVE ================= */}
            <div className="card bg-base-100 shadow-sm hover:shadow-md transition border-l-4 border-warning w-full mt-4">
                <div className="card-body">
                    <h2 className="card-title">
                        Persiapan Siaran Live Lapangan
                    </h2>
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
                    <h2 className="card-title">
                        Pelaksanaan Siaran Live Lapangan
                    </h2>
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
