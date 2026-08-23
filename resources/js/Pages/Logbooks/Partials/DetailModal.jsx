import React from "react";
import { noteCategoryLabel } from "@/Pages/Logbooks/Constant";

export default function DetailModal({ modalRef, onClose, item }) {
    return (
        <dialog ref={modalRef} className="modal" id="logbook_detail_modal">
            <div className="modal-box">
                {item && (
                    <>
                        <h3 className="font-bold text-lg">
                            {item.type === "event" ? "Detail Acara" : "Detail Keterangan"}
                        </h3>
                        <p className="text-sm opacity-60 mt-2">
                            {item.data.start_time.slice(0, 5)} -{" "}
                            {item.data.end_time.slice(0, 5)}
                        </p>
                        {item.type === "note" && (
                            <span className="badge badge-outline badge-sm mt-2">
                                {noteCategoryLabel(item.data.category)}
                            </span>
                        )}
                        <p className="whitespace-pre-line break-words mt-3">
                            {item.type === "event"
                                ? item.data.name
                                : item.data.notes}
                        </p>
                    </>
                )}
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
