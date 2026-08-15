import { useForm } from "@inertiajs/react";
import { FaTimes } from "react-icons/fa";
import { parseDateTime } from "@/utils/helper-function";

export default function PowerList({ logbook, canManage }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        power: "",
    });
    const { delete: destroy } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route("logbooks.powers.store", logbook.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        destroy(
            route("logbooks.powers.destroy", { logbook: logbook.id, power: id }),
            { preserveScroll: true }
        );
    };

    return (
        <div className="flex flex-col gap-2">
            {logbook.powers.length === 0 ? (
                <span className="text-sm opacity-70">
                    Belum ada catatan power.
                </span>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {logbook.powers.map((power) => (
                        <span
                            key={power.id}
                            className="badge badge-outline gap-2 py-3"
                        >
                            <span>{power.power} W</span>
                            <span className="text-xs opacity-60">
                                {parseDateTime(power.created_at)}
                            </span>
                            {canManage && (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(power.id)}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
            )}

            {canManage && (
                <form
                    onSubmit={submit}
                    className="flex flex-wrap items-center gap-2"
                >
                    <input
                        type="number"
                        min="1"
                        className="input input-bordered input-sm w-32"
                        placeholder="Watt"
                        value={data.power}
                        onChange={(e) => setData("power", e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        disabled={processing}
                    >
                        Tambah
                    </button>
                    {errors.power && (
                        <span className="text-error text-sm">
                            {errors.power}
                        </span>
                    )}
                </form>
            )}
        </div>
    );
}
