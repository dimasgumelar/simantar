import React, { useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import {
    CreateButton,
    ViewButton,
    EditButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { BadgeCondition } from "@/Components/Badge";
import { inertiaGet } from "@/utils/helper-function";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsInventories } from "@/Pages/Inventories/Constant";

export default function InventoriesIndex({ inventories }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsInventories />, "Daftar"];
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(inventories.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    // Delete
    function openDeleteModal(id) {
        setDeleteInventoryId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteInventoryId(null);
    }

    function handleDelete() {
        if (deleteInventoryId) {
            post(route("inventories.destroy", deleteInventoryId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data alat.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("inventories.index", {
            page: 1,
            per_page: perPage,
            search: search,
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

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("inventories.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Alat" />
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
                        {(role.hasAdmin ||
                            role.hasKetuaTim ||
                            role.hasTeknisi) && (
                            <CreateButton
                                route={route("inventories.create")}
                                title="Tambah Alat"
                            />
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Kode"
                                        column="inventory_code"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    {/* <SortableHeader
                                        label="Category"
                                        column="category"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    /> */}
                                    <SortableHeader
                                        label="Transmisi"
                                        column="transmission"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th>Kondisi</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventories.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada alat yang ditemukan."
                                        colspan={6}
                                    />
                                ) : (
                                    inventories.data.map((inventory, index) => (
                                        <tr key={inventory.id}>
                                            <th>
                                                {(inventories.current_page -
                                                    1) *
                                                    inventories.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{inventory.inventory_code}</td>
                                            <td>{inventory.name}</td>
                                            {/* <td>{inventory.category.name}</td> */}
                                            <td>
                                                {inventory.transmission.name}
                                            </td>
                                            <td>
                                                <BadgeCondition
                                                    param={inventory.condition}
                                                />
                                            </td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                <ViewButton
                                                    route={route(
                                                        "inventories.view",
                                                        inventory.id
                                                    )}
                                                />
                                                {(role.hasAdmin ||
                                                    role.hasKetuaTim ||
                                                    role.hasTeknisi) && (
                                                    <>
                                                        <EditButton
                                                            route={route(
                                                                "inventories.edit",
                                                                inventory.id
                                                            )}
                                                        />
                                                        <DeleteButton
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    inventory.id
                                                                )
                                                            }
                                                        />
                                                    </>
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
                            data={inventories.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="inventory"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
