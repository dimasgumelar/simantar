import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import GuestBookFormModal from "./GuestBookFormModal";

export default function GuestBookList({ logbook, canManage }) {
    const guestBooks = logbook.guest_books || [];

    const [formGuestBook, setFormGuestBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteGuestBookId, setDeleteGuestBookId] = useState(null);
    const modalRef = useRef(null);
    const { delete: destroy } = useForm();

    const openCreateForm = () => {
        setFormGuestBook(null);
        setShowForm(true);
    };

    const openEditForm = (guestBook) => {
        setFormGuestBook(guestBook);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setFormGuestBook(null);
    };

    const openDeleteModal = (id) => {
        setDeleteGuestBookId(id);
        modalRef.current.showModal();
    };

    const closeDeleteModal = () => {
        modalRef.current.close();
        setDeleteGuestBookId(null);
    };

    const handleDelete = () => {
        if (deleteGuestBookId) {
            destroy(
                route("logbooks.guestbooks.destroy", {
                    logbook: logbook.id,
                    guestBook: deleteGuestBookId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeDeleteModal(),
                    onError: () => alert("Gagal menghapus data buku tamu."),
                }
            );
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Buku Tamu</h2>
                {canManage && (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={openCreateForm}
                    >
                        <FaPlus />
                        <span className="hidden sm:flex">Tambah Tamu</span>
                    </button>
                )}
            </div>

            <div className="overflow-x-auto mt-2">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nama</th>
                            <th>Instansi / Asal</th>
                            <th>Keperluan</th>
                            <th>No. Telepon</th>
                            <th>Jam Masuk</th>
                            <th>Jam Keluar</th>
                            <th>Catatan</th>
                            {canManage && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {guestBooks.length === 0 ? (
                            <TableNotFound
                                message="Belum ada data buku tamu."
                                colspan={canManage ? 9 : 8}
                            />
                        ) : (
                            guestBooks.map((guestBook, index) => (
                                <tr key={guestBook.id}>
                                    <th>{index + 1}</th>
                                    <td>{guestBook.name}</td>
                                    <td>{guestBook.institution || "-"}</td>
                                    <td>{guestBook.purpose}</td>
                                    <td>{guestBook.phone || "-"}</td>
                                    <td>
                                        {guestBook.time_in
                                            ? guestBook.time_in.slice(0, 5)
                                            : "-"}
                                    </td>
                                    <td>
                                        {guestBook.time_out
                                            ? guestBook.time_out.slice(0, 5)
                                            : "-"}
                                    </td>
                                    <td className="whitespace-pre-line break-words">
                                        {guestBook.notes || "-"}
                                    </td>
                                    {canManage && (
                                        <td className="flex flex-wrap justify-center items-center gap-2">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    openEditForm(guestBook)
                                                }
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() =>
                                                    openDeleteModal(
                                                        guestBook.id
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {canManage && (
                <GuestBookFormModal
                    show={showForm}
                    onClose={closeForm}
                    logbookId={logbook.id}
                    guestBook={formGuestBook}
                />
            )}

            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="buku tamu"
                id="delete_guestbook_modal"
            />
        </div>
    );
}
