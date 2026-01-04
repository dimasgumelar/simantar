import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index() {
    const { auth } = usePage().props;

    // State untuk form
    const { data, setData, post, processing, reset, errors } = useForm({
        tanggal_pelaksanaan: new Date().toISOString().split('T')[0],
        nama_acara: "",
        lokasi: "",
        kesiapan_peralatan: "Sangat Siap",
        detail_peralatan: [],
        peralatan_lainnya: "",
        kondisi_uji_coba: "Ya, Dilakukan dan Berjalan Baik",
        catatan_uji_coba: "",
        stabilitas_sinyal: "5",
        kualitas_av_ke_mcr: "5",
        kendala_teknis: "",
        langkah_penanganan: "",
        durasi_gangguan: "",
        proses_shutdown: "Sesuai prosedur",
        kondisi_akhir_peralatan: "Baik dan berfungsi normal",
        foto: null,
    });

    // State untuk preview foto
    const [fotoPreview, setFotoPreview] = useState(null);

    // Opsi untuk detail peralatan
    const peralatanOptions = [
        "OB Van",
        "Uplink/Downlink", 
        "Transmitter Lapangan",
        "Peralatan Pendukung Audio/Video",
        "Lainnya"
    ];

    // Opsi rating
    const ratingOptions = [
        { value: "1", label: "1 - Sangat Buruk" },
        { value: "2", label: "2 - Buruk" },
        { value: "3", label: "3 - Cukup" },
        { value: "4", label: "4 - Baik" },
        { value: "5", label: "5 - Sangat Baik" },
    ];

    // Handle pilihan peralatan
    const handlePeralatanChange = (value, isChecked) => {
        let newPeralatan = [...data.detail_peralatan];
        
        if (isChecked) {
            if (value === "Lainnya") {
                setData("peralatan_lainnya", "");
            }
            newPeralatan.push(value);
        } else {
            newPeralatan = newPeralatan.filter(item => item !== value);
            if (value === "Lainnya") {
                setData("peralatan_lainnya", "");
            }
        }
        
        setData("detail_peralatan", newPeralatan);
    };

    // Handle upload foto
    const handleFotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Cek ukuran file (max 1MB)
            if (file.size > 1024 * 1024) {
                alert("Ukuran foto maksimal 1MB!");
                e.target.value = "";
                return;
            }
            
            setData("foto", file);
            
            // Preview foto
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Validasi form sebelum submit
    const validateForm = () => {
        // Cek field required
        const requiredFields = [
            "tanggal_pelaksanaan",
            "nama_acara", 
            "lokasi",
            "kesiapan_peralatan",
            "kondisi_uji_coba",
            "stabilitas_sinyal",
            "kualitas_av_ke_mcr",
            "proses_shutdown",
            "kondisi_akhir_peralatan",
        ];

        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim() === "") {
                alert(`Field ${field.replace('_', ' ')} harus diisi!`);
                return false;
            }
        }

        // Cek detail peralatan (minimal 1)
        if (data.detail_peralatan.length === 0) {
            alert("Pilih minimal satu jenis peralatan!");
            return false;
        }

        // Cek jika pilih "Lainnya" tapi tidak diisi
        if (data.detail_peralatan.includes("Lainnya") && !data.peralatan_lainnya.trim()) {
            alert("Silakan tulis peralatan lainnya!");
            return false;
        }

        // Cek catatan uji coba jika memilih "Ya Dilakukan tetapi terdapat kendala"
        if (data.kondisi_uji_coba === "Ya Dilakukan tetapi terdapat kendala" && !data.catatan_uji_coba.trim()) {
            alert("Silakan isi catatan hasil uji coba!");
            return false;
        }

        return true;
    };

    // Handle submit form - YANG SUDAH DIPERBAIKI
    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // Siapkan data detail peralatan
        let detailPeralatan = [...data.detail_peralatan];
        if (detailPeralatan.includes("Lainnya") && data.peralatan_lainnya) {
            const index = detailPeralatan.indexOf("Lainnya");
            detailPeralatan[index] = `Lainnya: ${data.peralatan_lainnya}`;
        }
        
        // Buat FormData
        const formData = new FormData();
        
        // Tambahkan semua field ke FormData
        formData.append('tanggal_pelaksanaan', data.tanggal_pelaksanaan);
        formData.append('nama_acara', data.nama_acara);
        formData.append('lokasi', data.lokasi);
        formData.append('kesiapan_peralatan', data.kesiapan_peralatan);
        formData.append('detail_peralatan', JSON.stringify(detailPeralatan)); // JSON string
        formData.append('kondisi_uji_coba', data.kondisi_uji_coba);
        formData.append('catatan_uji_coba', data.catatan_uji_coba || '');
        formData.append('stabilitas_sinyal', parseInt(data.stabilitas_sinyal)); // Pastikan integer
        formData.append('kualitas_av_ke_mcr', parseInt(data.kualitas_av_ke_mcr)); // Pastikan integer
        formData.append('kendala_teknis', data.kendala_teknis || '');
        formData.append('langkah_penanganan', data.langkah_penanganan || '');
        formData.append('durasi_gangguan', data.durasi_gangguan || '');
        formData.append('proses_shutdown', data.proses_shutdown);
        formData.append('kondisi_akhir_peralatan', data.kondisi_akhir_peralatan);
        
        if (data.foto) {
            formData.append('foto', data.foto);
        }

        // Kirim data
        post(route('monitoring-pelaksanaan-live.store'), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
            onSuccess: () => {
                reset();
                setFotoPreview(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Pelaksanaan Siaran Live Lapangan
                </h2>
            }
        >
            <Head title="Pelaksanaan Siaran Live" />

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
                        Lihat Data Saya
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

                            {/* ================= IDENTITAS ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Identitas Pengisi
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Nama Teknisi Transmisi
                                    </label>
                                    <input
                                        className="input input-bordered"
                                        value={auth.user.name}
                                        disabled
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">
                                        Tanggal Pelaksanaan Siaran
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered"
                                        value={data.tanggal_pelaksanaan}
                                        onChange={(e) => 
                                            setData("tanggal_pelaksanaan", e.target.value)
                                        }
                                    />
                                    {errors.tanggal_pelaksanaan && (
                                        <div className="text-red-500 text-sm">{errors.tanggal_pelaksanaan}</div>
                                    )}
                                </div>
                            </div>

                            {/* ================= INFORMASI ACARA ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Informasi Acara
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Nama Acara Siaran
                                    </label>
                                    <input
                                        className="input input-bordered"
                                        value={data.nama_acara}
                                        onChange={(e) => 
                                            setData("nama_acara", e.target.value)
                                        }
                                        placeholder="Masukkan nama acara"
                                    />
                                    {errors.nama_acara && (
                                        <div className="text-red-500 text-sm">{errors.nama_acara}</div>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">
                                        Lokasi Siaran
                                    </label>
                                    <input
                                        className="input input-bordered"
                                        value={data.lokasi}
                                        onChange={(e) => 
                                            setData("lokasi", e.target.value)
                                        }
                                        placeholder="Masukkan lokasi siaran"
                                    />
                                    {errors.lokasi && (
                                        <div className="text-red-500 text-sm">{errors.lokasi}</div>
                                    )}
                                </div>
                            </div>

                            {/* ================= KESIAPAN PERALATAN ================= */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Kesiapan Peralatan Transmisi Sebelum Siaran
                                </label>
                                <div className="flex gap-4">
                                    {["Sangat Siap", "Cukup", "Kurang Siap"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="kesiapan_peralatan"
                                                className="radio"
                                                checked={data.kesiapan_peralatan === option}
                                                onChange={() => setData("kesiapan_peralatan", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.kesiapan_peralatan && (
                                    <div className="text-red-500 text-sm">{errors.kesiapan_peralatan}</div>
                                )}
                            </div>

                            {/* ================= DETAIL PERALATAN ================= */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Jenis Peralatan yang Digunakan
                                    <span className="text-error"> *</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                    {peralatanOptions.map((item) => (
                                        <label key={item} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={data.detail_peralatan.includes(item)}
                                                onChange={(e) => 
                                                    handlePeralatanChange(item, e.target.checked)
                                                }
                                            />
                                            <span className="label-text">{item}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.detail_peralatan && (
                                    <div className="text-red-500 text-sm">{errors.detail_peralatan}</div>
                                )}
                                
                                {/* Input untuk "Lainnya" */}
                                {data.detail_peralatan.includes("Lainnya") && (
                                    <div className="mt-3">
                                        <label className="label font-medium">
                                            Tulis peralatan lainnya:
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={data.peralatan_lainnya}
                                            onChange={(e) => 
                                                setData("peralatan_lainnya", e.target.value)
                                            }
                                            placeholder="Tulis jenis peralatan lainnya"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ================= UJI COBA TEKNIS ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Uji Coba Teknis
                            </h3>

                            <div className="form-control">
                                <label className="label font-medium">
                                    Apakah Uji Coba Teknis Dilakukan Sebelum Siaran?
                                </label>
                                <div className="space-y-2">
                                    {[
                                        "Ya, Dilakukan dan Berjalan Baik",
                                        "Ya Dilakukan tetapi terdapat kendala", 
                                        "Tidak Dilakukan"
                                    ].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="kondisi_uji_coba"
                                                className="radio"
                                                checked={data.kondisi_uji_coba === option}
                                                onChange={() => setData("kondisi_uji_coba", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.kondisi_uji_coba && (
                                    <div className="text-red-500 text-sm">{errors.kondisi_uji_coba}</div>
                                )}
                                
                                {/* Input catatan jika ada kendala */}
                                {data.kondisi_uji_coba === "Ya Dilakukan tetapi terdapat kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-3"
                                        placeholder="Jelaskan hasil uji coba teknis dan kendala yang ditemui..."
                                        value={data.catatan_uji_coba}
                                        onChange={(e) => setData("catatan_uji_coba", e.target.value)}
                                        rows={3}
                                    />
                                )}
                                {errors.catatan_uji_coba && (
                                    <div className="text-red-500 text-sm">{errors.catatan_uji_coba}</div>
                                )}
                            </div>

                            {/* ================= MONITORING KUALITAS ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Monitoring Kualitas Siaran
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Stabilitas Sinyal */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Stabilitas Sinyal Transmisi Selama Siaran Langsung
                                    </label>
                                    <div className="space-y-2">
                                        {ratingOptions.map((option) => (
                                            <label key={option.value} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="stabilitas_sinyal"
                                                    className="radio"
                                                    checked={data.stabilitas_sinyal === option.value}
                                                    onChange={() => setData("stabilitas_sinyal", option.value)}
                                                />
                                                <span className="label-text">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.stabilitas_sinyal && (
                                        <div className="text-red-500 text-sm">{errors.stabilitas_sinyal}</div>
                                    )}
                                </div>

                                {/* Kualitas AV ke MCR */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Kualitas Audio dan Video ke MCR/Pusat
                                    </label>
                                    <div className="space-y-2">
                                        {ratingOptions.map((option) => (
                                            <label key={option.value} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="kualitas_av_ke_mcr"
                                                    className="radio"
                                                    checked={data.kualitas_av_ke_mcr === option.value}
                                                    onChange={() => setData("kualitas_av_ke_mcr", option.value)}
                                                />
                                                <span className="label-text">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.kualitas_av_ke_mcr && (
                                        <div className="text-red-500 text-sm">{errors.kualitas_av_ke_mcr}</div>
                                    )}
                                </div>
                            </div>

                            {/* ================= KENDALA TEKNIS ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Kendala dan Penanganan
                            </h3>

                            {/* Kendala Teknis */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Kendala Teknis yang Ditemui Selama Siaran
                                </label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    placeholder="Jelaskan kendala teknis yang ditemui selama siaran (jika ada)..."
                                    value={data.kendala_teknis}
                                    onChange={(e) => setData("kendala_teknis", e.target.value)}
                                    rows={3}
                                />
                                {errors.kendala_teknis && (
                                    <div className="text-red-500 text-sm">{errors.kendala_teknis}</div>
                                )}
                            </div>

                            {/* Langkah Penanganan */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Langkah Penanganan yang Dilakukan
                                </label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    placeholder="Jelaskan langkah penanganan yang dilakukan (jika ada)..."
                                    value={data.langkah_penanganan}
                                    onChange={(e) => setData("langkah_penanganan", e.target.value)}
                                    rows={3}
                                />
                                {errors.langkah_penanganan && (
                                    <div className="text-red-500 text-sm">{errors.langkah_penanganan}</div>
                                )}
                            </div>

                            {/* Durasi Gangguan */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Durasi Gangguan (jika ada)
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={data.durasi_gangguan}
                                    onChange={(e) => setData("durasi_gangguan", e.target.value)}
                                    placeholder="Contoh: 5 menit, 30 detik, dsb."
                                />
                                {errors.durasi_gangguan && (
                                    <div className="text-red-500 text-sm">{errors.durasi_gangguan}</div>
                                )}
                            </div>

                            {/* ================= PROSES AKHIR ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Proses Akhir Siaran
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Proses Shutdown */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Proses Shutdown / Lepas Setelah Siaran
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "Sesuai prosedur",
                                            "Ada Kendala minor", 
                                            "Tidak Sesuai prosedur"
                                        ].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="proses_shutdown"
                                                    className="radio"
                                                    checked={data.proses_shutdown === option}
                                                    onChange={() => setData("proses_shutdown", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.proses_shutdown && (
                                        <div className="text-red-500 text-sm">{errors.proses_shutdown}</div>
                                    )}
                                </div>

                                {/* Kondisi Akhir Peralatan */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Kondisi Akhir Peralatan setelah Siaran
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "Baik dan berfungsi normal",
                                            "Ada Kerusakan ringan", 
                                            "Perlu perbaikan /servis"
                                        ].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="kondisi_akhir_peralatan"
                                                    className="radio"
                                                    checked={data.kondisi_akhir_peralatan === option}
                                                    onChange={() => setData("kondisi_akhir_peralatan", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.kondisi_akhir_peralatan && (
                                        <div className="text-red-500 text-sm">{errors.kondisi_akhir_peralatan}</div>
                                    )}
                                </div>
                            </div>

                            {/* ================= DOKUMENTASI ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Dokumentasi
                            </h3>

                            {/* Upload Foto */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Dokumentasi Kerusakan Peralatan Siaran (Maks. 1MB)
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    accept="image/*"
                                    onChange={handleFotoUpload}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Format: JPG, PNG, GIF (Maksimal 1MB)
                                </p>
                                {errors.foto && (
                                    <div className="text-red-500 text-sm">{errors.foto}</div>
                                )}
                                
                                {/* Preview Foto */}
                                {fotoPreview && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium mb-2">Preview Foto:</p>
                                        <img 
                                            src={fotoPreview} 
                                            alt="Preview" 
                                            className="max-w-xs rounded shadow"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ================= TOMBOL SUBMIT ================= */}
                            <div className="pt-6 border-t">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full md:w-1/2 mx-auto flex justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Simpan Data Pelaksanaan Siaran Live"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}