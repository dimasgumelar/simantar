import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { InputDropdownManual } from "@/Components/FormInput";
import { BreadcrumbsTransmisi } from "@/Pages/Transmissions/Constant";

export default function UserForm({ transmissionSelected, users }) {
    const breadcrumbs = [
        <BreadcrumbsTransmisi />,
        <Link href={route("transmissions.users", transmissionSelected.id)}>
            Pengguna Transmisi - {transmissionSelected.name}
        </Link>,
        "Tambah",
    ];
    const { data, setData, post, processing, errors } = useForm({
        id: "",
        user_id: users[0].id || null,
        transmission_id: transmissionSelected.id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("transmissions.users.store", transmissionSelected.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Pengguna Transmisi" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <InputDropdownManual
                            isRequired={true}
                            label="Pengguna"
                            value={data.user_id}
                            onChange={(e) =>
                                setData("user_id", e.target.value)
                            }
                            error={errors.user_id}
                            list={users}
                        />
                        <FormButton
                            processing={processing}
                            route={route(
                                "transmissions.users",
                                transmissionSelected.id
                            )}
                            text="Tambah"
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
