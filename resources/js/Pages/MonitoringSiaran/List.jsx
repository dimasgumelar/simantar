import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function List({ data, filters }) {
    const { auth } = usePage().props;
    
    // State untuk filter
    const [localFilters, setLocalFilters] = useState({
        tanggal_dari: filters.tanggal_dari || "",
        tanggal_sampai: filters.tanggal_sampai || "",
        user_id: filters.user_id || "",
        id_transmisi: filters.id_transmisi || "",
        id_konten: filters.id_konten || "",
        sumber_input: filters.sumber_input || "",
        kategori: filters.kategori || "",
        jam_mulai: filters.jam_mulai || "",
        hasil: filters.hasil || ""
    });

    // Ambil data unik untuk dropdown filter
    const uniqueData = {
        users: [...new Set(data.map(item => ({ id: item.user.id, name: item.user.name })))].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        transmisi: [...new Set(data.map(item => item.id_transmisi))].filter(Boolean).sort(),
        konten: [...new Set(data.map(item => item.id_konten))].filter(Boolean).sort(),
        sumber: [...new Set(data.map(item => item.sumber_input))].filter(Boolean).sort(),
        kategori: [...new Set(data.map(item => item.kategori))].filter(Boolean).sort(),
        hasil: [...new Set(data.map(item => item.hasil))].filter(Boolean).sort(),
        jam: [...new Set(data.map(item => item.jam_mulai))].filter(Boolean).sort()
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
        
        router.get(route("monitoring-siaran.index"), activeFilters);
    };

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setLocalFilters({
            tanggal_dari: "",
            tanggal_sampai: "",
            user_id: "",
            id_transmisi: "",
            id_konten: "",
            sumber_input: "",
            kategori: "",
            jam_mulai: "",
            hasil: ""
        });
        router.get(route("monitoring-siaran.index"));
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Semua Data Monitoring Siaran
                </h2>
            }
        >
            <Head title="Semua Data Monitoring" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Monitoring Siaran</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Total {data.length} data ditemukan
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route("monitoring-siaran.create")}
                            className="btn btn-primary btn-sm"
                        >
                            + Tambah Data
                        </Link>
                        <a
                            href={route("monitoring-siaran.export.csv")}
                            className="btn btn-success btn-sm"
                            target="_blank"
                        >
                            📊 CSV
                        </a>
                        <a
                            href={route("monitoring-siaran.export.pdf")}
                            className="btn btn-error btn-sm"
                            target="_blank"
                        >
                            📄 PDF
                        </a>
                    </div>
                </div>

                {/* ================= FILTER SECTION ================= */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h3 className="font-semibold text-lg mb-4">Filter Data</h3>
                        
                        {/* Filter Baris 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
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

                            {/* Nama Pengisi */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Nama Pengisi</span>
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
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Stasiun Transmisi */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Stasiun Transmisi</span>
                                </label>
                                <select
                                    name="id_transmisi"
                                    className="select select-bordered select-sm"
                                    value={localFilters.id_transmisi}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Stasiun</option>
                                    {uniqueData.transmisi.map(stasiun => (
                                        <option key={stasiun} value={stasiun}>
                                            {stasiun}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Baris 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                            {/* Konten Siaran */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Konten Siaran</span>
                                </label>
                                <select
                                    name="id_konten"
                                    className="select select-bordered select-sm"
                                    value={localFilters.id_konten}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Konten</option>
                                    {uniqueData.konten.map(konten => (
                                        <option key={konten} value={konten}>
                                            {konten}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sumber Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Sumber Input</span>
                                </label>
                                <select
                                    name="sumber_input"
                                    className="select select-bordered select-sm"
                                    value={localFilters.sumber_input}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Sumber</option>
                                    {uniqueData.sumber.map(sumber => (
                                        <option key={sumber} value={sumber}>
                                            {sumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kategori */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Kategori</span>
                                </label>
                                <select
                                    name="kategori"
                                    className="select select-bordered select-sm"
                                    value={localFilters.kategori}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Kategori</option>
                                    {uniqueData.kategori.map(kategori => (
                                        <option key={kategori} value={kategori}>
                                            {kategori}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Jam */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Jam Mulai</span>
                                </label>
                                <select
                                    name="jam_mulai"
                                    className="select select-bordered select-sm"
                                    value={localFilters.jam_mulai}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Jam</option>
                                    {uniqueData.jam.map(jam => (
                                        <option key={jam} value={jam}>
                                            {jam}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Baris 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Hasil */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Hasil</span>
                                </label>
                                <select
                                    name="hasil"
                                    className="select select-bordered select-sm"
                                    value={localFilters.hasil}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Hasil</option>
                                    {uniqueData.hasil.map(hasil => (
                                        <option key={hasil} value={hasil}>
                                            {hasil}
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
                                    {localFilters.id_transmisi && (
                                        <span className="badge badge-info">
                                            Stasiun: {localFilters.id_transmisi}
                                        </span>
                                    )}
                                    {localFilters.id_konten && (
                                        <span className="badge badge-info">
                                            Konten: {localFilters.id_konten}
                                        </span>
                                    )}
                                    {localFilters.sumber_input && (
                                        <span className="badge badge-info">
                                            Sumber: {localFilters.sumber_input}
                                        </span>
                                    )}
                                    {localFilters.kategori && (
                                        <span className="badge badge-info">
                                            Kategori: {localFilters.kategori}
                                        </span>
                                    )}
                                    {localFilters.jam_mulai && (
                                        <span className="badge badge-info">
                                            Jam: {localFilters.jam_mulai}
                                        </span>
                                    )}
                                    {localFilters.hasil && (
                                        <span className="badge badge-info">
                                            Hasil: {localFilters.hasil}
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
                                        <th>Pengisi</th>
                                        <th>Stasiun</th>
                                        <th>Konten</th>
                                        <th>Acara</th>
                                        <th>Sumber Input</th>
                                        <th>Kategori</th>
                                        <th>Jam</th>
                                        <th>Hasil</th>
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
                                                    <p className="text-lg font-medium">Tidak ada data monitoring</p>
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
                                                            {formatDate(d.created_at)}
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
                                                <td>
                                                    <span className="badge badge-outline">{d.id_transmisi}</span>
                                                </td>
                                                <td>{d.id_konten}</td>
                                                <td className="max-w-xs" title={d.nama_acara}>
                                                    <div className="truncate">{d.nama_acara}</div>
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
                                                    <span className={`badge ${d.hasil === 'Normal' ? 'badge-success' : 'badge-error'}`}>
                                                        {d.hasil}
                                                    </span>
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