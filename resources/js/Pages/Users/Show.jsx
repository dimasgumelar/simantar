import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { FormButtonLink } from "@/Components/FormButton";
import { FaEdit } from "react-icons/fa";
import { BadgeRole } from "@/Components/Badge";
import { BreadcrumbsUsers } from "@/Pages/Users/Constant";
import { parseDateTime } from "@/utils/helper-function";

export default function UsersShow({ user = {} }) {
    const breadcrumbs = [<BreadcrumbsUsers />, "View"];

    return (
        <AuthenticatedLayout>
            <Head title="Users View" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Nama</th>
                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <th>Telepon</th>
                                    <td>{user.phone}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Peran</th>
                                    <td>
                                        <BadgeRole roles={user.roles} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>NIP</th>
                                    <td>{user.nip ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Pangkat/Golongan</th>
                                    <td>{user.pangkat_golongan ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Jabatan</th>
                                    <td>{user.jabatan ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Tanggal Ditambahkan</th>
                                    <td>{parseDateTime(user.created_at)}</td>
                                </tr>
                                <tr>
                                    <th>Terakhir Diubah</th>
                                    <td>{parseDateTime(user.updated_at)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <FormButtonLink
                            backRoute={route("users.index")}
                            route={route("users.edit", user.id)}
                            text="Ubah"
                            icon={<FaEdit />}
                            buttonColor="btn-success"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
