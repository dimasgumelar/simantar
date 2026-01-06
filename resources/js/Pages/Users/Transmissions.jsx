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
import { BreadcrumbsUsers } from "@/Pages/Users/Constant";

export default function UserTransmissionsIndex({
    userSelected,
    userTransmissions,
}) {
    const breadcrumbs = [
        <BreadcrumbsUsers />,
        <Link href={route("users.transmissions", userSelected.id)}>
            Transmisi Pengguna - {userSelected.name}
        </Link>,
        "Daftar",
    ];
    const [deleteUserId, setDeleteUserId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(userTransmissions.per_page || 10);
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
            post(
                route("users.transmissions.destroy", {
                    user: userSelected.id,
                    id: deleteUserId,
                }),
                {
                    onSuccess: () => {
                        closeDeleteModal();
                    },
                    onError: () => {
                        alert("Gagal menghapus data transmisi pengguna.");
                    },
                }
            );
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet(
            "users.transmissions",
            {
                page: 1,
                per_page: perPage,
                sort: sortField,
                direction: sortDirection,
                ...overrides,
            },
            userSelected.id
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
            <Head title="Pengguna" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <CreateButton
                            route={route(
                                "users.transmissions.create",
                                userSelected.id
                            )}
                            title="Tambah Transmisi"
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
                                {userTransmissions.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada transmisi pengguna yang ditemukan."
                                        colspan={3}
                                    />
                                ) : (
                                    userTransmissions.data.map(
                                        (userTransmission, index) => (
                                            <tr key={userTransmission.id}>
                                                <th>
                                                    {(userTransmissions.current_page -
                                                        1) *
                                                        userTransmissions.per_page +
                                                        index +
                                                        1}
                                                </th>
                                                <td>{userTransmission.name}</td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                userTransmission.id
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
                            data={userTransmissions.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="transmisi pengguna"
            />
        </AuthenticatedLayout>
    );
}
