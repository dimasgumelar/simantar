import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useEffect } from "react";

export default function Index() {
    const { auth } = usePage().props;

    const { data: form, setData, post, processing, reset } = useForm({
        id_transmisi: "",
        id_konten: "",
        sumber_input: "",
        nama_acara: "",
        kategori: "",
        jam_mulai: "",
        hasil: "",
        jenis_gangguan: "",
        penyebab_gangguan: "",
        penanganan_gangguan: "",
    });

    /* ================= JAM OTOMATIS (ISI SEKALI, BISA DIEDIT) ================= */
    useEffect(() => {
        if (!form.jam_mulai) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            setData("jam_mulai", `${hours}:${minutes}`);
        }
    }, []);

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

        post(route("monitoring-siaran.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Monitoring Siaran
                </h2>
            }
        >
            <Head title="Monitoring Siaran" />
{/* ================= NAVIGASI MONITORING ================= */}
<div className="max-w-5xl mx-auto mb-4">
    <div className="flex flex-wrap gap-2">
        <Link
            href={route("monitoring-siaran.index")}
            className="btn btn-secondary btn-sm"
        >
            Filter Data
        </Link>

        <Link
            href={route("monitoring-siaran.my-data")}
            className="btn btn-accent btn-sm"
        >
            Lihat Data Saya Isi
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
                                    />
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
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-4">
                                <button
                                    className="btn btn-primary w-full md:w-1/3"
                                    disabled={processing}
                                >
                                    Simpan Data Monitoring
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
