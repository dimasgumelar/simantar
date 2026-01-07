import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input, InputDropdownManual, InputImage } from "@/Components/FormInput";
import { GENSET_OPTIONS, INVENTORY_CONDITION_OPTIONS } from "@/utils/constants";
import { BreadcrumbsMonitoringGenset } from "@/Pages/MonitoringGenset/Constant";

export default function MonitoringGensetForm({
    inventory = {},
    isEdit = false,
    // categories = [],
    transmissions = [],
}) {
    const breadcrumbs = [
        <BreadcrumbsMonitoringGenset />,
        isEdit ? "Ubah" : "Tambah",
    ];

    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        //id: null,
        user_id: 1,
        tanggal: new Date().toLocaleDateString("en-CA"), // Default to today
        id_transmisi: null,
        jam_mulai: null,
        jam_akhir: null,
        durasi: null,
        id_data_genset:1,
        tegangan_rs:"",
        tegangan_st:"",
        tegangan_tr:"",
        tegangan_rn:"",
        tegangan_sn:"",
        tegangan_tn:"",
        tegangan_aki:"",
        beban_genset:null,
        kondisi_oli:"",
        link_foto:null,
        konsumsi_bbm:null,
        kategori:"",
        
        // category_id: 1,
       
    });

    // useEffect(() => {
    //     if (isEdit && inventory) {
    //         setData({
    //             id: inventory.id,
    //             name: inventory.name,
    //             brand: inventory.brand,
    //             description: inventory.description || "",
    //             // category_id: inventory.category_id || 1,
    //             transmission_id: inventory.transmission_id || 1,
    //             received_at: inventory.received_at,
    //             condition: inventory.condition,
    //             photo: null,
    //             photo_path: inventory.photo_path || null,
    //         });
    //         setPreviewUrl(
    //             inventory.photo_path ? "/storage/" + inventory.photo_path : null
    //         );
    //     }
    // }, [isEdit, inventory]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("mg.update", data.id));
        } else {
            post(route("mg.store"));
        }
    };

    const onPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Pilih file gambar yang valid.");
                return;
            }
            setData("photo", file);
            setData("photo_path", null);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData("photo", null);
        }
    };

    const onDeleteHandler = () => {
        setPreviewUrl(null);
        setData("photo", null);
        setData("photo_path", null);
    };

    const onJamMulaiHandler = (e) => {
        const jamMulai = e.target.value;
        setData("jam_mulai", jamMulai);

        if (jamMulai && data.jam_akhir) {
            const mulai = timeToMinutes(jamMulai);
            const akhir = timeToMinutes(data.jam_akhir);
            let durasi = akhir - mulai;
            if (durasi < 0) {
                durasi += 24 * 60;
            }

            setData("durasi", durasi);
        }
    };

    const onJamAkhirHandler = (e) => {
        const jamAkhir = e.target.value;
        setData("jam_akhir", jamAkhir);
        
        if (data.jam_mulai && jamAkhir) {
            const mulai = timeToMinutes(data.jam_mulai);
            const akhir = timeToMinutes(jamAkhir);
            
            let durasi = akhir - mulai;
            if (durasi < 0) {
                durasi += 24 * 60;
            }
            setData("durasi", durasi);
        }
    };

    const timeToMinutes = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Monitoring Genset`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                         <InputDropdownManual
                            isRequired={true}
                            label="Kategori"
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                            error={errors.kategori}
                            list={GENSET_OPTIONS}
                            labelKey="label"
                            idKey="value"
                        />
                        <Input
                            type="date"
                            label="Tanggal"
                            placeholder="Tanggal"
                            value={data.tanggal}
                            onChange={(e) =>
                                setData("tanggal", e.target.value)
                            }
                            error={errors.tanggal}
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Transmisi"
                            value={data.id_transmisi}
                            onChange={(e) =>
                                setData("id_transmisi", e.target.value)
                            }
                            error={errors.id_transmisi}
                            list={transmissions.data}
                            labelKey="name"
                            idKey="id"
                        />
                        <Input
                            isRequired={true}
                            type="time"
                            label="jam_mulai"
                            placeholder="jam_mulai"
                            value={data.jam_mulai}
                            onChange={onJamMulaiHandler}
                            error={errors.jam_mulai}
                        />
                        <Input
                            isRequired={true}
                            type="time"
                            label="jam_akhir"
                            placeholder="jam_akhir"
                            value={data.jam_akhir}
                            onChange={onJamAkhirHandler}
                            error={errors.jam_akhir}
                        />
                        <Input
                            isRequired={true}
                            type="number"
                            disabled={true}                            
                            label="Durasi Nyala Dalam Menit"
                            placeholder="Durasi"
                            value={data.durasi}
                            onChange={(e) => setData("durasi", e.target.value)}
                            error={errors.durasi}
                        />
                        {data.kategori == 'PLN ON' && (<>
                            <Input
                                type="text"
                                label="Tegangan RS"
                                placeholder="Tegangan RS"
                                value={data.tegangan_rs}
                                onChange={(e) =>
                                    setData("tegangan_rs", e.target.value)
                                }
                                error={errors.tegangan_rs}
                            />
                        <Input
                            type="text"
                            label="Tegangan ST"
                            placeholder="Tegangan ST"
                            value={data.tegangan_st}
                            onChange={(e) =>
                                setData("tegangan_st", e.target.value)
                            }
                            error={errors.tegangan_st}
                        />
                        <Input
                            type="text"
                            label="Tegangan TR"
                            placeholder="Tegangan TR"
                            value={data.tegangan_tr}
                            onChange={(e) =>
                                setData("tegangan_tr", e.target.value)
                            }
                            error={errors.tegangan_tr}
                        />
                        <Input
                            type="text"
                            label="Tegangan RN"
                            placeholder="Tegangan RN"
                            value={data.tegangan_rn}
                            onChange={(e) =>
                                setData("tegangan_rn", e.target.value)
                            }
                            error={errors.tegangan_rn}
                        />
                        <Input
                            type="text"
                            label="Tegangan SN"
                            placeholder="Tegangan SN"
                            value={data.tegangan_sn}
                            onChange={(e) =>
                                setData("tegangan_sn", e.target.value)
                            }
                            error={errors.tegangan_sn}
                        />
                        <Input
                            type="text"
                            label="Tegangan TN"
                            placeholder="Tegangan TN"
                            value={data.tegangan_tn}
                            onChange={(e) =>
                                setData("tegangan_tn", e.target.value)
                            }
                            error={errors.tegangan_tn}
                        />
                        <Input
                            type="text"
                            label="Tegangan AKI"
                            placeholder="Tegangan AKI"
                            value={data.tegangan_aki}
                            onChange={(e) =>
                                setData("tegangan_aki", e.target.value)
                            }
                            error={errors.tegangan_aki}
                        />
                        </>
                        )}
                        <Input
                            type="number"
                            label="Beban Genset"
                            placeholder="Beban Genset"
                            value={data.beban_genset}
                            onChange={(e) =>
                                setData("beban_genset", e.target.value)
                            }
                            error={errors.beban_genset}
                        />
                        <Input
                            type="text"
                            label="Kondisi Oli"
                            placeholder="Kondisi Oli"
                            value={data.kondisi_oli}
                            onChange={(e) =>
                                setData("kondisi_oli", e.target.value)
                            }
                            error={errors.kondisi_oli}
                            
                        />
                        {/* <InputDropdownManual
                            isRequired={true}
                            label="Category"
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            error={errors.category_id}
                            list={categories.data}
                            labelKey="name"
                            idKey="id"
                        /> */}
                        {/* <InputDropdownManual
                            isRequired={true}
                            label="Transmisi"
                            value={data.transmission_id}
                            onChange={(e) =>
                                setData("transmission_id", e.target.value)
                            }
                            error={errors.transmission_id}
                            list={transmissions.data}
                            labelKey="name"
                            idKey="id"
                        />
                        <Input
                            type="date"
                            label="Tanggal Diterima"
                            placeholder="Tanggal Diterima"
                            value={data.received_at}
                            onChange={(e) =>
                                setData("received_at", e.target.value)
                            }
                            error={errors.received_at}
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Kondisi"
                            value={data.condition}
                            onChange={(e) =>
                                setData("condition", e.target.value)
                            }
                            error={errors.condition}
                            list={INVENTORY_CONDITION_OPTIONS}
                            labelKey="label"
                            idKey="value"
                        />
                         */}
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("inventories.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
