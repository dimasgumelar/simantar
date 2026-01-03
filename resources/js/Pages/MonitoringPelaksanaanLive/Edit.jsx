import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ monitoring }) {
    const { auth } = usePage().props;

    // Parse detail peralatan dari JSON
    const parsePeralatan = (peralatanArray) => {
        if (!peralatanArray || !Array.isArray(peralatanArray)) return [];
        return peralatanArray.map(item => {
            if (item.startsWith('Lainnya: ')) {
                return 'Lainnya';
            }
            return item;
        });
    };

    // Get nilai "Lainnya" dari detail peralatan
    const getPeralatanLainnya = (peralatanArray) => {
        if (!peralatanArray || !Array.isArray(peralatanArray)) return "";
        const lainnyaItem = peralatanArray.find(item => item.startsWith('Lainnya: '));
        if (lainnyaItem) {
            return lainnyaItem.replace('Lainnya: ', '');
        }
        return "";
    };

    // State untuk form - SAMA seperti Index.jsx tapi dengan data dari props
    const { data, setData, put, processing, reset } = useForm({
        tanggal_pelaksanaan: monitoring.tanggal_pelaksanaan,
        nama_acara: monitoring.nama_acara || "",
        lokasi: monitoring.lokasi || "",
        kesiapan_peralatan: monitoring.kesiapan_peralatan || "Sangat Siap",
        detail_peralatan: parsePeralatan(monitoring.detail_peralatan) || [],
        peralatan_lainnya: getPeralatanLainnya(monitoring.detail_peralatan) || "",
        kondisi_uji_coba: monitoring.kondisi_uji_coba || "Ya, Dilakukan dan Berjalan Baik",
        catatan_uji_coba: monitoring.catatan_uji_coba || "",
        stabilitas_sinyal: monitoring.stabilitas_sinyal || "5",
        kualitas_av_ke_mcr: monitoring.kualitas_av_ke_mcr || "5",
        kendala_teknis: monitoring.kendala_teknis || "",
        langkah_penanganan: monitoring.langkah_penanganan || "",
        durasi_gangguan: monitoring.durasi_gangguan || "",
        proses_shutdown: monitoring.proses_shutdown || "Sesuai prosedur",
        kondisi_akhir_peralatan: monitoring.kondisi_akhir_peralatan || "Baik dan berfungsi normal",
        foto: null,
    });

    // State untuk preview foto
    const [fotoPreview, setFotoPreview] = useState(
        monitoring.foto ? `/storage/${monitoring.foto}` : null
    );
    const [currentFoto, setCurrentFoto] = useState(monitoring.foto);

    // ... semua fungsi, opsi, dan validasi SAMA seperti Index.jsx ...

    // Handle submit form untuk UPDATE
    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // Siapkan data detail peralatan
        let detailPeralatan = [...data.detail_peralatan];
        if (detailPeralatan.includes("Lainnya") && data.peralatan_lainnya) {
            const index = detailPeralatan.indexOf("Lainnya");
            detailPeralatan[index] = `Lainnya: ${data.peralatan_lainnya}`;
        }
        
        // Update data sebelum dikirim
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('tanggal_pelaksanaan', data.tanggal_pelaksanaan);
        formData.append('nama_acara', data.nama_acara);
        formData.append('lokasi', data.lokasi);
        formData.append('kesiapan_peralatan', data.kesiapan_peralatan);
        formData.append('detail_peralatan', JSON.stringify(detailPeralatan));
        formData.append('kondisi_uji_coba', data.kondisi_uji_coba);
        formData.append('catatan_uji_coba', data.catatan_uji_coba);
        formData.append('stabilitas_sinyal', data.stabilitas_sinyal);
        formData.append('kualitas_av_ke_mcr', data.kualitas_av_ke_mcr);
        formData.append('kendala_teknis', data.kendala_teknis);
        formData.append('langkah_penanganan', data.langkah_penanganan);
        formData.append('durasi_gangguan', data.durasi_gangguan);
        formData.append('proses_shutdown', data.proses_shutdown);
        formData.append('kondisi_akhir_peralatan', data.kondisi_akhir_peralatan);
        
        if (data.foto) {
            formData.append('foto', data.foto);
        }

        // Kirim data update
        put(route('monitoring-pelaksanaan-live.update', monitoring.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                alert('Data berhasil diperbarui!');
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Edit Data Pelaksanaan Siaran Live Lapangan
                </h2>
            }
        >
            <Head title="Edit Data Pelaksanaan Live" />

            {/* ================= NAVIGASI ================= */}
            <div className="max-w-5xl mx-auto mb-4">
                <div className="flex flex-wrap gap-2">
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
                    <Link
                        href={route("dashboard")}
                        className="btn btn-outline btn-sm"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* ================= KONTEN FORM SAMA seperti Index.jsx ================= */}
                            {/* Copy semua JSX dari Index.jsx di sini */}
                            {/* Hanya ganti: */}
                            {/* 1. Value form dari state data */}
                            {/* 2. Tombol submit text: "Update Data Pelaksanaan Siaran Live" */}
                            
                            {/* ... semua field form sama seperti Index.jsx ... */}

                            {/* ================= DOKUMENTASI (Dengan handle edit foto) ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Dokumentasi
                            </h3>

                            <div className="form-control">
                                <label className="label font-medium">
                                    Dokumentasi Kerusakan Peralatan Siaran (Maks. 1MB)
                                </label>
                                
                                {/* Foto saat ini */}
                                {currentFoto && (
                                    <div className="mb-3">
                                        <p className="text-sm font-medium mb-2">Foto saat ini:</p>
                                        <img 
                                            src={`/storage/${currentFoto}`} 
                                            alt="Current" 
                                            className="max-w-xs rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-error btn-xs mt-2"
                                            onClick={() => {
                                                setData("foto", null);
                                                setCurrentFoto(null);
                                                setFotoPreview(null);
                                            }}
                                        >
                                            Hapus Foto
                                        </button>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024) {
                                                alert("Ukuran foto maksimal 1MB!");
                                                e.target.value = "";
                                                return;
                                            }
                                            
                                            setData("foto", file);
                                            setCurrentFoto(null);
                                            
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                setFotoPreview(e.target.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Format: JPG, PNG, GIF (Maksimal 1MB)
                                </p>
                                
                                {/* Preview Foto Baru */}
                                {fotoPreview && !currentFoto && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium mb-2">Preview Foto Baru:</p>
                                        <img 
                                            src={fotoPreview} 
                                            alt="Preview" 
                                            className="max-w-xs rounded shadow"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ================= TOMBOL SUBMIT ================= */}
                            <div className="pt-6 border-t flex flex-wrap gap-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Update Data Pelaksanaan"
                                    )}
                                </button>
                                <Link
                                    href={route("monitoring-pelaksanaan-live.my-data")}
                                    className="btn btn-outline"
                                >
                                    Batal
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}