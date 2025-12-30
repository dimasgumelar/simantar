import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useRef, useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { ViewButtonFunction } from "@/Components/Button";
import {
    Input,
    InputButton,
    InputDropdownManual,
    InputImage,
    InputFile,
} from "@/Components/FormInput";
import { FileModal } from "@/Components/Modal";
import { BreadcrumbsFiles } from "@/Pages/Files/Constant";

export default function FilesForm({
    file = {},
    isEdit = false,
    categories = [],
}) {
    const breadcrumbs = [<BreadcrumbsFiles />, isEdit ? "Ubah" : "Tambah"];

    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        name: "",
        category: 1,
        file: null,
        file_path: null,
    });

    useEffect(() => {
        if (isEdit && file) {
            setData({
                id: file.id,
                name: file.name,
                category: file.category || 1,
                file: null,
                file_path: file.file_path || null,
            });
            setPreviewUrl(file.file_path ? "/storage/" + file.file_path : null);
        }
    }, [isEdit, file]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("files.update", data.id));
        } else {
            post(route("files.store"));
        }
    };

    const onNameClick = (e) => {
        if (data.file) {
            const fileNameWithoutExt = data.file.name.substring(
                0,
                data.file.name.lastIndexOf(".")
            );
            setData("name", fileNameWithoutExt);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setData("file", null);
            setPreviewUrl(null);
            return;
        }

        if (file.size > 2097152) {
            alert("Ukuran file maksimal 2 MB.");
            e.target.value = null;
            return;
        }

        const allowedTypes = [
            "image/",
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "video/",
        ];

        const isValid = allowedTypes.some((type) =>
            type.endsWith("/") ? file.type.startsWith(type) : file.type === type
        );

        if (!isValid) {
            alert("File harus berupa gambar, video, PDF, Excel.");
            e.target.value = null;
            return;
        }

        setData("file", file);
        setData("file_path", null);

        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const onDeleteHandler = () => {
        setPreviewUrl(null);
        setData("file", null);
        setData("file_path", null);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Alat`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        {isEdit ? (
                            <Input
                                isRequired
                                type="text"
                                label="Nama"
                                placeholder="Nama"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                            />
                        ) : (
                            <InputButton
                                isRequired
                                type="text"
                                label="Nama"
                                placeholder="Nama"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                                labelButton="Gunakan Nama File"
                                onClick={onNameClick}
                            />
                        )}
                        <InputDropdownManual
                            isRequired={true}
                            label="Kategori"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            error={errors.category}
                            list={categories}
                            labelKey="label"
                            idKey="value"
                        />
                        {!isEdit ? (
                            <InputFile
                                ref={fileInputRef}
                                isRequired={true}
                                label="File"
                                placeholder="File"
                                onChange={onFileChange}
                                error={errors.file}
                                accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,video/*"
                            ></InputFile>
                        ) : (
                            <div>
                                <label className="label block mb-2">
                                    Preview
                                </label>
                                <div>
                                    <ViewButtonFunction
                                        onClick={() => {
                                            setSelectedFile(file);
                                            document
                                                .getElementById(
                                                    "preview_file_modal"
                                                )
                                                .showModal();
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("files.index")}
                        />
                    </form>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
        </AuthenticatedLayout>
    );
}
