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
        kondisi_pc: filters.kondisi_pc || "",
        stl_internet: filters.stl_internet || "",
        asal_sumber_listrik: filters.asal_sumber_listrik || "",
        uji_komunikasi: filters.uji_komunikasi || "",
        hasil_uji_tx: filters.hasil_uji_tx || "",
    });

    // Ambil data unik untuk dropdown filter
    const uniqueData = {
        users: [...new Set(data.map(item => ({ id: item.user.id, name: item.user.name })))].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        nama_acara: [...new Set(data.map(item => item.nama_acara))].filter(Boolean).sort(),
        lokasi: [...new Set(data.map(item => item.lokasi))].filter(Boolean).sort(),
        kondisi_pc: [...new Set(data.map(item => item.kondisi_pc))].filter(Boolean).sort(),
        stl_internet: [...new Set(data.map(item => item.stl_internet))].filter(Boolean).sort(),
        asal_sumber_listrik: [...new Set(data.map(item => item.asal_sumber_listrik))].filter(Boolean).sort(),
        uji_komunikasi: [...new Set(data.map(item => item.uji_komunikasi))].filter(Boolean).sort(),
        hasil_uji_tx: [...new Set(data.map(item => item.hasil_uji_tx))].filter(Boolean).sort(),
    };

    // Fungsi untuk apply filter
    const applyFilters = () => {
        // Hapus filter yang kosong
        const activeFilters = {};
        Object.keys(localFilters).forEach(key => {
            if (localFilters[key] && localFilters[key] !== "") {
                activeFilters[key] = localFilters[key];
            }
        });
        
        router.get(route("monitoring-live.index"), activeFilters);
    };

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setLocalFilters({
            tanggal_dari: "",
            tanggal_sampai: "",
            user_id: "",
            nama_acara: "",
            lokasi: "",
            kondisi_pc: "",
            stl_internet: "",
            asal_sumber_listrik: "",
            uji_komunikasi: "",
            hasil_uji_tx: "",
        });
        router.get(route("monitoring-live.index"));
    };

    // Fungsi untuk handle perubahan filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Format tanggal untuk display
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

    // Format detail peralatan dari JSON
    const formatPeralatan = (peralatanArray) => {
        if (!peralatanArray || !Array.isArray(peralatanArray)) return "-";
        return peralatanArray.join(", ");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Semua Data Persiapan Siaran Live Lapangan
                </h2>
            }
        >
            <Head title="Semua Data Monitoring Live" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Persiapan Siaran Live</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data ditemukan
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-live.create")}
                            className="btn btn-primary btn-sm"
                        >
                            + Tambah Data
                        </Link>
                        <a
                            href={route("monitoring-live.export.csv")}
                            className="btn btn-success btn-sm"
                            target="_blank"
                        >
                            📊 CSV
                        </a>
                        <Link
                            href={route("monitoring-live.my-data")}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            {/* Tanggal Dari */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Tanggal Dari</span>
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
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Tanggal Sampai</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_sampai"
                                    className="input input-bordered input-sm"
                                    value={localFilters.tanggal_sampai}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Nama Pengisi */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Nama Pengisi</span>
                                </label>
                                <select
                                    name="user_id"
                                    className="select select-bordered select-sm"
                                    value={localFilters.user_id}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Pengisi</option>
                                    {uniqueData.users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name.length > 20 ? user.name.substring(0, 20) + '...' : user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Acara */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Nama Acara</span>
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
                                            {acara.length > 25 ? acara.substring(0, 25) + '...' : acara}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Baris 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            {/* Lokasi */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Lokasi Siaran</span>
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
                                            {lokasi.length > 20 ? lokasi.substring(0, 20) + '...' : lokasi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kondisi PC */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Kondisi PC</span>
                                </label>
                                <select
                                    name="kondisi_pc"
                                    className="select select-bordered select-sm"
                                    value={localFilters.kondisi_pc}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Status</option>
                                    {uniqueData.kondisi_pc.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* STL Internet */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">STL Internet</span>
                                </label>
                                <select
                                    name="stl_internet"
                                    className="select select-bordered select-sm"
                                    value={localFilters.stl_internet}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Status</option>
                                    {uniqueData.stl_internet.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sumber Listrik */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Sumber Listrik</span>
                                </label>
                                <select
                                    name="asal_sumber_listrik"
                                    className="select select-bordered select-sm"
                                    value={localFilters.asal_sumber_listrik}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Sumber</option>
                                    {uniqueData.asal_sumber_listrik.map(sumber => (
                                        <option key={sumber} value={sumber}>
                                            {sumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Baris 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {/* Uji Komunikasi */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Uji Komunikasi</span>
                                </label>
                                <select
                                    name="uji_komunikasi"
                                    className="select select-bordered select-sm"
                                    value={localFilters.uji_komunikasi}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Status</option>
                                    {uniqueData.uji_komunikasi.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hasil Uji TX */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-sm">Hasil Uji TX</span>
                                </label>
                                <select
                                    name="hasil_uji_tx"
                                    className="select select-bordered select-sm"
                                    value={localFilters.hasil_uji_tx}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Hasil</option>
                                    {uniqueData.hasil_uji_tx.map(hasil => (
                                        <option key={hasil} value={hasil}>
                                            {hasil.length > 30 ? hasil.substring(0, 30) + '...' : hasil}
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
                                            Pengisi: {uniqueData.users.find(u => u.id == localFilters.user_id)?.name}
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
                                    {localFilters.kondisi_pc && (
                                        <span className="badge badge-info">
                                            PC: {localFilters.kondisi_pc}
                                        </span>
                                    )}
                                    {localFilters.stl_internet && (
                                        <span className="badge badge-info">
                                            Internet: {localFilters.stl_internet}
                                        </span>
                                    )}
                                    {localFilters.asal_sumber_listrik && (
                                        <span className="badge badge-info">
                                            Listrik: {localFilters.asal_sumber_listrik}
                                        </span>
                                    )}
                                    {localFilters.uji_komunikasi && (
                                        <span className="badge badge-info">
                                            Komunikasi: {localFilters.uji_komunikasi}
                                        </span>
                                    )}
                                    {localFilters.hasil_uji_tx && (
                                        <span className="badge badge-info">
                                            Hasil TX: {localFilters.hasil_uji_tx}
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
                                        <th className="text-center w-12">No</th>
                                        <th className="min-w-24 whitespace-nowrap">Tanggal</th>
                                        <th className="min-w-32 whitespace-nowrap">Pengisi</th>
                                        <th className="min-w-36 whitespace-nowrap">Nama Acara</th>
                                        <th className="min-w-24 whitespace-nowrap">Lokasi</th>
                                        <th className="min-w-40 whitespace-nowrap">Peralatan</th>
                                        <th className="min-w-28 whitespace-nowrap">Kondisi PC</th>
                                        <th className="min-w-28 whitespace-nowrap">STL Internet</th>
                                        <th className="min-w-28 whitespace-nowrap">Tegangan</th>
                                        <th className="min-w-32 whitespace-nowrap">Status</th>
                                        <th className="min-w-32 whitespace-nowrap">Sumber Listrik</th>
                                        <th className="text-center min-w-20 whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan="12" className="text-center py-8">
                                                <div className="text-gray-500">
                                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-lg font-medium">Tidak ada data monitoring live</p>
                                                    <p className="text-sm">Silakan tambah data atau ubah filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((d, index) => (
                                            <tr key={d.id} className="hover">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {formatDate(d.tanggal_persiapan)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="avatar placeholder shrink-0">
                                                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                                <span className="text-xs">
                                                                    {d.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="truncate">{d.user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="max-w-[200px]">
                                                    <div className="truncate" title={d.nama_acara}>
                                                        {d.nama_acara}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline whitespace-nowrap">{d.lokasi}</span>
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
                                                    <span className={`badge whitespace-nowrap ${d.uji_komunikasi === 'Sangat Lancar' ? 'badge-success' : d.uji_komunikasi === 'Cukup Lancar' ? 'badge-warning' : 'badge-error'}`}>
                                                        {d.uji_komunikasi}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline whitespace-nowrap">{d.asal_sumber_listrik}</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        <Link
                                                            href={route("monitoring-live.edit", d.id)}
                                                            className="btn btn-xs btn-warning px-2"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </Link>
                                                        {d.user_id === auth.user.id && (
                                                            <button
                                                                className="btn btn-xs btn-error px-2"
                                                                onClick={() => {
                                                                    if (confirm(`Yakin hapus data "${d.nama_acara}"?`)) {
                                                                        router.delete(route("monitoring-live.destroy", d.id));
                                                                    }
                                                                }}
                                                                title="Hapus"
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