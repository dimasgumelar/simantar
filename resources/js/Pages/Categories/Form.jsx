import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input } from "@/Components/FormInput";

export default function CategoriesForm({ category = {}, isEdit = false }) {
    const breadcrumbs = [
        <Link href={route("categories.index")}>Kategori</Link>,
        isEdit ? "Ubah" : "Tambah",
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        name: "",
        description: "",
    });

    useEffect(() => {
        if (isEdit && category) {
            setData({
                id: category.id,
                name: category.name,
                description: category.description || "",
            });
        }
    }, [isEdit, category]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("categories.update", category.id));
        } else {
            post(route("categories.store"));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Kategori" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <Input
                            isRequired={true}
                            type="text"
                            label="Nama"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />
                        <Input
                            type="text"
                            label="Deskripsi"
                            placeholder="Deskripsi"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            error={errors.description}
                        />
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("categories.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
