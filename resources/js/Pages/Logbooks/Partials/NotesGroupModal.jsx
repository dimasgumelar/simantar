import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { noteCategoryLabel } from "@/Pages/Logbooks/Constant";

export default function NotesGroupModal({
    modalRef,
    onClose,
    notes = [],
    canManage,
    onEdit,
    onDelete,
}) {
    return (
        <dialog ref={modalRef} className="modal" id="logbook_notes_group_modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Keterangan</h3>
                <div className="flex flex-col gap-3 mt-3 max-h-[60vh] overflow-y-auto">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="border-b border-base-300 pb-3 last:border-b-0 last:pb-0"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs opacity-60">
                                            {note.start_time.slice(0, 5)} -{" "}
                                            {note.end_time.slice(0, 5)}
                                        </span>
                                        <span className="badge badge-outline badge-sm">
                                            {noteCategoryLabel(note.category)}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-line break-words mt-1">
                                        {note.notes}
                                    </p>
                                </div>
                                {canManage && (
                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => onEdit(note)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => onDelete(note.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <button onClick={onClose} className="btn">
                        Tutup
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>tutup</button>
            </form>
        </dialog>
    );
}
