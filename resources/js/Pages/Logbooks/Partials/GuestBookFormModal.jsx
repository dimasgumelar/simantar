import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { Input, Textarea } from "@/Components/FormInput";
import { TimeInput } from "@/Components/Flatpickr";

export default function GuestBookFormModal({
    show,
    onClose,
    logbookId,
    guestBook = null,
}) {
    const isEdit = !!guestBook;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            institution: "",
            purpose: "",
            phone: "",
            time_in: "",
            time_out: "",
            notes: "",
        });

    useEffect(() => {
        if (show) {
            setData({
                name: guestBook?.name || "",
                institution: guestBook?.institution || "",
                purpose: guestBook?.purpose || "",
                phone: guestBook?.phone || "",
                time_in: guestBook?.time_in?.slice(0, 5) || "",
                time_out: guestBook?.time_out?.slice(0, 5) || "",
                notes: guestBook?.notes || "",
            });
            clearErrors();
        }
    }, [show, guestBook]);

    const submit = (e) => {
        e.preventDefault();
        const routeName = isEdit
            ? "logbooks.guestbooks.update"
            : "logbooks.guestbooks.store";
        const routeParams = isEdit
            ? { logbook: logbookId, guestBook: guestBook.id }
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
                    {isEdit ? "Ubah Buku Tamu" : "Tambah Buku Tamu"}
                </h2>
                <Input
                    isRequired={true}
                    label="Nama"
                    placeholder="Nama tamu"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
                />
                <Input
                    label="Instansi / Asal"
                    placeholder="Instansi / Asal"
                    value={data.institution}
                    onChange={(e) => setData("institution", e.target.value)}
                    error={errors.institution}
                />
                <Input
                    isRequired={true}
                    label="Keperluan"
                    placeholder="Keperluan"
                    value={data.purpose}
                    onChange={(e) => setData("purpose", e.target.value)}
                    error={errors.purpose}
                />
                <Input
                    label="No. Telepon"
                    placeholder="No. Telepon"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    error={errors.phone}
                />
                <TimeInput
                    label="Jam Masuk"
                    value={data.time_in}
                    onChange={(value) => setData("time_in", value)}
                    error={errors.time_in}
                />
                <TimeInput
                    label="Jam Keluar"
                    value={data.time_out}
                    onChange={(value) => setData("time_out", value)}
                    error={errors.time_out}
                />
                <Textarea
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
