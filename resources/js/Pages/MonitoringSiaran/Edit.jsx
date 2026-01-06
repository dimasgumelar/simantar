import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useEffect } from "react";

export default function Edit({ data: monitoringData }) {
    const { auth } = usePage().props;

    const { data: form, setData, put, processing, reset } = useForm({
        id_transmisi: monitoringData.id_transmisi || "",
        id_konten: monitoringData.id_konten || "",
        sumber_input: monitoringData.sumber_input || "",
        nama_acara: monitoringData.nama_acara || "",
        kategori: monitoringData.kategori || "",
        jam_mulai: monitoringData.jam_mulai || "",
        hasil: monitoringData.hasil || "",
        jenis_gangguan: monitoringData.jenis_gangguan || "",
        penyebab_gangguan: monitoringData.penyebab_gangguan || "",
        penanganan_gangguan: monitoringData.penanganan_gangguan || "",
    });

    /* ================= LOGIC OTOMATIS SUMBER INPUT ================= */
    const handleKontenChange = (value) => {
        setData("id_konten", value);

        if (
            value === "TVRI World" ||
            value === "TVRI Nasional" ||
            value === "TVRI Sport"
        ) {
            setData("sumber_input", "Downlink Parabola");
        } else {
            setData("sumber_input", "");
        }
    };

    /* ================= VALIDASI FORM ================= */
    const validateForm = () => {
        const requiredFields = [
            "id_transmisi",
            "id_konten",
            "sumber_input",
            "nama_acara",
            "kategori",
            "jam_mulai",
            "hasil",
        ];

        for (const field of requiredFields) {
            if (!form[field] || form[field].trim() === "") {
                alert("Semua kolom wajib diisi");
                return false;
            }
        }

        // validasi jam format 24 jam
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.jam_mulai)) {
            alert("Format jam harus 24 jam (HH:MM)");
            return false;
        }

        if (form.hasil === "Gangguan") {
            if (!form.jenis_gangguan) {
                alert("Jenis gangguan wajib dipilih");
                return false;
            }

            if (
                form.jenis_gangguan === "Gangguan Lainnya" &&
                !form.penyebab_gangguan
            ) {
                alert("Penyebab gangguan wajib diisi");
                return false;
            }
        }

        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        put(route("monitoring-siaran.update", monitoringData.id), {
            onSuccess: () => {
                // Redirect ke halaman data saya setelah berhasil update
                window.location.href = route("monitoring-siaran.my-data");
            },
            onError: (errors) => {
                console.log("Error updating data:", errors);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Edit Data Monitoring
                </h2>
            }
        >
            <Head title="Edit Data Monitoring" />
            
            {/* ================= NAVIGASI MONITORING ================= */}
            <div className="max-w-5xl mx-auto mb-4">
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route("monitoring-siaran.my-data")}
                        className="btn btn-secondary btn-sm"
                    >
                        ← Kembali ke Data Saya
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
                        {/* ================= INFO EDIT ================= */}
                        <div className="alert alert-info mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <span className="font-medium">Anda sedang mengedit data monitoring</span>
                                <div className="text-sm">
                                    <p>Dibuat pada: {new Date(monitoringData.created_at).toLocaleDateString('id-ID')}</p>
                                    <p>Terakhir diupdate: {new Date(monitoringData.updated_at).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {/* ================= IDENTITAS ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Identitas Monitoring
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Nama Pengisi
                                    </label>
                                    <input
                                        className="input input-bordered"
                                        value={auth.user.name}
                                        disabled
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">
                                        Stasiun Transmisi
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={form.id_transmisi}
                                        onChange={(e) =>
                                            setData("id_transmisi", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Pilih Stasiun Transmisi
                                        </option>
                                        {[
                                            "TVRI Pusat Jatim",
                                            "Surabaya",
                                            "Gn Doek",
                                            "Oro Oro Ombo",
                                            "Gn Brengik",
                                            "Gn Gending",
                                            "Alas Malang",
                                            "Besuki",
                                            "Tuban",
                                            "Cemorosewu",
                                            "Gn Pandan",
                                            "Gn Brengos",
                                            "Wonogondo",
                                        ].map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ================= INFORMASI SIARAN ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Informasi Siaran
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Konten Siaran
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={form.id_konten}
                                        onChange={(e) =>
                                            handleKontenChange(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Pilih Konten Siaran
                                        </option>
                                        <option>TVRI World</option>
                                        <option>TVRI Nasional</option>
                                        <option>TVRI Sport</option>
                                        <option>TVRI Jawa Timur</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">
                                        Sumber Input
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={form.sumber_input}
                                        disabled={form.id_konten !== "TVRI Jawa Timur"}
                                        onChange={(e) =>
                                            setData("sumber_input", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Pilih Sumber Input
                                        </option>
                                        <option>Downlink Parabola</option>
                                        <option>MCPC</option>
                                        <option>FO</option>
                                    </select>
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label font-medium">
                                        Nama Acara
                                    </label>
                                    <input
                                        className="input input-bordered"
                                        value={form.nama_acara}
                                        onChange={(e) =>
                                            setData("nama_acara", e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">
                                        Kategori
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={form.kategori}
                                        onChange={(e) =>
                                            setData("kategori", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Pilih Kategori
                                        </option>
                                        <option>Live</option>
                                        <option>Record</option>
                                    </select>
                                </div>

                                {/* ================= JAM MULAI ================= */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Jam Mulai (24 Jam)
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="HH:MM (00–23)"
                                        value={form.jam_mulai}
                                        onChange={(e) =>
                                            setData("jam_mulai", e.target.value)
                                        }
                                        required
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Format: 24 jam (contoh: 14:30)</span>
                                    </label>
                                </div>
                            </div>

                            {/* ================= HASIL ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Hasil Monitoring
                            </h3>

                            <div className="form-control max-w-xs">
                                <label className="label font-medium">
                                    Hasil
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={form.hasil}
                                    onChange={(e) =>
                                        setData("hasil", e.target.value)
                                    }
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Pilih Hasil Monitoring
                                    </option>
                                    <option>Normal</option>
                                    <option>Gangguan</option>
                                </select>
                            </div>

                            {/* ================= DETAIL GANGGUAN ================= */}
                            {form.hasil === "Gangguan" && (
                                <>
                                    <h3 className="font-semibold text-lg text-error border-b pb-2">
                                        Detail Gangguan
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label font-medium">
                                                Jenis Gangguan
                                            </label>
                                            <select
                                                className="select select-bordered"
                                                value={form.jenis_gangguan}
                                                onChange={(e) =>
                                                    setData(
                                                        "jenis_gangguan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value="" disabled hidden>
                                                    Pilih Jenis Gangguan
                                                </option>
                                                <option>Video Blank</option>
                                                <option>Video Freeze</option>
                                                <option>Video Glitch</option>
                                                <option>Audio Hilang</option>
                                                <option>Gangguan Lainnya</option>
                                            </select>
                                        </div>

                                        {form.jenis_gangguan === "Gangguan Lainnya" && (
                                            <div className="form-control md:col-span-2">
                                                <label className="label font-medium">
                                                    Penyebab Gangguan
                                                </label>
                                                <textarea
                                                    className="textarea textarea-bordered"
                                                    rows={3}
                                                    value={form.penyebab_gangguan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "penyebab_gangguan",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Jelaskan penyebab gangguan lainnya..."
                                                />
                                            </div>
                                        )}

                                        <div className="form-control md:col-span-2">
                                            <label className="label font-medium">
                                                Penanganan Gangguan
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered"
                                                rows={3}
                                                value={form.penanganan_gangguan}
                                                onChange={(e) =>
                                                    setData(
                                                        "penanganan_gangguan",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Jelaskan penanganan yang dilakukan..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-4 flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full md:w-1/3"
                                    disabled={processing}
                                >
                                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                                <Link
                                    href={route("monitoring-siaran.my-data")}
                                    className="btn btn-outline w-full md:w-1/3"
                                >
                                    Batal
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>

                {/* ================= INFO TAMBAHAN ================= */}
                <div className="card bg-base-100 shadow-sm mt-4">
                    <div className="card-body">
                        <h3 className="font-semibold text-lg mb-2">Informasi Data</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>ID Data:</strong> {monitoringData.id}</p>
                                <p><strong>Dibuat:</strong> {new Date(monitoringData.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <p><strong>Diupdate:</strong> {new Date(monitoringData.updated_at).toLocaleString('id-ID')}</p>
                                <p><strong>Status:</strong> 
                                    <span className={`badge ml-2 ${monitoringData.hasil === 'Normal' ? 'badge-success' : 'badge-error'}`}>
                                        {monitoringData.hasil}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}