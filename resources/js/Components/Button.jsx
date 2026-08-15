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
