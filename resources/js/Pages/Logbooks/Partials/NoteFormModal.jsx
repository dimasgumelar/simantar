import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { InputDropdown, Textarea } from "@/Components/FormInput";
import { TimeInput } from "@/Components/Flatpickr";
import { NOTE_CATEGORIES } from "@/Pages/Logbooks/Constant";

export default function NoteFormModal({ show, onClose, logbookId, note = null }) {
    const isEdit = !!note;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            category: NOTE_CATEGORIES[0].id,
            start_time: "",
            end_time: "",
            notes: "",
        });

    useEffect(() => {
        if (show) {
            setData({
                category: note?.category || NOTE_CATEGORIES[0].id,
                start_time: note?.start_time?.slice(0, 5) || "",
                end_time: note?.end_time?.slice(0, 5) || "",
                notes: note?.notes || "",
            });
            clearErrors();
        }
    }, [show, note]);

    const submit = (e) => {
        e.preventDefault();
        const routeName = isEdit
            ? "logbooks.notes.update"
            : "logbooks.notes.store";
        const routeParams = isEdit
            ? { logbook: logbookId, note: note.id }
            : logbookId;

        post(route(routeName, routeParams), {
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
                    {isEdit ? "Ubah Keterangan" : "Tambah Keterangan"}
                </h2>
                <InputDropdown
                    isRequired={true}
                    label="Kategori"
                    value={data.category}
                    onChange={(e) => setData("category", e.target.value)}
                    list={NOTE_CATEGORIES}
                    error={errors.category}
                />
                <TimeInput
                    isRequired={true}
                    label="Jam Mulai"
                    value={data.start_time}
                    onChange={(value) => setData("start_time", value)}
                    error={errors.start_time}
                />
                <TimeInput
                    isRequired={true}
                    label="Jam Akhir"
                    value={data.end_time}
                    onChange={(value) => setData("end_time", value)}
                    error={errors.end_time}
                />
                <Textarea
                    isRequired={true}
                    label="Catatan"
                    placeholder="Catatan"
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    error={errors.notes}
                />
                <div className="flex justify-end gap-2">
                    <button type="button" className="btn" onClick={onClose}>
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : isEdit ? (
                            "Simpan"
                        ) : (
                            "Tambah"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
