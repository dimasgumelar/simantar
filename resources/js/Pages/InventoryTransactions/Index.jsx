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
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsInventoryTransactions } from "@/Pages/InventoryTransactions/Constant";

export default function InventoryTransactionsIndex({ inventoryTransactions }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsInventoryTransactions />, "Daftar"];
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(
        inventoryTransactions.per_page || 10
    );
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
            post(route("inventoryTransactions.destroy", deleteInventoryId), {
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
        inertiaGet("inventoryTransactions.index", {
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
        window.location.href = route("inventoryTransactions.export", {
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
                                route={route("inventoryTransactions.create")}
                                title="Tambah Transaksi Alat"
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
                                        label="Alat"
                                        column="inventory"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Peminjam"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Penerima"
                                        column="pic"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Status"
                                        column="status"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryTransactions.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada alat yang ditemukan."
                                        colspan={6}
                                    />
                                ) : (
                                    inventoryTransactions.data.map(
                                        (inventoryTransaction, index) => (
                                            <tr key={inventoryTransaction.id}>
                                                <th>
                                                    {(inventoryTransactions.current_page -
                                                        1) *
                                                        inventoryTransactions.per_page +
                                                        index +
                                                        1}
                                                </th>
                                                <td>
                                                    {
                                                        inventoryTransaction
                                                            .inventory.name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inventoryTransaction
                                                            .user.name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inventoryTransaction.pic
                                                            .name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inventoryTransaction.status_name
                                                    }
                                                </td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    {/* <ViewButton
                                                        route={route(
                                                            "inventoryTransactions.view",
                                                            inventoryTransaction.id
                                                        )}
                                                    /> */}
                                                    {(role.hasAdmin ||
                                                        role.hasKetuaTim ||
                                                        role.hasTeknisi) && (
                                                        <>
                                                            {/* <EditButton
                                                                route={route(
                                                                    "inventoryTransactions.edit",
                                                                    inventoryTransaction.id
                                                                )}
                                                            /> */}
                                                            <DeleteButton
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        inventoryTransaction.id
                                                                    )
                                                                }
                                                            />
                                                        </>
                                                    )}
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
                            data={inventoryTransactions.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="transaksi alat"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
