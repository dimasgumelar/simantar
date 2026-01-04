import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import {
    Input,
    InputDropdownManual,
    InputDropdownManualServer,
    InputImage,
} from "@/Components/FormInput";
import { BreadcrumbsInventoryTransactions } from "@/Pages/InventoryTransactions/Constant";
import { Head, useForm } from "@inertiajs/react";

export default function InventoryTransactionsForm({
    inventory = {},
    isEdit = false,
    transmissions = {},
    users = {},
    pics = {},
    inventories = {},
    statuses = {},
}) {
    const breadcrumbs = [
        <BreadcrumbsInventoryTransactions />,
        isEdit ? "Ubah" : "Tambah",
    ];

    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        type: 0,
        status: null,
        transmission_id: null,
        inventory_id: null,
        user_id: null,
        pic_id: null,
        description: null,
        photo: null,
        photo_path: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("inventoryTransactions.update", data.id));
        } else {
            post(route("inventoryTransactions.store"));
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

    const onTypeChange = (e) => {
        setData("type", e.target.value);
        setData("status", null);
    };

    const onDeleteHandler = () => {
        setPreviewUrl(null);
        setData("photo", null);
        setData("photo_path", null);
    };

    const onChangeInputHandler = (key, e) => {
        setData(key, e.target.value);
        errors[key] = null;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Transaksi Alat`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <InputDropdownManual
                            isRequired={true}
                            label="Tipe"
                            value={data.type}
                            onChange={onTypeChange}
                            error={errors.type}
                            list={statuses}
                            labelKey="label"
                            idKey="value"
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Status"
                            value={data.status}
                            onChange={(e) => onChangeInputHandler("status", e)}
                            error={errors.status}
                            list={statuses[data.type].list}
                            labelKey="label"
                            idKey="value"
                        />
                        {(data.status == 2 || data.status == 6) && (
                            <InputDropdownManual
                                isRequired={true}
                                label="Transmisi"
                                value={data.transmission_id}
                                onChange={(e) =>
                                    onChangeInputHandler("transmission_id", e)
                                }
                                error={errors.transmission_id}
                                list={transmissions.data}
                                labelKey="name"
                                idKey="id"
                            />
                        )}
                        {data.status != 5 && (
                            <InputDropdownManualServer
                                isRequired={true}
                                label="Alat"
                                value={data.inventory_id}
                                onChange={(e) =>
                                    onChangeInputHandler("inventory_id", e)
                                }
                                error={errors.inventory_id}
                                list={inventories.data}
                                labelKey="name"
                                idKey="id"
                                serverSearch={true}
                                searchParam="inventory"
                            />
                        )}
                        <InputDropdownManualServer
                            isRequired={true}
                            label="Peminjam"
                            value={data.user_id}
                            onChange={(e) => onChangeInputHandler("user_id", e)}
                            error={errors.user_id}
                            list={users.data}
                            labelKey="name"
                            idKey="id"
                            serverSearch={true}
                            searchParam="borrower"
                        />
                        <InputDropdownManualServer
                            isRequired={true}
                            label="Penerima"
                            value={data.pic_id}
                            onChange={(e) => onChangeInputHandler("pic_id", e)}
                            error={errors.pic_id}
                            list={pics.data}
                            labelKey="name"
                            idKey="id"
                            serverSearch={true}
                            searchParam="receiver"
                        />
                        <Input
                            type="text"
                            label="Deskripsi"
                            placeholder="Deskripsi"
                            value={data.description}
                            onChange={(e) =>
                                onChangeInputHandler("description", e)
                            }
                            error={errors.description}
                        />
                        <InputImage
                            isRequired={true}
                            label="Foto Bukti"
                            value={data.photo}
                            error={errors.photo}
                            onPhotoChange={onPhotoChange}
                            previewUrl={previewUrl}
                            initValue={inventory.photo}
                            onDeleteHandler={onDeleteHandler}
                            accept="image/*"
                        />
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("inventoryTransactions.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
