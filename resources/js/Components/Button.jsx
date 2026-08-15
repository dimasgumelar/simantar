import { Link } from "@inertiajs/react";
import { FaPlus, FaEye, FaEdit, FaTrash, FaDownload } from "react-icons/fa";

export function CreateButton({ route = "", title = "Create" }) {
    return (
        <Link href={route} className="btn btn-primary ml-2">
            <FaPlus />
            <span className="hidden sm:flex">{title}</span>
        </Link>
    );
}

export function ViewButton({ route = "" }) {
    return (
        <Link href={route} className="btn btn-sm btn-primary">
            <FaEye />
            <span className="hidden sm:flex">Lihat</span>
        </Link>
    );
}

export function EditButton({ route = "" }) {
    return (
        <Link href={route} className="btn btn-sm btn-success">
            <FaEdit />
            <span className="hidden sm:flex">Ubah</span>
        </Link>
    );
}

export function DeleteButton({ onClick }) {
    return (
        <button onClick={onClick} className="btn btn-sm btn-error">
            <FaTrash />
            <span className="hidden sm:flex">Hapus</span>
        </button>
    );
}

export function DownloadButton({ onClick, label = "Unduh" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="btn btn-neutral mr-2"
        >
            <FaDownload />
            <span className="hidden sm:flex">{label}</span>
        </button>
    );
}

export function DownloadDropdownButton({ options }) {
    return (
        <div className="dropdown dropdown-end mr-2">
            <div tabIndex={0} role="button" className="btn btn-neutral">
                <FaDownload />
                <span className="hidden sm:flex">Unduh</span>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-2 w-36 p-2 shadow"
            >
                {options.map((option) => (
                    <li key={option.label}>
                        <a onClick={option.onClick}>{option.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
