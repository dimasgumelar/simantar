import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { InputDropdownManual } from "@/Components/FormInput";
import { parseDate } from "@/utils/helper-function";

export default function CopyEventsModal({
    show,
    onClose,
    logbookId,
    sources = [],
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            source_logbook_id: "",
        });

    const options = sources.map((source) => ({
        id: source.id,
        name: parseDate(source.tanggal),
    }));

    useEffect(() => {
        if (show) {
            setData({ source_logbook_id: "" });
            clearErrors();
        }
    }, [show]);

    const submit = (e) => {
        e.preventDefault();
        post(route("logbooks.events.copy", logbookId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                    Salin Acara dari Logbook Lain
                </h2>
                <InputDropdownManual
                    isRequired={true}
                    label="Salin dari Tanggal"
                    value={data.source_logbook_id}
                    onChange={(e) =>
                        setData("source_logbook_id", e.target.value)
                    }
                    list={options}
                    error={errors.source_logbook_id}
                />
                <p className="text-sm opacity-70">
                    Hanya daftar acara yang akan disalin. Petugas dan tanda
                    tangan tidak ikut disalin.
                </p>
                <div className="flex justify-end gap-2">
                    <button type="button" className="btn" onClick={onClose}>
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing || !data.source_logbook_id}
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Salin"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
