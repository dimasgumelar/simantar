import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaUserShield, FaBroadcastTower } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import TableDropdown from "@/Components/TableDropdown";
import { BadgeRole } from "@/Components/Badge";
import {
    CreateButton,
    ViewButton,
    EditButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsUsers } from "@/Pages/Users/Constant";

export default function UsersIndex({ users, roles }) {
    const breadcrumbs = [<BreadcrumbsUsers />, "Daftar"];
    const [deleteUserId, setDeleteUserId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(users.per_page || 10);
    const [search, setSearch] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
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
            post(route("users.destroy", deleteUserId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data pengguna.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("users.index", {
            page: 1,
            per_page: perPage,
            search: search,
            roles: selectedRoles,
            sort: sortField,
            direction: sortDirection,
            ...overrides,
        });
    }

    // PerPage
    function handlePerPageChange(e) {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ per_page: value });
    }

    // Search
    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    // Role
    function toggleRole(roleName) {
        const updatedRoles = selectedRoles.includes(roleName)
            ? selectedRoles.filter((r) => r !== roleName)
            : [...selectedRoles, roleName];

        setSelectedRoles(updatedRoles);
        applyFilters({ roles: updatedRoles });
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("users.export", {
            search: search,
            roles: selectedRoles,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <DownloadButton onClick={handleExport} />
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch
                                inputHandler={setSearch}
                                inputValue={search}
                            />
                        </form>
                        <TableDropdown
                            title="Pilih Peran"
                            icon={<FaUserShield />}
                            list={roles}
                            selectedList={selectedRoles}
                            toggleItem={toggleRole}
                        />
                        <CreateButton
                            route={route("users.create")}
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
                                    <SortableHeader
                                        label="Email"
                                        column="email"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th>Peran</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada pengguna yang ditemukan."
                                        colspan={5}
                                    />
                                ) : (
                                    users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <th>
                                                {(users.current_page - 1) *
                                                    users.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="">
                                                <BadgeRole roles={user.roles} />
                                            </td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                <ViewButton
                                                    route={route(
                                                        "users.view",
                                                        user.id
                                                    )}
                                                />
                                                <EditButton
                                                    route={route(
                                                        "users.edit",
                                                        user.id
                                                    )}
                                                />
                                                <DeleteButton
                                                    onClick={() =>
                                                        openDeleteModal(user.id)
                                                    }
                                                />
                                                {!user.roles.some(
                                                    (role) =>
                                                        role.name === "sdm"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "users.transmissions",
                                                            user.id
                                                        )}
                                                        className="btn btn-sm btn-warning"
                                                    >
                                                        <FaBroadcastTower />
                                                        <span className="hidden sm:flex">
                                                            Transmisi
                                                        </span>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={users.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="user"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
