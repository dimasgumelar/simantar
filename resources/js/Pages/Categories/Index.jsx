import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import { CreateButton } from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";

export default function CategoriesIndex({ categories }) {
    const breadcrumbs = [
        <Link href={route("categories.index")}>Kategori</Link>,
        "Daftar",
    ];
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const modalRef = useRef(null);
    const { delete: destroy } = useForm();

    const [perPage, setPerPage] = useState(categories.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    // Delete
    function openDeleteModal(id) {
        setDeleteCategoryId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteCategoryId(null);
    }

    function handleDelete() {
        if (deleteCategoryId) {
            destroy(route("categories.destroy", deleteCategoryId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data kategori.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("categories.index", {
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

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch
                                inputHandler={setSearch}
                                inputValue={search}
                            />
                        </form>
                        <CreateButton
                            route={route("categories.create")}
                            title="Tambah Kategori"
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
                                        label="Deskripsi"
                                        column="description"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada kategori yang ditemukan."
                                        colspan={4}
                                    />
                                ) : (
                                    categories.data.map((category, index) => (
                                        <tr key={category.id}>
                                            <th>
                                                {(categories.current_page - 1) *
                                                    categories.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{category.name}</td>
                                            <td>{category.description}</td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                {category.id !== 1 && (
                                                    <>
                                                        <Link
                                                            href={route(
                                                                "categories.edit",
                                                                category.id
                                                            )}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            <FaEdit />
                                                            <span className="hidden sm:flex">
                                                                Ubah
                                                            </span>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    category.id
                                                                )
                                                            }
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            <FaTrash />
                                                            <span className="hidden sm:flex">
                                                                Hapus
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                                {category.id === 1 && (
                                                    <span className="badge badge-secondary">
                                                        Kategori Default
                                                    </span>
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
                            data={categories.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="kategori"
            />
        </AuthenticatedLayout>
    );
}
