import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { Input } from "@/Components/FormInput";
import { TimeInput } from "@/Components/Flatpickr";

export default function EventFormModal({ show, onClose, logbookId, event = null }) {
    const isEdit = !!event;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            start_time: "",
            end_time: "",
        });

    useEffect(() => {
        if (show) {
            setData({
                name: event?.name || "",
                start_time: event?.start_time?.slice(0, 5) || "",
                end_time: event?.end_time?.slice(0, 5) || "",
            });
            clearErrors();
        }
    }, [show, event]);

    const submit = (e) => {
        e.preventDefault();
        const routeName = isEdit
            ? "logbooks.events.update"
            : "logbooks.events.store";
        const routeParams = isEdit
            ? { logbook: logbookId, event: event.id }
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
                    {isEdit ? "Ubah Acara" : "Tambah Acara"}
                </h2>
                <Input
                    isRequired={true}
                    type="text"
                    label="Nama Acara"
                    placeholder="Nama Acara"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
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
                    label="Jam Selesai"
                    value={data.end_time}
                    onChange={(value) => setData("end_time", value)}
                    error={errors.end_time}
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
