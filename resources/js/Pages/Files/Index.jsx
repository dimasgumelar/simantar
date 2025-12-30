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
    ViewButtonFunction,
    EditButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { FileModal } from "@/Components/Modal";
import { inertiaGet } from "@/utils/helper-function";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsFiles } from "@/Pages/Files/Constant";

export default function FilesIndex({ files }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsFiles />, "Daftar"];
    const [deleteFileId, setDeleteInventoryId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(files.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

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
        if (deleteFileId) {
            post(route("files.destroy", deleteFileId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data alat.");
                },
            });
        }
    }

    function handleDownload(file) {
        console.log(file);

        if (!file?.file_path) return;

        window.open(
            `/storage/${file.file_path}`,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function applyFilters(overrides = {}) {
        inertiaGet("files.index", {
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
        window.location.href = route("files.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    function onClickView() {}

    return (
        <AuthenticatedLayout>
            <Head title="File" />
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
                                route={route("files.create")}
                                title="Tambah File"
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
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Kategori"
                                        column="category"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada file yang ditemukan."
                                        colspan={4}
                                    />
                                ) : (
                                    files.data.map((file, index) => (
                                        <tr key={file.id}>
                                            <th>
                                                {(files.current_page - 1) *
                                                    files.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{file.name}</td>
                                            <td>{file.category_name}</td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                <ViewButtonFunction
                                                    onClick={() => {
                                                        setSelectedFile(file);
                                                        document
                                                            .getElementById(
                                                                "preview_file_modal"
                                                            )
                                                            .showModal();
                                                    }}
                                                />
                                                {(role.hasAdmin ||
                                                    role.hasKetuaTim ||
                                                    role.hasTeknisi) && (
                                                    <>
                                                        <EditButton
                                                            route={route(
                                                                "files.edit",
                                                                file.id
                                                            )}
                                                        />
                                                        <DeleteButton
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    file.id
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                                <DownloadButton
                                                    key={file.id}
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                    className="btn-sm"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={files.links}
                        />
                    </div>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="file"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
