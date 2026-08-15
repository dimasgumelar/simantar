import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { DEFAULT_IMAGE } from "@/utils/constants";
import { FormButtonLink } from "@/Components/FormButton";
import { FaEdit } from "react-icons/fa";
import MapPicker from "@/Components/Maps/MapPicker";
import { BreadcrumbsTransmisi } from "@/Pages/Transmissions/Constant";
import Roles from "@/utils/UserFromUsePage";
import { parseDateTime } from "@/utils/helper-function";

export default function TransmissionsShow({ transmission = {} }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsTransmisi />, "Lihat"];

    return (
        <AuthenticatedLayout>
            <Head title="Transmissions View" />

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
                                    <td>{transmission.name}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>
                                        <span
                                            className={`badge badge-outline mr-1 ${
                                                transmission.is_active == 1
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {transmission.is_active == 1
                                                ? "Aktif"
                                                : "Tidak Aktif"}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Koordinator</th>
                                    <td>{transmission.koordinator?.name ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Alamat</th>
                                    <td>{transmission.address}</td>
                                </tr>
                                <tr>
                                    <th>Latitude</th>
                                    <td>{transmission.latitude}</td>
                                </tr>
                                <tr>
                                    <th>Longitude</th>
                                    <td>{transmission.longitude}</td>
                                </tr>
                                <tr>
                                    <th>Peta</th>
                                    <td>
                                        <MapPicker
                                            className="z-0"
                                            latitude={transmission.latitude}
                                            longitude={transmission.longitude}
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Foto</th>
                                    <td>
                                        <div className="w-[400px] h-[400px]">
                                            <img
                                                src={
                                                    transmission.photo_path
                                                        ? `/storage/${transmission.photo_path}`
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
                            backRoute={route("transmissions.index")}
                            route={
                                role.hasAdmin || role.hasKetuaTim
                                    ? route(
                                          "transmissions.edit",
                                          transmission.id
                                      )
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
