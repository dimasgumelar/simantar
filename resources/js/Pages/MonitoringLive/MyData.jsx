import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";

export default function MyData({ data }) {
    const deleteData = (id, acara) => {
        if (confirm(`Yakin hapus data "${acara}"?`)) {
            router.delete(route("monitoring-live.destroy", id));
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

    // Hitung status tegangan
    const getStatusTegangan = (tegangan) => {
        return (tegangan >= 198 && tegangan <= 242) ? 'Normal' : 'Tidak Normal';
    };

    // Format detail peralatan
    const formatPeralatan = (peralatanArray) => {
        if (!peralatanArray || !Array.isArray(peralatanArray)) return "-";
        return peralatanArray.join(", ");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Data Persiapan Siaran Live Lapangan - Saya
                </h2>
            }
        >
            <Head title="Data Persiapan Live Saya" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER & NAVIGATION ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Persiapan Live Saya</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data monitoring
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-live.create")}
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
                                <h3 className="font-semibold text-lg">Data Persiapan Siaran Live Saya</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Anda hanya dapat mengedit dan menghapus data yang Anda buat sendiri
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <div className="stats shadow stats-vertical md:stats-horizontal">
                                    <div className="stat">
                                        <div className="stat-title text-sm">Total Data</div>
                                        <div className="stat-value text-lg">{data.length}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-sm">PC Normal</div>
                                        <div className="stat-value text-lg text-success">
                                            {data.filter(d => d.kondisi_pc === "Normal").length}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-sm">Tegangan Normal</div>
                                        <div className="stat-value text-lg text-success">
                                            {data.filter(d => getStatusTegangan(d.jumlah_tegangan_listrik) === "Normal").length}
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
                                    <p className="text-lg font-medium">Belum ada data monitoring live</p>
                                    <p className="text-sm mb-4">Silakan tambah data monitoring terlebih dahulu</p>
                                    <Link
                                        href={route("monitoring-live.create")}
                                        className="btn btn-primary"
                                    >
                                        + Tambah Data Persiapan Live
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra table-sm md:table-md">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="text-center w-12">No</th>
                                            <th className="min-w-28 whitespace-nowrap">Tanggal Persiapan</th>
                                            <th className="min-w-36 whitespace-nowrap">Nama Acara</th>
                                            <th className="min-w-24 whitespace-nowrap">Lokasi</th>
                                            <th className="min-w-40 whitespace-nowrap">Peralatan</th>
                                            <th className="min-w-28 whitespace-nowrap">Kondisi PC</th>
                                            <th className="min-w-28 whitespace-nowrap">STL Internet</th>
                                            <th className="min-w-32 whitespace-nowrap">Tegangan Listrik</th>
                                            <th className="min-w-28 whitespace-nowrap">Sumber Listrik</th>
                                            <th className="min-w-32 whitespace-nowrap">Uji Komunikasi</th>
                                            <th className="text-center min-w-32 whitespace-nowrap">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((d, index) => (
                                            <tr key={d.id} className="hover">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {formatDate(d.tanggal_persiapan)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="max-w-[200px]">
                                                    <div className="truncate" title={d.nama_acara}>
                                                        {d.nama_acara}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline whitespace-nowrap">
                                                        {d.lokasi}
                                                    </span>
                                                </td>
                                                <td className="max-w-[180px]">
                                                    <div className="truncate text-sm" title={formatPeralatan(d.detail_peralatan)}>
                                                        {formatPeralatan(d.detail_peralatan).length > 40 
                                                            ? formatPeralatan(d.detail_peralatan).substring(0, 40) + '...'
                                                            : formatPeralatan(d.detail_peralatan)
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge whitespace-nowrap ${d.kondisi_pc === 'Normal' ? 'badge-success' : 'badge-error'}`}>
                                                        {d.kondisi_pc}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge whitespace-nowrap ${d.stl_internet === 'Normal' ? 'badge-success' : 'badge-error'}`}>
                                                        {d.stl_internet}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-mono">{d.jumlah_tegangan_listrik} V</span>
                                                        <span className={`text-xs whitespace-nowrap ${getStatusTegangan(d.jumlah_tegangan_listrik) === 'Normal' ? 'text-success' : 'text-error'}`}>
                                                            {getStatusTegangan(d.jumlah_tegangan_listrik)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline whitespace-nowrap">{d.asal_sumber_listrik}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge whitespace-nowrap ${d.uji_komunikasi === 'Sangat Lancar' ? 'badge-success' : d.uji_komunikasi === 'Cukup Lancar' ? 'badge-warning' : 'badge-error'}`}>
                                                        {d.uji_komunikasi}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex gap-2 justify-center whitespace-nowrap">
                                                        <Link
                                                            href={route("monitoring-live.edit", d.id)}
                                                            className="btn btn-xs btn-warning px-3"
                                                        >
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-xs btn-error px-3"
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
                            href={route("monitoring-live.index")}
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