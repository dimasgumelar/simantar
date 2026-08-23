import React, { useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import DeleteModal from "@/Components/DeleteModal";
import Roles from "@/utils/UserFromUsePage";
import { parseDateTime } from "@/utils/helper-function";
import EventFormModal from "./EventFormModal";
import CopyEventsModal from "./CopyEventsModal";
import NoteFormModal from "./NoteFormModal";
import DetailModal from "./DetailModal";
import NotesGroupModal from "./NotesGroupModal";
import { noteCategoryLabel } from "@/Pages/Logbooks/Constant";

const PX_PER_MINUTE = 2;
const MIN_CARD_HEIGHT = 56;

function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function formatMinutes(total) {
    const hours = Math.floor(total / 60)
        .toString()
        .padStart(2, "0");
    const minutes = (total % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Merges notes with intersecting time ranges into clusters so a busy
// timeslot renders as a single "stack" card instead of many cramped ones.
function clusterOverlapping(items) {
    const sorted = [...items].sort(
        (a, b) => a.start - b.start || a.end - b.end
    );
    const clusters = [];
    let current = null;
    for (const item of sorted) {
        if (current && item.start < current.end) {
            current.items.push(item);
            current.end = Math.max(current.end, item.end);
        } else {
            current = { start: item.start, end: item.end, items: [item] };
            clusters.push(current);
        }
    }
    return clusters;
}

export default function LogbookDetail({
    logbook,
    copyableLogbooks = [],
    eventNameSuggestions = [],
}) {
    const { userFromUsePage, role } = Roles();

    const canManage = role.hasOperator || role.hasKoordinator;
    const hasSigned = logbook.petugas_list.some(
        (petugas) => petugas.id === userFromUsePage.id
    );
    const canSign = canManage && !hasSigned;

    const allTimes = [
        ...logbook.events.flatMap((event) => [
            event.start_time,
            event.end_time,
        ]),
        ...logbook.notes.flatMap((note) => [note.start_time, note.end_time]),
    ].map(toMinutes);

    let axisStart = 0;
    let axisEnd = 60;
    if (allTimes.length > 0) {
        axisStart = Math.floor(Math.min(...allTimes) / 60) * 60;
        axisEnd = Math.ceil(Math.max(...allTimes) / 60) * 60;
    }
    if (axisEnd <= axisStart) axisEnd = axisStart + 60;
    const axisHeight = (axisEnd - axisStart) * PX_PER_MINUTE;

    const cardStyleMinutes = (start, end) => ({
        top: `${(start - axisStart) * PX_PER_MINUTE}px`,
        minHeight: `${Math.max(
            (end - start) * PX_PER_MINUTE,
            MIN_CARD_HEIGHT
        )}px`,
    });

    const cardStyle = (startTime, endTime) =>
        cardStyleMinutes(toMinutes(startTime), toMinutes(endTime));

    const noteClusters = clusterOverlapping(
        logbook.notes.map((note) => ({
            note,
            start: toMinutes(note.start_time),
            end: toMinutes(note.end_time),
        }))
    );

    const [formEvent, setFormEvent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showCopyForm, setShowCopyForm] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState(null);
    const modalRef = useRef(null);

    const [formNote, setFormNote] = useState(null);
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const noteModalRef = useRef(null);

    const { delete: destroy } = useForm();

    const [viewItem, setViewItem] = useState(null);
    const viewModalRef = useRef(null);

    const openViewModal = (type, data) => {
        setViewItem({ type, data });
        viewModalRef.current.showModal();
    };

    const closeViewModal = () => {
        viewModalRef.current.close();
        setViewItem(null);
    };

    const [noteGroup, setNoteGroup] = useState([]);
    const noteGroupModalRef = useRef(null);

    const openNoteGroup = (notes) => {
        setNoteGroup(notes);
        noteGroupModalRef.current.showModal();
    };

    const closeNoteGroup = () => {
        noteGroupModalRef.current.close();
        setNoteGroup([]);
    };

    const editNoteFromGroup = (note) => {
        closeNoteGroup();
        openEditNoteForm(note);
    };

    const deleteNoteFromGroup = (id) => {
        closeNoteGroup();
        openDeleteNoteModal(id);
    };

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

    const openCreateNoteForm = () => {
        setFormNote(null);
        setShowNoteForm(true);
    };

    const openEditNoteForm = (note) => {
        setFormNote(note);
        setShowNoteForm(true);
    };

    const closeNoteForm = () => {
        setShowNoteForm(false);
        setFormNote(null);
    };

    const openDeleteNoteModal = (id) => {
        setDeleteNoteId(id);
        noteModalRef.current.showModal();
    };

    const closeDeleteNoteModal = () => {
        noteModalRef.current.close();
        setDeleteNoteId(null);
    };

    const handleDeleteNote = () => {
        if (deleteNoteId) {
            destroy(
                route("logbooks.notes.destroy", {
                    logbook: logbook.id,
                    note: deleteNoteId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeDeleteNoteModal(),
                    onError: () => alert("Gagal menghapus keterangan."),
                }
            );
        }
    };

    return (
        <>
            <div className="overflow-x-auto mt-2">
                <table className="table">
                    <tbody>
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

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-6">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">Acara</h2>
                    {canManage && (
                        <div className="flex flex-wrap justify-end gap-2">
                            {copyableLogbooks.length > 0 && (
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setShowCopyForm(true)}
                                >
                                    <FaCopy />
                                    <span className="hidden sm:flex">
                                        Salin Acara
                                    </span>
                                </button>
                            )}
                            <button
                                className="btn btn-sm btn-primary"
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
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">Keterangan</h2>
                    {canManage && (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={openCreateNoteForm}
                        >
                            <FaPlus />
                            <span className="hidden sm:flex">
                                Tambah Keterangan
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {logbook.events.length === 0 && logbook.notes.length === 0 ? (
                <div className="mt-4 py-8 text-center text-sm opacity-70">
                    Belum ada acara atau keterangan.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                    <div
                        className="relative"
                        style={{ height: `${axisHeight}px` }}
                    >
                        {logbook.events.map((event) => (
                            <div
                                key={event.id}
                                className="card absolute left-0 right-0 bg-base-100 border border-base-300 shadow-sm overflow-hidden cursor-pointer"
                                style={cardStyle(
                                    event.start_time,
                                    event.end_time
                                )}
                                onClick={() => openViewModal("event", event)}
                            >
                                <div className="card-body p-2 sm:p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="text-xs opacity-60">
                                                {event.start_time.slice(0, 5)}{" "}
                                                - {event.end_time.slice(0, 5)}
                                            </span>
                                            <p className="font-medium break-words">
                                                {event.name}
                                            </p>
                                        </div>
                                        {canManage && (
                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    className="btn btn-xs btn-success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditForm(event);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal(
                                                            event.id
                                                        );
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="relative"
                        style={{ height: `${axisHeight}px` }}
                    >
                        {noteClusters.map((cluster) => {
                            const isGroup = cluster.items.length > 1;
                            const first = cluster.items[0].note;
                            return (
                                <div
                                    key={
                                        isGroup
                                            ? `group-${cluster.start}-${cluster.end}`
                                            : first.id
                                    }
                                    className="card absolute left-0 right-0 bg-base-100 border border-base-300 shadow-sm overflow-hidden cursor-pointer"
                                    style={cardStyleMinutes(
                                        cluster.start,
                                        cluster.end
                                    )}
                                    onClick={() =>
                                        openNoteGroup(
                                            cluster.items.map(
                                                (item) => item.note
                                            )
                                        )
                                    }
                                >
                                    <div className="card-body p-2 sm:p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs opacity-60">
                                                        {formatMinutes(
                                                            cluster.start
                                                        )}{" "}
                                                        -{" "}
                                                        {formatMinutes(
                                                            cluster.end
                                                        )}
                                                    </span>
                                                    {isGroup ? (
                                                        <span className="badge badge-primary badge-sm">
                                                            {
                                                                cluster.items
                                                                    .length
                                                            }{" "}
                                                            keterangan
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-outline badge-sm">
                                                            {noteCategoryLabel(
                                                                first.category
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                {isGroup ? (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {cluster.items.map(
                                                            (item) => (
                                                                <span
                                                                    key={
                                                                        item
                                                                            .note
                                                                            .id
                                                                    }
                                                                    className="badge badge-ghost badge-xs"
                                                                >
                                                                    {noteCategoryLabel(
                                                                        item
                                                                            .note
                                                                            .category
                                                                    )}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-line break-words">
                                                        {first.notes}
                                                    </p>
                                                )}
                                            </div>
                                            {canManage && !isGroup && (
                                                <div className="flex shrink-0 gap-1">
                                                    <button
                                                        className="btn btn-xs btn-success"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditNoteForm(
                                                                first
                                                            );
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn btn-xs btn-error"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteNoteModal(
                                                                first.id
                                                            );
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {canManage && (
                <EventFormModal
                    show={showForm}
                    onClose={closeForm}
                    logbookId={logbook.id}
                    event={formEvent}
                    nameSuggestions={eventNameSuggestions}
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

            {canManage && (
                <NoteFormModal
                    show={showNoteForm}
                    onClose={closeNoteForm}
                    logbookId={logbook.id}
                    note={formNote}
                />
            )}

            <DetailModal
                modalRef={viewModalRef}
                onClose={closeViewModal}
                item={viewItem}
            />

            <NotesGroupModal
                modalRef={noteGroupModalRef}
                onClose={closeNoteGroup}
                notes={noteGroup}
                canManage={canManage}
                onEdit={editNoteFromGroup}
                onDelete={deleteNoteFromGroup}
            />

            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="acara"
            />

            <DeleteModal
                modalRef={noteModalRef}
                onCancel={closeDeleteNoteModal}
                onConfirm={handleDeleteNote}
                title="keterangan"
                id="delete_note_modal"
            />
        </>
    );
}
