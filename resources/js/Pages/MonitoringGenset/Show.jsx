import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { DEFAULT_IMAGE } from "@/utils/constants";
import { FormButtonLink } from "@/Components/FormButton";
import { FaEdit } from "react-icons/fa";
import { BadgeCondition } from "@/Components/Badge";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsInventories } from "@/Pages/Inventories/Constant";
import { parseDateTime } from "@/utils/helper-function";

export default function InventoriesShow({ inventory = {}, transmission = {} }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsInventories />, "Lihat"];

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Alat" />

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
                                    <th>Kode</th>
                                    <td>{inventory.inventory_code}</td>
                                </tr>
                                <tr>
                                    <th>Nama</th>
                                    <td>{inventory.name}</td>
                                </tr>
                                <tr>
                                    <th>Merk</th>
                                    <td>{inventory.brand}</td>
                                </tr>
                                <tr>
                                    <th>Deskripsi</th>
                                    <td>{inventory.description}</td>
                                </tr>
                                <tr>
                                    <th>Transmisi</th>
                                    <td>{transmission.name}</td>
                                </tr>
                                <tr>
                                    <th>Tanggal Diterima</th>
                                    <td>{inventory.received_at}</td>
                                </tr>
                                <tr>
                                    <th>Kondisi</th>
                                    <td>
                                        <BadgeCondition
                                            param={inventory.condition}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Foto</th>
                                    <td>
                                        <div className="w-[400px] h-[400px]">
                                            <img
                                                src={
                                                    inventory.photo_path
                                                        ? `/storage/${inventory.photo_path}`
                                                        : DEFAULT_IMAGE
                                                }
                                                alt=""
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Tanggal Ditambahkan</th>
                                    <td>
                                        {parseDateTime(transmission.created_at)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Terakhir Diubah</th>
                                    <td>
                                        {parseDateTime(transmission.updated_at)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <FormButtonLink
                            backRoute={route("inventories.index")}
                            route={
                                role.hasAdmin || role.hasKetuaTim
                                    ? route("inventories.edit", inventory.id)
                                    : ""
                            }
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
