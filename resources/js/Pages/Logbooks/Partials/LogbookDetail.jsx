import React, { useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import Roles from "@/utils/UserFromUsePage";
import { parseDate, parseDateTime } from "@/utils/helper-function";
import EventFormModal from "./EventFormModal";
import CopyEventsModal from "./CopyEventsModal";

export default function LogbookDetail({ logbook, copyableLogbooks = [] }) {
    const { userFromUsePage, role } = Roles();

    const canManage = role.hasOperator || role.hasKoordinator;
    const hasSigned = logbook.petugas_list.some(
        (petugas) => petugas.id === userFromUsePage.id
    );
    const canSign = canManage && !hasSigned;

    const [formEvent, setFormEvent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showCopyForm, setShowCopyForm] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState(null);
    const modalRef = useRef(null);
    const { delete: destroy } = useForm();

    const openCreateForm = () => {
        setFormEvent(null);
        setShowForm(true);
    };

    const openEditForm = (event) => {
        setFormEvent(event);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setFormEvent(null);
    };

    const openDeleteModal = (id) => {
        setDeleteEventId(id);
        modalRef.current.showModal();
    };

    const closeDeleteModal = () => {
        modalRef.current.close();
        setDeleteEventId(null);
    };

    const handleDelete = () => {
        if (deleteEventId) {
            destroy(
                route("logbooks.events.destroy", {
                    logbook: logbook.id,
                    event: deleteEventId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeDeleteModal(),
                    onError: () => alert("Gagal menghapus acara."),
                }
            );
        }
    };

    const handleSign = () => {
        router.post(
            route("logbooks.sign", logbook.id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <>
            <div className="overflow-x-auto mt-2">
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Transmisi</th>
                            <td>{logbook.transmission.name}</td>
                        </tr>
                        <tr>
                            <th>Tanggal</th>
                            <td>{parseDate(logbook.tanggal)}</td>
                        </tr>
                        <tr>
                            <th>Petugas</th>
                            <td>
                                <div className="flex flex-col gap-2">
                                    {logbook.petugas_list.length === 0 ? (
                                        <span className="text-sm opacity-70">
                                            Belum ada yang menandatangani.
                                        </span>
                                    ) : (
                                        logbook.petugas_list.map(
                                            (petugas) => (
                                                <div
                                                    key={petugas.id}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span>
                                                        {petugas.name}
                                                    </span>
                                                    <span className="badge badge-outline badge-success">
                                                        TTD{" "}
                                                        {parseDateTime(
                                                            petugas.pivot
                                                                .signed_at
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )
                                    )}
                                    {canSign && (
                                        <div>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={handleSign}
                                            >
                                                Tanda Tangani
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-6">
                <h2 className="text-lg font-semibold">Acara</h2>
                {canManage && (
                    <div className="flex gap-2">
                        {copyableLogbooks.length > 0 && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowCopyForm(true)}
                            >
                                <FaCopy />
                                <span className="hidden sm:flex">
                                    Salin Acara
                                </span>
                            </button>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={openCreateForm}
                        >
                            <FaPlus />
                            <span className="hidden sm:flex">
                                Tambah Acara
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto mt-2">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Jam Mulai</th>
                            <th>Jam Selesai</th>
                            <th>Acara</th>
                            {canManage && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {logbook.events.length === 0 ? (
                            <TableNotFound
                                message="Belum ada acara."
                                colspan={canManage ? 5 : 4}
                            />
                        ) : (
                            logbook.events.map((event, index) => (
                                <tr key={event.id}>
                                    <th>{index + 1}</th>
                                    <td>{event.start_time.slice(0, 5)}</td>
                                    <td>{event.end_time.slice(0, 5)}</td>
                                    <td>{event.name}</td>
                                    {canManage && (
                                        <td className="flex flex-wrap justify-center items-center gap-2">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    openEditForm(event)
                                                }
                                            >
                                                <FaEdit />
                                                <span className="hidden sm:flex">
                                                    Ubah
                                                </span>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() =>
                                                    openDeleteModal(event.id)
                                                }
                                            >
                                                <FaTrash />
                                                <span className="hidden sm:flex">
                                                    Hapus
                                                </span>
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
                <EventFormModal
                    show={showForm}
                    onClose={closeForm}
                    logbookId={logbook.id}
                    event={formEvent}
                />
            )}

            {canManage && (
                <CopyEventsModal
                    show={showCopyForm}
                    onClose={() => setShowCopyForm(false)}
                    logbookId={logbook.id}
                    sources={copyableLogbooks}
                />
            )}

            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="acara"
            />
        </>
    );
}
