import React from "react";

export default function DeleteModal({
    modalRef,
    onCancel,
    onConfirm,
    title = "",
    isDeleting = false,
}) {
    return (
        <dialog ref={modalRef} className="modal" id="delete_modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Apakah Anda yakin menghapus data {title} ini?
                </h3>
                <p className="py-4">
                    Ketika kamu menghapus data {title} ini, semua data akan
                    dihapus permanen.
                </p>
                <div className="modal-action">
                    <button onClick={onCancel} className="btn">
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Menghapus...
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>tutup</button>
            </form>
        </dialog>
    );
}

export function ConfirmModal({
    modalRef,
    onCancel,
    onConfirm,
    title = "",
    isLoading = false,
    labelButton = "",
    detail = "",
}) {
    return (
        <dialog ref={modalRef} className="modal" id="delete_modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Apakah Anda yakin {title}?
                </h3>
                {detail != "" && <p className="py-4">{detail}</p>}
                <div className="modal-action">
                    <button onClick={onCancel} className="btn">
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Tunggu...
                            </>
                        ) : (
                            labelButton
                        )}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>tutup</button>
            </form>
        </dialog>
    );
}
