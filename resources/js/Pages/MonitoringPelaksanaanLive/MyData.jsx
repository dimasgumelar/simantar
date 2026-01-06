import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";

export default function MyData({ data }) {
    const deleteData = (id, acara) => {
        if (confirm(`Yakin hapus data "${acara}"?`)) {
            router.delete(route("monitoring-pelaksanaan-live.destroy", id));
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

    // Format detail peralatan
    const formatPeralatan = (peralatanArray) => {
        if (!peralatanArray || !Array.isArray(peralatanArray)) return "-";
        return peralatanArray.join(", ");
    };

    // Warna badge untuk rating
    const getRatingBadge = (rating) => {
        const colors = {
            '1': 'badge-error',
            '2': 'badge-warning',
            '3': 'badge-info',
            '4': 'badge-success',
            '5': 'badge-success',
        };
        return colors[rating] || 'badge';
    };

    // Label untuk rating
    const getRatingLabel = (rating) => {
        const labels = {
            '1': 'Sangat Buruk',
            '2': 'Buruk',
            '3': 'Cukup',
            '4': 'Baik',
            '5': 'Sangat Baik',
        };
        return labels[rating] || 'Tidak dinilai';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Data Pelaksanaan Siaran Live Lapangan - Saya
                </h2>
            }
        >
            <Head title="Data Pelaksanaan Live Saya" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER & NAVIGATION ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Pelaksanaan Live Saya</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data monitoring
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-pelaksanaan-live.create")}
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
                                <h3 className="font-semibold text-lg">Data Pelaksanaan Siaran Live Saya</h3>
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
                                        <div className="stat-title">Kesiapan Siap</div>
                                        <div className="stat-value text-success">
                                            {data.filter(d => d.kesiapan_peralatan === "Sangat Siap").length}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Kondisi Baik</div>
                                        <div className="stat-value text-success">
                                            {data.filter(d => d.kondisi_akhir_peralatan === "Baik dan berfungsi normal").length}
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
                                    <p className="text-lg font-medium">Belum ada data pelaksanaan live</p>
                                    <p className="text-sm mb-4">Silakan tambah data monitoring terlebih dahulu</p>
                                    <Link
                                        href={route("monitoring-pelaksanaan-live.create")}
                                        className="btn btn-primary"
                                    >
                                        + Tambah Data Pelaksanaan Live
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
                                            <th>Nama Acara</th>
                                            <th>Lokasi</th>
                                            <th>Peralatan</th>
                                            <th>Kesiapan</th>
                                            <th>Stabilitas</th>
                                            <th>Kualitas AV</th>
                                            <th>Kondisi Akhir</th>
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
                                                            {formatDate(d.tanggal_pelaksanaan)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="max-w-xs">
                                                    <div className="truncate" title={d.nama_acara}>
                                                        {d.nama_acara}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">
                                                        {d.lokasi}
                                                    </span>
                                                </td>
                                                <td className="max-w-xs">
                                                    <div className="truncate text-sm" title={formatPeralatan(d.detail_peralatan)}>
                                                        {formatPeralatan(d.detail_peralatan).length > 50 
                                                            ? formatPeralatan(d.detail_peralatan).substring(0, 50) + '...'
                                                            : formatPeralatan(d.detail_peralatan)
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        d.kesiapan_peralatan === 'Sangat Siap' ? 'badge-success' :
                                                        d.kesiapan_peralatan === 'Cukup' ? 'badge-warning' : 'badge-error'
                                                    }`}>
                                                        {d.kesiapan_peralatan}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getRatingBadge(d.stabilitas_sinyal)}`}>
                                                        {d.stabilitas_sinyal} - {getRatingLabel(d.stabilitas_sinyal)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getRatingBadge(d.kualitas_av_ke_mcr)}`}>
                                                        {d.kualitas_av_ke_mcr} - {getRatingLabel(d.kualitas_av_ke_mcr)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        d.kondisi_akhir_peralatan === 'Baik dan berfungsi normal' ? 'badge-success' :
                                                        d.kondisi_akhir_peralatan === 'Ada Kerusakan ringan' ? 'badge-warning' : 'badge-error'
                                                    }`}>
                                                        {d.kondisi_akhir_peralatan}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Link
                                                            href={route("monitoring-pelaksanaan-live.edit", d.id)}
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
                            href={route("monitoring-pelaksanaan-live.index")}
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