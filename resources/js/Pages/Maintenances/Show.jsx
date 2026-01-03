import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useRef, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { BadgeStatus } from "@/Components/Badge";
import { FaCheck, FaArrowLeft } from "react-icons/fa";
import { BreadcrumbsMaintenances } from "@/Pages/Maintenances/Constant";
import { parseDateTime, showValueOrDash } from "@/utils/helper-function";
import { FileModal } from "@/Components/Modal";
import { Input } from "@/Components/FormInput";
import { ConfirmModal } from "@/Components/DeleteModal";

export default function MaintenancesShow({
    maintenance = {},
    transmission = {},
    inventory = {},
    user_maintenance = {},
    feedbacks = [],
    created_by_user = {},
    status_histories = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        note: null,
    });
    const modalRef = useRef(null);
    const breadcrumbs = [<BreadcrumbsMaintenances />, "Lihat"];
    const [selectedFile, setSelectedFile] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        labelButton: "",
        detail: "",
        isApprove: false,
    });
    const lastStatus =
        status_histories?.length > 0
            ? status_histories[status_histories.length - 1].status
            : null;

    const handleComplete = (e) => {
        e.preventDefault();
        setData("file", null);
        setData("description", "");
        post(route("tasks.complete", maintenance.id));
    };

    function handleConfirm() {
        if (confirmConfig.isApprove) {
            post(route("maintenances.approve", maintenance.id), {
                onSuccess: () => {
                    closeConfirmModal();
                },
                onError: () => {
                    closeConfirmModal();
                },
            });
        } else {
            post(route("maintenances.reject", maintenance.id), {
                onSuccess: () => {
                    closeConfirmModal();
                },
                onError: () => {
                    closeConfirmModal();
                },
            });
        }
    }

    function openRejectModal() {
        setConfirmConfig({
            title: "menolak data pemeliharaan",
            labelButton: "Tolak",
            isApprove: false,
        });
        modalRef.current.showModal();
    }

    function openApproveModal() {
        setConfirmConfig({
            title: "menyetujui data pemeliharaan",
            labelButton: "Setujui",
            isApprove: true,
        });
        modalRef.current.showModal();
    }

    function closeConfirmModal() {
        modalRef.current.close();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Pemeliharaan" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="grid">
                        <Breadcrumbs list={breadcrumbs} />
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => openApproveModal()}
                        >
                            <FaCheck />
                            <span className="hidden sm:flex">Setujui</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Alat</th>
                                    <td>
                                        <Link
                                            href={route(
                                                "inventories.view",
                                                inventory.id
                                            )}
                                        >
                                            [{inventory.inventory_code}]{" "}
                                            {showValueOrDash(inventory.name)} -{" "}
                                            {showValueOrDash(inventory.brand)}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Transmisi</th>
                                    <td>
                                        {showValueOrDash(transmission.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Pengguna</th>
                                    <td>
                                        {showValueOrDash(user_maintenance.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Dibuat Oleh</th>
                                    <td>
                                        {showValueOrDash(created_by_user.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>
                                        <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
                                            <input type="checkbox" />
                                            <div className="collapse-title font-semibold">
                                                <BadgeStatus
                                                    param={lastStatus}
                                                />
                                            </div>
                                            <div className="collapse-content text-sm">
                                                <ul className="list bg-base-100 rounded-box shadow-md">
                                                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                                                        {status_histories.length <
                                                            1 && "Tidak Ada "}
                                                        Riwayat Status
                                                    </li>
                                                    {maintenance.status_histories.map(
                                                        (
                                                            status_history,
                                                            index
                                                        ) => (
                                                            <li
                                                                className="list-row"
                                                                key={index}
                                                            >
                                                                <div className="items-center">
                                                                    <BadgeStatus
                                                                        param={
                                                                            status_history.status
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div>
                                                                        {
                                                                            status_history
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs font-semibold opacity-60">
                                                                        {parseDateTime(
                                                                            status_history.created_at
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="list-col-wrap text-xs">
                                                                    {
                                                                        status_history.note
                                                                    }
                                                                </p>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Deskripsi</th>
                                    <td>
                                        {showValueOrDash(
                                            maintenance.description
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Waktu Dijadwalkan</th>
                                    <td>
                                        {parseDateTime(
                                            maintenance.scheduled_at
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2">
                                        <div className="mb-2">
                                            Media ({feedbacks.length}/5)
                                        </div>
                                        {feedbacks.map((f, i) => (
                                            <div
                                                className="flex items-start pr-5 pt-4"
                                                key={i}
                                            >
                                                <div className="flex items-center mr-5">
                                                    <div
                                                        className="w-[100px] h-[100px] cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedFile(f);
                                                            document
                                                                .getElementById(
                                                                    "preview_file_modal"
                                                                )
                                                                .showModal();
                                                        }}
                                                    >
                                                        {f.file_path.match(
                                                            /\.(jpg|jpeg|png|gif|webp)$/i
                                                        ) ? (
                                                            <img
                                                                src={`/storage/${f.file_path}`}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : f.file_path.match(
                                                              /\.(mp4|mov|avi|mkv|webm)$/i
                                                          ) ? (
                                                            <video
                                                                src={`/storage/${f.file_path}`}
                                                                // controls
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div>
                                                                Tipe file tidak
                                                                didukung
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    {f.description}
                                                </div>
                                            </div>
                                        ))}
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <form onSubmit={handleComplete}>
                                            {lastStatus == 2 && (
                                                <Input
                                                    label="Catatan"
                                                    isRequired={true}
                                                    className="mb-2"
                                                    type="text"
                                                    placeholder="Catatan"
                                                    value={data.note}
                                                    onChange={(e) =>
                                                        setData(
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    error={errors.note}
                                                />
                                            )}
                                            <div className="flex justify-end mt-2">
                                                <Link
                                                    href={route(
                                                        "maintenances.index"
                                                    )}
                                                    className="btn btn-secondary"
                                                >
                                                    <FaArrowLeft />
                                                    <span className="hidden sm:flex">
                                                        Kembali
                                                    </span>
                                                </Link>
                                                {lastStatus == 2 && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-error ml-2"
                                                            onClick={() =>
                                                                openRejectModal()
                                                            }
                                                        >
                                                            <FaCheck />
                                                            <span className="hidden sm:flex">
                                                                Tolak
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-success ml-2"
                                                            onClick={() =>
                                                                openApproveModal()
                                                            }
                                                        >
                                                            <FaCheck />
                                                            <span className="hidden sm:flex">
                                                                Setujui
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
            <ConfirmModal
                modalRef={modalRef}
                onCancel={closeConfirmModal}
                onConfirm={handleConfirm}
                isLoading={processing}
                title={confirmConfig.title}
                labelButton={confirmConfig.labelButton}
                detail={confirmConfig.detail}
            />
        </AuthenticatedLayout>
    );
}
