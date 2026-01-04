import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage, Link } from "@inertiajs/react";
import { useState } from "react";

export default function List({ data, filters }) {
    const { auth } = usePage().props;
    
    // State untuk filter
    const [localFilters, setLocalFilters] = useState({
        tanggal_dari: filters.tanggal_dari || "",
        tanggal_sampai: filters.tanggal_sampai || "",
        user_id: filters.user_id || "",
        nama_acara: filters.nama_acara || "",
        lokasi: filters.lokasi || "",
        kesiapan_peralatan: filters.kesiapan_peralatan || "",
        kondisi_akhir_peralatan: filters.kondisi_akhir_peralatan || "",
    });

    // Ambil data unik untuk dropdown filter
    const uniqueData = {
        users: [...new Set(data.map(item => ({ id: item.user.id, name: item.user.name })))].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        nama_acara: [...new Set(data.map(item => item.nama_acara))].filter(Boolean).sort(),
        lokasi: [...new Set(data.map(item => item.lokasi))].filter(Boolean).sort(),
        kesiapan_peralatan: [...new Set(data.map(item => item.kesiapan_peralatan))].filter(Boolean).sort(),
        kondisi_akhir_peralatan: [...new Set(data.map(item => item.kondisi_akhir_peralatan))].filter(Boolean).sort(),
    };

    // Fungsi untuk apply filter
    const applyFilters = () => {
        const activeFilters = {};
        Object.keys(localFilters).forEach(key => {
            if (localFilters[key] && localFilters[key] !== "") {
                activeFilters[key] = localFilters[key];
            }
        });
        
        router.get(route("monitoring-pelaksanaan-live.index"), activeFilters);
    };

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setLocalFilters({
            tanggal_dari: "",
            tanggal_sampai: "",
            user_id: "",
            nama_acara: "",
            lokasi: "",
            kesiapan_peralatan: "",
            kondisi_akhir_peralatan: "",
        });
        router.get(route("monitoring-pelaksanaan-live.index"));
    };

    // Handle perubahan filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
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
                    Semua Data Pelaksanaan Siaran Live Lapangan
                </h2>
            }
        >
            <Head title="Semua Data Pelaksanaan Live" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Pelaksanaan Siaran Live</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data ditemukan
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-pelaksanaan-live.create")}
                            className="btn btn-primary btn-sm"
                        >
                            + Tambah Data
                        </Link>
                        <a
                            href={route("monitoring-pelaksanaan-live.export.csv")}
                            className="btn btn-success btn-sm"
                            target="_blank"
                        >
                            📊 CSV
                        </a>
                        <Link
                            href={route("monitoring-pelaksanaan-live.my-data")}
                            className="btn btn-accent btn-sm"
                        >
                            Data Saya
                        </Link>
                    </div>
                </div>

                {/* ================= FILTER SECTION ================= */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h3 className="font-semibold text-lg mb-4">Filter Data</h3>
                        
                        {/* Filter Baris 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Tanggal Dari */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Tanggal Dari</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_dari"
                                    className="input input-bordered input-sm"
                                    value={localFilters.tanggal_dari}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Tanggal Sampai */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Tanggal Sampai</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_sampai"
                                    className="input input-bordered input-sm"
                                    value={localFilters.tanggal_sampai}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Nama Teknisi */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Nama Teknisi</span>
                                </label>
                                <select
                                    name="user_id"
                                    className="select select-bordered select-sm"
                                    value={localFilters.user_id}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Teknisi</option>
                                    {uniqueData.users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Acara */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Nama Acara</span>
                                </label>
                                <select
                                    name="nama_acara"
                                    className="select select-bordered select-sm"
                                    value={localFilters.nama_acara}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Acara</option>
                                    {uniqueData.nama_acara.map(acara => (
                                        <option key={acara} value={acara}>
                                            {acara}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Baris 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Lokasi */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Lokasi Siaran</span>
                                </label>
                                <select
                                    name="lokasi"
                                    className="select select-bordered select-sm"
                                    value={localFilters.lokasi}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Lokasi</option>
                                    {uniqueData.lokasi.map(lokasi => (
                                        <option key={lokasi} value={lokasi}>
                                            {lokasi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kesiapan Peralatan */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Kesiapan Peralatan</span>
                                </label>
                                <select
                                    name="kesiapan_peralatan"
                                    className="select select-bordered select-sm"
                                    value={localFilters.kesiapan_peralatan}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Status</option>
                                    {uniqueData.kesiapan_peralatan.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kondisi Akhir Peralatan */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Kondisi Akhir</span>
                                </label>
                                <select
                                    name="kondisi_akhir_peralatan"
                                    className="select select-bordered select-sm"
                                    value={localFilters.kondisi_akhir_peralatan}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Status</option>
                                    {uniqueData.kondisi_akhir_peralatan.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="form-control flex flex-col justify-end">
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={applyFilters}
                                    >
                                        Terapkan Filter
                                    </button>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={resetFilters}
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Info Filter Aktif */}
                        {Object.values(localFilters).some(value => value !== "") && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-medium">Filter Aktif:</span>
                                    
                                    {localFilters.tanggal_dari && (
                                        <span className="badge badge-info">
                                            Dari: {localFilters.tanggal_dari}
                                        </span>
                                    )}
                                    {localFilters.tanggal_sampai && (
                                        <span className="badge badge-info">
                                            Sampai: {localFilters.tanggal_sampai}
                                        </span>
                                    )}
                                    {localFilters.user_id && (
                                        <span className="badge badge-info">
                                            Teknisi: {uniqueData.users.find(u => u.id == localFilters.user_id)?.name}
                                        </span>
                                    )}
                                    {localFilters.nama_acara && (
                                        <span className="badge badge-info">
                                            Acara: {localFilters.nama_acara}
                                        </span>
                                    )}
                                    {localFilters.lokasi && (
                                        <span className="badge badge-info">
                                            Lokasi: {localFilters.lokasi}
                                        </span>
                                    )}
                                    {localFilters.kesiapan_peralatan && (
                                        <span className="badge badge-info">
                                            Kesiapan: {localFilters.kesiapan_peralatan}
                                        </span>
                                    )}
                                    {localFilters.kondisi_akhir_peralatan && (
                                        <span className="badge badge-info">
                                            Kondisi: {localFilters.kondisi_akhir_peralatan}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= DATA TABLE ================= */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra table-sm md:table-md">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="text-center">No</th>
                                        <th>Tanggal</th>
                                        <th>Teknisi</th>
                                        <th>Acara</th>
                                        <th>Lokasi</th>
                                        <th>Kesiapan</th>
                                        <th>Stabilitas</th>
                                        <th>Kualitas AV</th>
                                        <th>Kondisi Akhir</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-8">
                                                <div className="text-gray-500">
                                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-lg font-medium">Tidak ada data pelaksanaan live</p>
                                                    <p className="text-sm">Silakan tambah data atau ubah filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((d, index) => (
                                            <tr key={d.id} className="hover">
                                                <td className="text-center">{index + 1}</td>
                                                <td>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {formatDate(d.tanggal_pelaksanaan)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                                <span className="text-xs">
                                                                    {d.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span>{d.user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="max-w-xs" title={d.nama_acara}>
                                                    <div className="truncate">{d.nama_acara}</div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">{d.lokasi}</span>
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
                                                            ✏️
                                                        </Link>
                                                        {d.user_id === auth.user.id && (
                                                            <button
                                                                className="btn btn-xs btn-error"
                                                                onClick={() => {
                                                                    if (confirm(`Yakin hapus data "${d.nama_acara}"?`)) {
                                                                        router.delete(route("monitoring-pelaksanaan-live.destroy", d.id));
                                                                    }
                                                                }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}