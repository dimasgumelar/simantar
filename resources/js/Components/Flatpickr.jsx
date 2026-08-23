// Clicking anywhere in a native date/time input's text area only focuses it —
// the calendar/clock popup itself only opens via the small picker icon unless
// we open it explicitly. showPicker() is unsupported in some browsers (older
// Safari), so this is best-effort and silently no-ops there.
function openPicker(e) {
    if (typeof e.target.showPicker === "function") {
        try {
            e.target.showPicker();
        } catch {
            // ignore — e.g. thrown when the input isn't user-activated
        }
    }
}

export function DateTimeInput({
    value,
    onChange,
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
            <input
                type="datetime-local"
                required={isRequired}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onClick={openPicker}
                min={minDate || undefined}
                className="input input-bordered w-full"
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export function DateInput({
    value,
    onChange,
    minDate = "",
    maxDate = "",
    label = "",
    isRequired = false,
    error,
    size = "",
}) {
    return (
        <div>
            {label != "" && (
                <label className="label block mb-2">
                    {label}
                    {isRequired ? <span className="text-red-500"> *</span> : ""}
                </label>
            )}
            <input
                type="date"
                required={isRequired}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onClick={openPicker}
                min={minDate || undefined}
                max={maxDate || undefined}
                className={`input input-bordered w-full ${size}`}
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export function TimeInput({
    value,
    onChange,
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
            <input
                type="time"
                required={isRequired}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onClick={openPicker}
                className="input input-bordered w-full"
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}
