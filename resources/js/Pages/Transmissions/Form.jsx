import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MapPicker from "@/Components/Maps/MapPicker";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input, InputDropdownManual, InputImage } from "@/Components/FormInput";
import { TRANSMISSION_STATUS_OPTIONS } from "@/utils/constants";
import { BreadcrumbsTransmisi } from "@/Pages/Transmissions/Constant";

export default function TransmissionForm({
    transmission = {},
    isEdit = false,
    linkedUsers = [],
}) {
    const breadcrumbs = [<BreadcrumbsTransmisi />, isEdit ? "Ubah" : "Tambah"];

    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        id: "",
        name: "",
        address: "",
        latitude: transmission.latitude || -7.289846761027304,
        longitude: transmission.longitude || 112.7151170415472,
        photo: null,
        photo_path: null,
        is_active: 1,
        koordinator_id: "",
    });

    useEffect(() => {
        if (isEdit && transmission) {
            setData({
                id: transmission.id,
                name: transmission.name,
                address: transmission.address,
                latitude: transmission.latitude,
                longitude: transmission.longitude,
                photo: null,
                photo_path: transmission.photo_path || null,
                is_active: transmission.is_active,
                koordinator_id: transmission.koordinator_id || "",
            });
            setPreviewUrl(
                transmission.photo_path
                    ? "/storage/" + transmission.photo_path
                    : null
            );
        }
    }, [isEdit, transmission]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("transmissions.update", data.id));
        } else {
            post(route("transmissions.store"));
        }
    };

    const onLocationChange = ({ lat, lng }) => {
        setData("latitude", lat);
        setData("longitude", lng);
    };

    const onLatitudeChange = (e) => {
        const lat = parseFloat(e.target.value);
        if (!isNaN(lat)) {
            if (lat < -90 || lat > 90) {
                alert("Latitude harus diantara -90 dan 90.");
                return;
            }
            setData("latitude", lat);
        }
    };

    const onLongitudeChange = (e) => {
        const lng = parseFloat(e.target.value);
        if (!isNaN(lng)) {
            if (lng < -180 || lng > 180) {
                alert("Longitude harus diantara -180 dan 180.");
                return;
            }
            setData("longitude", lng);
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

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Transmisi`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form
                        onSubmit={submit}
                        className="space-y-4 mt-4"
                        encType="multipart/form-data"
                    >
                        <Input
                            isRequired={true}
                            type="text"
                            label="Nama"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Status"
                            value={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.value)
                            }
                            error={errors.is_active}
                            list={TRANSMISSION_STATUS_OPTIONS}
                            labelKey="label"
                            idKey="value"
                        />
                        {isEdit && (
                            <InputDropdownManual
                                label="Koordinator"
                                value={data.koordinator_id}
                                onChange={(e) =>
                                    setData("koordinator_id", e.target.value)
                                }
                                error={errors.koordinator_id}
                                list={[
                                    { user_id: "", name: "Tidak ada" },
                                    ...linkedUsers,
                                ]}
                                idKey="user_id"
                            />
                        )}
                        <Input
                            type="text"
                            label="Alamat"
                            placeholder="Alamat"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            error={errors.address}
                        />
                        <Input
                            isRequired={true}
                            type="text"
                            label="Latitude"
                            placeholder="Latitude"
                            value={data.latitude}
                            onChange={onLatitudeChange}
                            error={errors.latitude}
                        />
                        <Input
                            isRequired={true}
                            type="text"
                            label="Longitude"
                            placeholder="Longitude"
                            value={data.longitude}
                            onChange={onLongitudeChange}
                            error={errors.longitude}
                        />
                        <div>
                            <label className="label block mb-2">Peta</label>
                            <MapPicker
                                className="z-0"
                                latitude={data.latitude}
                                longitude={data.longitude}
                                onLocationChange={onLocationChange}
                            />
                        </div>
                        <InputImage
                            label="Foto"
                            value={data.photo}
                            error={errors.photo}
                            onPhotoChange={onPhotoChange}
                            previewUrl={previewUrl}
                            initValue={transmission.photo}
                            onDeleteHandler={onDeleteHandler}
                            accept="image/*"
                        />
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("transmissions.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
