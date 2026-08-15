import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import { CreateButton } from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsTransmisi } from "@/Pages/Transmissions/Constant";

export default function TransmissionUsersIndex({
    transmissionSelected,
    transmissionUsers,
}) {
    const breadcrumbs = [
        <BreadcrumbsTransmisi />,
        <Link href={route("transmissions.users", transmissionSelected.id)}>
            Pengguna Transmisi - {transmissionSelected.name}
        </Link>,
        "Daftar",
    ];
    const [deleteUserId, setDeleteUserId] = useState(null);
    const modalRef = useRef(null);
    const { delete: destroy } = useForm();

    const [perPage, setPerPage] = useState(transmissionUsers.per_page || 10);
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    // Delete
    function openDeleteModal(id) {
        setDeleteUserId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteUserId(null);
    }

    function handleDelete() {
        if (deleteUserId) {
            destroy(
                route("transmissions.users.destroy", {
                    transmission: transmissionSelected.id,
                    id: deleteUserId,
                }),
                {
                    onSuccess: () => {
                        closeDeleteModal();
                    },
                    onError: () => {
                        alert("Gagal menghapus data pengguna transmisi.");
                    },
                }
            );
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet(
            "transmissions.users",
            {
                page: 1,
                per_page: perPage,
                sort: sortField,
                direction: sortDirection,
                ...overrides,
            },
            transmissionSelected.id
        );
    }

    // PerPage
    function handlePerPageChange(e) {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ per_page: value });
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Pengguna Transmisi" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <CreateButton
                            route={route(
                                "transmissions.users.create",
                                transmissionSelected.id
                            )}
                            title="Tambah Pengguna"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transmissionUsers.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada pengguna transmisi yang ditemukan."
                                        colspan={3}
                                    />
                                ) : (
                                    transmissionUsers.data.map(
                                        (transmissionUser, index) => (
                                            <tr key={transmissionUser.id}>
                                                <th>
                                                    {(transmissionUsers.current_page -
                                                        1) *
                                                        transmissionUsers.per_page +
                                                        index +
                                                        1}
                                                </th>
                                                <td>
                                                    {transmissionUser.name}
                                                </td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                transmissionUser.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        <FaTrash />
                                                        <span className="hidden sm:flex">
                                                            Hapus
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={transmissionUsers.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="pengguna transmisi"
            />
        </AuthenticatedLayout>
    );
}
