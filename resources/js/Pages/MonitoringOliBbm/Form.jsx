import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input, InputDropdownManual, InputImage } from "@/Components/FormInput";
import { GENSET_OPTIONS, INVENTORY_CONDITION_OPTIONS, MOLIBBM_OPTIONS } from "@/utils/constants";
import { BreadcrumbsMonitoringOliBbm } from "@/Pages/MonitoringOliBbm/Constant";
import Roles from "@/utils/UserFromUsePage";


export default function MonitoringOliBbmForm({
    
    inventory = {},
    isEdit = false,
    // categories = [],
    transmissions = [],
    
}) {
   // const { auth } = usePage().props;
    const breadcrumbs = [
        <BreadcrumbsMonitoringOliBbm />,
        isEdit ? "Ubah" : "Tambah",
    ];

    const [previewUrl, setPreviewUrl] = useState(null);
    const { userFromUsePage, role } = Roles();

    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        kategori:1,
        user_id:1,
        id_transmisi: "",
        id_data_genset:1,
        tanggal: new Date().toLocaleDateString("en-CA"), // Default to toda
        total_solar_oli: "",
        keterangan:"",
       
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
            post(route("MonitoringGenset.update", data.id));
        } else {
            post(route("molibbm.store"));
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
                         
                         <Input
                            type="text"
                            label="Nama Operator"
                            placeholder="Nama Operator"
                            value={userFromUsePage.id}
                            onChange={(e) =>
                                setData("tanggal", e.target.value)
                            }
                            error={errors.tanggal}
                        />
                         <InputDropdownManual
                            isRequired={true}
                            label="Kategori"
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                            error={errors.kategori}
                            list={MOLIBBM_OPTIONS}
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
                        {data.kategori == 'BBM' &&(
                            <Input
                            type="number"
                            label="Total BBM"
                            placeholder="Total BBM"
                            value={data.total_solar_oli}
                            onChange={(e) =>
                                setData("total_solar_oli", e.target.value)
                            }
                            error={errors.total_solar_oli}
                        />

                        )}                  
                        {data.kategori == 'OLI' && (
                            <Input
                            type="number"
                            label="Total Oli"
                            placeholder="Total Oli"
                            value={data.total_solar_oli}
                            onChange={(e) =>
                                setData("total_solar_oli", e.target.value)
                            }
                            error={errors.total_solar_oli}
                        />
                            
                        )}                  
                       
                        
                        <Input
                            type="text"
                            label="Keterangan"
                            placeholder="Keterangan"
                            value={data.keterangan}
                            onChange={(e) =>
                                setData("keterangan", e.target.value)
                            }
                            error={errors.keterangan}
                            
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
