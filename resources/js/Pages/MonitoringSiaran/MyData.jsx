import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";

export default function MyData({ data }) {
    const deleteData = (id, acara) => {
        if (confirm(`Yakin hapus data "${acara}"?`)) {
            router.delete(route("monitoring-siaran.destroy", id));
        }
    };

    // Format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Warna badge untuk hasil
    const getBadgeClass = (hasil) => {
        switch (hasil) {
            case "Normal":
                return "badge badge-success";
            case "Gangguan":
                return "badge badge-error";
            default:
                return "badge";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Data Monitoring Saya
                </h2>
            }
        >
            <Head title="Data Monitoring Saya" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER & NAVIGATION ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Monitoring Saya</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data monitoring
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-siaran.create")}
                            className="btn btn-primary btn-sm"
                        >
                            + Tambah Data Baru
                        </Link>
                        <Link
                            href={route("dashboard")}
                            className="btn btn-outline btn-sm"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* ================= INFO CARD ================= */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Data Monitoring Saya</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Anda hanya dapat mengedit dan menghapus data yang Anda buat sendiri
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Total Data</div>
                                        <div className="stat-value">{data.length}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Normal</div>
                                        <div className="stat-value text-success">
                                            {data.filter(d => d.hasil === "Normal").length}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Gangguan</div>
                                        <div className="stat-value text-error">
                                            {data.filter(d => d.hasil === "Gangguan").length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= DATA TABLE ================= */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-0">
                        {data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-lg font-medium">Belum ada data monitoring</p>
                                    <p className="text-sm mb-4">Silakan tambah data monitoring terlebih dahulu</p>
                                    <Link
                                        href={route("monitoring-siaran.create")}
                                        className="btn btn-primary"
                                    >
                                        + Tambah Data Monitoring
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra table-sm md:table-md">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="text-center">No</th>
                                            <th>Tanggal</th>
                                            <th>Stasiun Transmisi</th>
                                            <th>Konten Siaran</th>
                                            <th>Nama Acara</th>
                                            <th>Sumber Input</th>
                                            <th>Kategori</th>
                                            <th>Jam Mulai</th>
                                            <th>Hasil</th>
                                            <th className="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((d, index) => (
                                            <tr key={d.id} className="hover">
                                                <td className="text-center">{index + 1}</td>
                                                <td>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {formatDate(d.created_at)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(d.created_at).toLocaleTimeString('id-ID', { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit' 
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">
                                                        {d.id_transmisi}
                                                    </span>
                                                </td>
                                                <td>{d.id_konten}</td>
                                                <td className="max-w-xs">
                                                    <div className="truncate" title={d.nama_acara}>
                                                        {d.nama_acara}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline badge-sm">
                                                        {d.sumber_input}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${d.kategori === 'Live' ? 'badge-info' : 'badge-warning'}`}>
                                                        {d.kategori}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-mono">{d.jam_mulai}</span>
                                                </td>
                                                <td>
                                                    <span className={getBadgeClass(d.hasil)}>
                                                        {d.hasil}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Link
                                                            href={route("monitoring-siaran.edit", d.id)}
                                                            className="btn btn-xs btn-warning"
                                                        >
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-xs btn-error"
                                                            onClick={() => deleteData(d.id, d.nama_acara)}
                                                        >
                                                            🗑️ Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                {data.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link
                            href={route("monitoring-siaran.index")}
                            className="btn btn-secondary btn-sm"
                        >
                            Lihat Semua Data
                        </Link>
                        <Link
                            href={route("dashboard")}
                            className="btn btn-outline btn-sm"
                        >
                            Kembali ke Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}