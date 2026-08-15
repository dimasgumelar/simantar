import { memo, useEffect, useMemo, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";

export function DateTimeInput({
    value,
    onChange,
    placeholder = "Pilih tanggal dan waktu",
    minDate = "",
    label = "",
    isRequired = false,
    error,
}) {
    return (
        <div>
            {label != "" && (
                <label className="label block mb-2">
                    {label}
                    {isRequired ? <span className="text-red-500"> *</span> : ""}
                </label>
            )}
            <Flatpickr
                value={value}
                onChange={onChange}
                options={{
                    locale: Indonesian,
                    enableTime: true,
                    dateFormat: "j F Y H:i",
                    time_24hr: true,
                    minDate: minDate,
                    disableMobile: true,
                }}
                placeholder={placeholder}
                className="input input-bordered w-full"
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export function DateInput({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    minDate = "",
    maxDate = "",
    label = "",
    isRequired = false,
    error,
}) {
    return (
        <div>
            {label != "" && (
                <label className="label block mb-2">
                    {label}
                    {isRequired ? <span className="text-red-500"> *</span> : ""}
                </label>
            )}
            <Flatpickr
                value={value}
                onChange={(dates, dateStr) => onChange(dateStr)}
                options={{
                    locale: Indonesian,
                    enableTime: false,
                    dateFormat: "Y-m-d",
                    minDate: minDate,
                    maxDate: maxDate,
                    disableMobile: true,
                    allowInput: true,
                }}
                placeholder={placeholder}
                className="input input-bordered w-full"
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

function createTimeInputOptions() {
    return {
        locale: Indonesian,
        noCalendar: true,
        enableTime: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 1,
        disableMobile: true,
        allowInput: true,
        closeOnSelect: false,
    };
}

// react-flatpickr recreates its underlying flatpickr instance whenever this
// component re-renders (its internal options memoization keys off the props
// object, which is a new reference every render). Left uncontrolled here and
// wrapped in memo(() => true), it mounts flatpickr exactly once, so typing a
// value no longer closes the picker mid-interaction via the parent's re-render.
// The options object must be created fresh per instance (not shared/module-level)
// because react-flatpickr mutates it in place to accumulate hook callbacks —
// a shared object would leak one field's onChange into every other field using it.
// containerRef wraps the rendered <input> so the imperative flatpickr instance
// can be read off its `_flatpickr` DOM property — this installed react-flatpickr
// version doesn't forward its own `ref` prop under React 18 (its component isn't
// wrapped in forwardRef), so `ref={...}` directly on <Flatpickr> silently fails.
const StableTimeFlatpickr = memo(function StableTimeFlatpickr({
    containerRef,
    onChange,
    placeholder,
}) {
    const options = useMemo(() => createTimeInputOptions(), []);

    return (
        <div ref={containerRef}>
            <Flatpickr
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                className="input input-bordered w-full"
            />
        </div>
    );
}, () => true);

export function TimeInput({
    value,
    onChange,
    placeholder = "Pilih jam",
    label = "",
    isRequired = false,
    error,
}) {
    const containerRef = useRef(null);
    const lastEmitted = useRef(undefined);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const stableOnChange = useRef((dates, dateStr) => {
        lastEmitted.current = dateStr;
        onChangeRef.current(dateStr);
    }).current;

    useEffect(() => {
        const input = containerRef.current && containerRef.current.querySelector("input");
        const instance = input && input._flatpickr;
        if (instance && value !== lastEmitted.current) {
            instance.setDate(value || "", false);
            lastEmitted.current = value;
        }
    }, [value]);

    return (
        <div>
            {label != "" && (
                <label className="label block mb-2">
                    {label}
                    {isRequired ? <span className="text-red-500"> *</span> : ""}
                </label>
            )}
            <StableTimeFlatpickr
                containerRef={containerRef}
                onChange={stableOnChange}
                placeholder={placeholder}
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}
