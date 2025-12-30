import React, { forwardRef, useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { DEFAULT_IMAGE } from "@/utils/constants";

export function Input({
    isRequired = false,
    type = "text",
    placeholder = "",
    label = "",
    value,
    onChange,
    error,
    disabled = false,
    className = "",
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
                required={isRequired}
                type={type}
                className={`input w-full ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export const InputFile = forwardRef(function InputFile(
    {
        isRequired = false,
        label = "",
        value,
        onChange,
        error,
        disabled = false,
        accept = "",
    },
    ref
) {
    return (
        <div>
            {label != "" && (
                <label className="label block mb-2">
                    {label}
                    {isRequired ? <span className="text-red-500"> *</span> : ""}
                </label>
            )}
            <input
                ref={ref}
                required={isRequired}
                type="file"
                className="file-input w-full"
                value={value}
                onChange={onChange}
                disabled={disabled}
                accept={accept || undefined}
            />
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
});

export function InputDropdown({
    isRequired = false,
    label,
    value,
    onChange,
    error,
    disabled = false,
    list = [],
    idKey = "id",
    labelKey = "name",
}) {
    return (
        <div>
            <label className="label block mb-2">
                {label}
                {isRequired ? <span className="text-red-500"> *</span> : ""}
            </label>
            <select
                disabled={disabled}
                required={isRequired}
                className="select select-bordered w-full"
                value={value}
                onChange={onChange}
            >
                {list.map((value) => (
                    <option key={value[idKey]} value={value[idKey]}>
                        {value[labelKey]}
                    </option>
                ))}
            </select>
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export function InputDropdownManual({
    isRequired = false,
    label,
    value,
    onChange,
    error,
    disabled = false,
    list = [],
    idKey = "id",
    labelKey = "name",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    const filteredList = list.filter((item) =>
        item[labelKey].toLowerCase().includes(search.toLowerCase())
    );

    const selectedLabel =
        list.find((item) => item[idKey] === value)?.[labelKey] || "Select...";

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="label block mb-2">
                {label}
                {isRequired && <span className="text-red-500"> *</span>}
            </label>

            <div
                className={`input input-bordered w-full flex justify-between items-center cursor-pointer ${
                    disabled ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{selectedLabel}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-base-200 max-h-60 overflow-auto">
                    <input
                        type="text"
                        placeholder="Cari..."
                        className="input input-sm input-bordered w-full rounded-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    <ul>
                        {filteredList.length > 0 ? (
                            filteredList.map((item) => (
                                <li
                                    key={item[idKey]}
                                    className={`px-3 py-2 cursor-pointer hover:bg-primary ${
                                        value === item[idKey]
                                            ? "bg-primary"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        onChange({
                                            target: { value: item[idKey] },
                                        });
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    {item[labelKey]}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-sm">
                                Tidak ada data yang ditemukan
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}

export function InputButton({
    isRequired = false,
    type = "text",
    placeholder = "",
    label,
    value,
    onChange,
    error,
    disabled = false,
    onClick,
    iconButton = null,
    labelButton = "Click",
    isManual = false,
    manual = "Click the button to generate a value.",
}) {
    return (
        <div>
            <label className="label block mb-2">
                {label}
                {isRequired ? <span className="text-red-500"> *</span> : ""}
            </label>
            <div className="join w-full">
                <input
                    disabled={disabled}
                    required={isRequired}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="input join-item w-full"
                    placeholder={placeholder}
                />
                <button
                    className="btn join-item"
                    type="button"
                    onClick={onClick}
                >
                    {iconButton}
                    {labelButton}
                </button>
            </div>
            {error && <div className="text-error text-sm mt-1">{error}</div>}
            {isManual && !error && (
                <div className="text-info text-sm mt-1">{manual}</div>
            )}
        </div>
    );
}

export function InputImage({
    isRequired = false,
    label,
    value,
    error,
    accept = "image/*,video/*",
    id = "photo-input",
    onPhotoChange,
    previewUrl = null,
    initValue = null,
    onDeleteHandler,
}) {
    const onImageClick = () => {
        const fileInput = document.getElementById(id);
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <div>
            <label className="label block mb-2">
                {label}
                {isRequired ? <span className="text-red-500"> *</span> : ""}
            </label>
            <input
                id={id}
                accept={accept}
                type="file"
                className="file-input w-full hidden"
                onChange={onPhotoChange}
            />
            <div className="card bg-base-100 w-[400px] h-[400px] shadow-sm cursor-pointer">
                {(previewUrl || value) && (
                    <button
                        type="button"
                        onClick={onDeleteHandler}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        title="Remove image"
                    >
                        <FaTimes size={12} />
                    </button>
                )}
                <img
                    onClick={onImageClick}
                    src={
                        previewUrl
                            ? previewUrl
                            : initValue
                            ? `/storage/${initValue}`
                            : DEFAULT_IMAGE
                    }
                    alt="Photo Preview"
                    className="w-full h-full object-contain"
                />
            </div>
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
}
