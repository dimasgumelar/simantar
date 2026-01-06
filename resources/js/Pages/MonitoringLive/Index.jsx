import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index() {
    const { auth } = usePage().props;

    // State untuk form
    const { data, setData, post, processing, reset } = useForm({
        tanggal_persiapan: new Date().toISOString().split('T')[0],
        nama_acara: "",
        lokasi: "",
        detail_peralatan: [],
        peralatan_lainnya: "", // Untuk input "Yang lain"
        kondisi_pc: "Normal",
        kendala_pc: "",
        stl_internet: "Normal",
        kendala_internet: "",
        kondisi_input_sdi: "Normal",
        kendala_sdi: "",
        jumlah_tegangan_listrik: 220,
        koneksi_srt: "Normal",
        kendala_srt: "",
        koneksi_rtmp: "Normal",
        kendala_rtmp: "",
        sinyal_audio_video: "Normal",
        kendala_sinyal_av: "",
        asal_sumber_listrik: "PLN",
        uji_komunikasi: "Sangat Lancar",
        uji_sinyal_av_ke_studio: "Ya",
        hasil_uji_tx: "Sinyal Stabil dan jernih",
        monitoring_kualitas_link: "Ya",
        backup_sistem_tx: "Ya",
        catatan_kendala: "",
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

    // Handle pilihan peralatan
    const handlePeralatanChange = (value, isChecked) => {
        let newPeralatan = [...data.detail_peralatan];
        
        if (isChecked) {
            if (value === "Lainnya") {
                // Jika memilih lainnya, reset input lainnya
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
            "tanggal_persiapan",
            "nama_acara", 
            "lokasi",
            "kondisi_pc",
            "stl_internet",
            "kondisi_input_sdi",
            "jumlah_tegangan_listrik",
            "koneksi_srt",
            "koneksi_rtmp",
            "sinyal_audio_video",
            "asal_sumber_listrik",
            "uji_komunikasi",
            "uji_sinyal_av_ke_studio",
            "hasil_uji_tx",
            "monitoring_kualitas_link",
            "backup_sistem_tx",
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

        // Cek kendala jika memilih "Terdapat Kendala"
        const kendalaFields = {
            "kondisi_pc": "kendala_pc",
            "stl_internet": "kendala_internet",
            "kondisi_input_sdi": "kendala_sdi",
            "koneksi_srt": "kendala_srt",
            "koneksi_rtmp": "kendala_rtmp",
            "sinyal_audio_video": "kendala_sinyal_av"
        };

        for (const [field, kendalaField] of Object.entries(kendalaFields)) {
            if (data[field] === "Terdapat Kendala" && !data[kendalaField].trim()) {
                alert(`Silakan isi kendala untuk ${field.replace('_', ' ')}!`);
                return false;
            }
        }

        return true;
    };

    // Handle submit form
    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // Siapkan data detail peralatan
        let detailPeralatan = [...data.detail_peralatan];
        if (detailPeralatan.includes("Lainnya") && data.peralatan_lainnya) {
            // Ganti "Lainnya" dengan nilai input
            const index = detailPeralatan.indexOf("Lainnya");
            detailPeralatan[index] = `Lainnya: ${data.peralatan_lainnya}`;
        }
        
        // Update data sebelum dikirim
        const formData = new FormData();
        formData.append('tanggal_persiapan', data.tanggal_persiapan);
        formData.append('nama_acara', data.nama_acara);
        formData.append('lokasi', data.lokasi);
        formData.append('detail_peralatan', JSON.stringify(detailPeralatan));
        formData.append('kondisi_pc', data.kondisi_pc);
        formData.append('kendala_pc', data.kendala_pc);
        formData.append('stl_internet', data.stl_internet);
        formData.append('kendala_internet', data.kendala_internet);
        formData.append('kondisi_input_sdi', data.kondisi_input_sdi);
        formData.append('kendala_sdi', data.kendala_sdi);
        formData.append('jumlah_tegangan_listrik', data.jumlah_tegangan_listrik);
        formData.append('koneksi_srt', data.koneksi_srt);
        formData.append('kendala_srt', data.kendala_srt);
        formData.append('koneksi_rtmp', data.koneksi_rtmp);
        formData.append('kendala_rtmp', data.kendala_rtmp);
        formData.append('sinyal_audio_video', data.sinyal_audio_video);
        formData.append('kendala_sinyal_av', data.kendala_sinyal_av);
        formData.append('asal_sumber_listrik', data.asal_sumber_listrik);
        formData.append('uji_komunikasi', data.uji_komunikasi);
        formData.append('uji_sinyal_av_ke_studio', data.uji_sinyal_av_ke_studio);
        formData.append('hasil_uji_tx', data.hasil_uji_tx);
        formData.append('monitoring_kualitas_link', data.monitoring_kualitas_link);
        formData.append('backup_sistem_tx', data.backup_sistem_tx);
        formData.append('catatan_kendala', data.catatan_kendala);
        
        if (data.foto) {
            formData.append('foto', data.foto);
        }

        // Kirim data
        post(route('monitoring-live.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFotoPreview(null);
                alert('Data berhasil disimpan!');
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Persiapan Siaran Live Lapangan
                </h2>
            }
        >
            <Head title="Persiapan Siaran Live" />

            {/* ================= NAVIGASI ================= */}
            <div className="max-w-5xl mx-auto mb-4">
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route("monitoring-live.index")}
                        className="btn btn-secondary btn-sm"
                    >
                        Filter Data
                    </Link>
                    <Link
                        href={route("monitoring-live.my-data")}
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
                                        Tanggal Persiapan
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered"
                                        value={data.tanggal_persiapan}
                                        onChange={(e) => 
                                            setData("tanggal_persiapan", e.target.value)
                                        }
                                    />
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
                                </div>
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

                            {/* ================= KONDISI PERALATAN ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Kondisi Peralatan
                            </h3>

                            {/* Kondisi PC */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Kondisi PC yang Digunakan
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="kondisi_pc"
                                                className="radio"
                                                checked={data.kondisi_pc === option}
                                                onChange={() => setData("kondisi_pc", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.kondisi_pc === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala pada PC"
                                        value={data.kendala_pc}
                                        onChange={(e) => setData("kendala_pc", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* STL Internet */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Status Internet yang Digunakan
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="stl_internet"
                                                className="radio"
                                                checked={data.stl_internet === option}
                                                onChange={() => setData("stl_internet", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.stl_internet === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala internet"
                                        value={data.kendala_internet}
                                        onChange={(e) => setData("kendala_internet", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* Kondisi Input SDI */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Kondisi Input SDI dari OB VAN
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="kondisi_input_sdi"
                                                className="radio"
                                                checked={data.kondisi_input_sdi === option}
                                                onChange={() => setData("kondisi_input_sdi", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.kondisi_input_sdi === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala input SDI"
                                        value={data.kendala_sdi}
                                        onChange={(e) => setData("kendala_sdi", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* ================= TEGANGAN LISTRIK ================= */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Jumlah Tegangan Listrik (198-242 V)
                                </label>
                                <input
                                    type="number"
                                    className={`input input-bordered ${
                                        data.jumlah_tegangan_listrik < 198 || 
                                        data.jumlah_tegangan_listrik > 242 
                                            ? 'input-error' 
                                            : 'input-success'
                                    }`}
                                    value={data.jumlah_tegangan_listrik}
                                    onChange={(e) => 
                                        setData("jumlah_tegangan_listrik", parseInt(e.target.value) || 0)
                                    }
                                    min="0"
                                    max="500"
                                />
                                {data.jumlah_tegangan_listrik && (
                                    <div className={`mt-1 text-sm ${
                                        data.jumlah_tegangan_listrik >= 198 && 
                                        data.jumlah_tegangan_listrik <= 242 
                                            ? 'text-success' 
                                            : 'text-error'
                                    }`}>
                                        {data.jumlah_tegangan_listrik >= 198 && 
                                         data.jumlah_tegangan_listrik <= 242 
                                            ? '✓ Normal (sesuai standar)' 
                                            : '✗ Tidak normal (di luar standar 198-242 V)'}
                                    </div>
                                )}
                            </div>

                            {/* ================= KONEKSI ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Koneksi dan Sinyal
                            </h3>

                            {/* Koneksi SRT */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Koneksi Link SRT
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="koneksi_srt"
                                                className="radio"
                                                checked={data.koneksi_srt === option}
                                                onChange={() => setData("koneksi_srt", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.koneksi_srt === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala koneksi SRT"
                                        value={data.kendala_srt}
                                        onChange={(e) => setData("kendala_srt", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* Koneksi RTMP */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Koneksi Link RTMP
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="koneksi_rtmp"
                                                className="radio"
                                                checked={data.koneksi_rtmp === option}
                                                onChange={() => setData("koneksi_rtmp", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.koneksi_rtmp === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala koneksi RTMP"
                                        value={data.kendala_rtmp}
                                        onChange={(e) => setData("kendala_rtmp", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* Sinyal Audio Video */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Sinyal Audio Video
                                </label>
                                <div className="flex gap-4">
                                    {["Normal", "Terdapat Kendala"].map((option) => (
                                        <label key={option} className="label cursor-pointer flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="sinyal_audio_video"
                                                className="radio"
                                                checked={data.sinyal_audio_video === option}
                                                onChange={() => setData("sinyal_audio_video", option)}
                                            />
                                            <span className="label-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.sinyal_audio_video === "Terdapat Kendala" && (
                                    <textarea
                                        className="textarea textarea-bordered mt-2"
                                        placeholder="Jelaskan kendala sinyal audio/video"
                                        value={data.kendala_sinyal_av}
                                        onChange={(e) => setData("kendala_sinyal_av", e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>

                            {/* ================= UJI DAN MONITORING ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Uji dan Monitoring
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Asal Sumber Listrik */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Asal Sumber Daya Listrik
                                    </label>
                                    <div className="flex gap-4">
                                        {["PLN", "Genset"].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="asal_sumber_listrik"
                                                    className="radio"
                                                    checked={data.asal_sumber_listrik === option}
                                                    onChange={() => setData("asal_sumber_listrik", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Uji Komunikasi */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Uji Komunikasi Lapangan-Station
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={data.uji_komunikasi}
                                        onChange={(e) => 
                                            setData("uji_komunikasi", e.target.value)
                                        }
                                    >
                                        <option value="Sangat Lancar">Sangat Lancar</option>
                                        <option value="Cukup Lancar">Cukup Lancar</option>
                                        <option value="Kurang Lancar">Kurang Lancar</option>
                                    </select>
                                </div>

                                {/* Uji Sinyal AV ke Studio */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Uji Sinyal Video/Audio ke Studio Berhasil
                                    </label>
                                    <div className="flex gap-4">
                                        {["Ya", "Tidak"].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="uji_sinyal_av_ke_studio"
                                                    className="radio"
                                                    checked={data.uji_sinyal_av_ke_studio === option}
                                                    onChange={() => setData("uji_sinyal_av_ke_studio", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Hasil Uji Transmisi */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Hasil Uji Transmisi ke Station
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={data.hasil_uji_tx}
                                        onChange={(e) => 
                                            setData("hasil_uji_tx", e.target.value)
                                        }
                                    >
                                        <option value="Sinyal Stabil dan jernih">
                                            Sinyal Stabil dan jernih
                                        </option>
                                        <option value="Ada noise ringan">
                                            Ada noise ringan
                                        </option>
                                        <option value="Sinyal tidak stabil">
                                            Sinyal tidak stabil
                                        </option>
                                    </select>
                                </div>

                                {/* Monitoring Kualitas Link */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Monitoring Kualitas Link (Mbps/s) Sesuai Standar
                                    </label>
                                    <div className="flex gap-4">
                                        {["Ya", "Tidak"].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="monitoring_kualitas_link"
                                                    className="radio"
                                                    checked={data.monitoring_kualitas_link === option}
                                                    onChange={() => setData("monitoring_kualitas_link", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Backup Sistem Transmisi */}
                                <div className="form-control">
                                    <label className="label font-medium">
                                        Backup Sistem Transmisi (Unit Cadangan) Telah Disiapkan
                                    </label>
                                    <div className="flex gap-4">
                                        {["Ya", "Tidak"].map((option) => (
                                            <label key={option} className="label cursor-pointer flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="backup_sistem_tx"
                                                    className="radio"
                                                    checked={data.backup_sistem_tx === option}
                                                    onChange={() => setData("backup_sistem_tx", option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ================= CATATAN DAN FOTO ================= */}
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Dokumentasi
                            </h3>

                            {/* Catatan Kendala */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Catatan dan Kendala saat Persiapan
                                </label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    placeholder="Tulis catatan atau kendala yang terjadi selama persiapan..."
                                    value={data.catatan_kendala}
                                    onChange={(e) => 
                                        setData("catatan_kendala", e.target.value)
                                    }
                                    rows={4}
                                />
                            </div>

                            {/* Upload Foto */}
                            <div className="form-control">
                                <label className="label font-medium">
                                    Dokumentasi Kendala Persiapan (Maks. 1MB)
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
                                        "Simpan Data Persiapan Siaran Live"
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