import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "@/Components/Modal";
import { parseDate } from "@/utils/helper-function";

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function dateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function monthKey(date) {
    return dateKey(date).slice(0, 7);
}

function parseDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export default function CopyEventsModal({
    show,
    onClose,
    logbookId,
    latestDate = null,
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            source_logbook_id: "",
        });

    const initialMonth = () => {
        const date = latestDate ? parseDateKey(latestDate) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const [viewMonth, setViewMonth] = useState(initialMonth);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSource, setSelectedSource] = useState(null);
    // Months already fetched while the modal is open, keyed by "YYYY-MM".
    const monthCache = useRef({});

    useEffect(() => {
        if (show) {
            setData({ source_logbook_id: "" });
            clearErrors();
            setSelectedSource(null);
            monthCache.current = {};
            setViewMonth(initialMonth());
        }
    }, [show]);

    useEffect(() => {
        if (!show) return;

        const month = monthKey(viewMonth);
        if (monthCache.current[month]) {
            setSources(monthCache.current[month]);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setSources([]);
        window.axios
            .get(route("logbooks.events.copy-sources", logbookId), {
                params: { month },
            })
            .then((response) => {
                monthCache.current[month] = response.data;
                if (!cancelled) setSources(response.data);
            })
            .catch(() => {
                if (!cancelled) setSources([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [show, viewMonth, logbookId]);

    const sourcesByDate = useMemo(() => {
        const map = {};
        sources.forEach((source) => {
            map[source.tanggal] = source;
        });
        return map;
    }, [sources]);

    const selectSource = (source) => {
        setSelectedSource(source);
        setData("source_logbook_id", source.id);
    };

    const shiftMonth = (delta) =>
        setViewMonth(
            new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1)
        );

    const leadingBlanks = viewMonth.getDay();
    const daysInMonth = new Date(
        viewMonth.getFullYear(),
        viewMonth.getMonth() + 1,
        0
    ).getDate();
    const todayKey = dateKey(new Date());

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
                <div>
                    <label className="label block mb-2">
                        Salin dari Tanggal
                        <span className="text-red-500"> *</span>
                    </label>
                    <div className="border border-base-300 rounded-box p-3">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost btn-square"
                                onClick={() => shiftMonth(-1)}
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="font-medium flex items-center gap-2">
                                {viewMonth.toLocaleString("id-ID", {
                                    month: "long",
                                    year: "numeric",
                                })}
                                {loading && (
                                    <span className="loading loading-spinner loading-xs"></span>
                                )}
                            </span>
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost btn-square"
                                onClick={() => shiftMonth(1)}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {DAY_NAMES.map((name) => (
                                <span
                                    key={name}
                                    className="text-xs opacity-60 py-1"
                                >
                                    {name}
                                </span>
                            ))}
                            {Array.from({ length: leadingBlanks }).map(
                                (_, i) => (
                                    <span key={`blank-${i}`} />
                                )
                            )}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const key = dateKey(
                                    new Date(
                                        viewMonth.getFullYear(),
                                        viewMonth.getMonth(),
                                        day
                                    )
                                );
                                const source = sourcesByDate[key];
                                const isSelected =
                                    source && selectedSource?.id === source.id;

                                let className =
                                    "btn btn-sm btn-ghost font-normal opacity-40";
                                if (isSelected) {
                                    className = "btn btn-sm btn-primary";
                                } else if (source) {
                                    className =
                                        "btn btn-sm btn-soft btn-success font-semibold";
                                }

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={!source}
                                        className={`${className} ${
                                            key === todayKey
                                                ? "underline"
                                                : ""
                                        }`}
                                        onClick={() => selectSource(source)}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs opacity-70">
                            <span className="inline-block w-3 h-3 rounded bg-success/30" />
                            Tanggal yang memiliki acara
                        </div>
                    </div>
                    {selectedSource && (
                        <p className="text-sm mt-2">
                            Dipilih:{" "}
                            <span className="font-medium">
                                {parseDate(
                                    parseDateKey(selectedSource.tanggal)
                                )}
                            </span>
                        </p>
                    )}
                    {errors.source_logbook_id && (
                        <div className="text-error text-sm mt-1">
                            {errors.source_logbook_id}
                        </div>
                    )}
                </div>
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
