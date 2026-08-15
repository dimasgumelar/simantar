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

export function TimeInput({
    value,
    onChange,
    placeholder = "Pilih jam",
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
                    noCalendar: true,
                    enableTime: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    minuteIncrement: 1,
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
