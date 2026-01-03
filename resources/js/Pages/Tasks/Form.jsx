import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useRef, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import DeleteModal from "@/Components/DeleteModal";
import { FormButtonSubmit, FormButtonFunction } from "@/Components/FormButton";
import { InputFile, Input } from "@/Components/FormInput";
import { BadgeStatus } from "@/Components/Badge";
import { FaEye, FaTrash, FaUpload, FaCheck, FaPlay } from "react-icons/fa";
import { FileModal } from "@/Components/Modal";
import { BreadcrumbsTasks } from "@/Pages/Tasks/Constant";
import { parseDateTime, showValueOrDash } from "@/utils/helper-function";

export default function MaintenancesForm({
    maintenance = {},
    transmission = {},
    created_by_user = {},
    inventory = {},
    feedbacks = [],
    isEdit = false,
    status_histories = [],
}) {
    const breadcrumbs = [<BreadcrumbsTasks />, isEdit ? "Ubah" : "Lihat"];

    const { data, setData, post, processing, errors } = useForm({
        description: "",
        feedback: "",
        file: null,
    });
    const [uploadedFiles, setUploadedFiles] = useState(feedbacks || []);
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteFeedbackId, setDeleteInventoryId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const lastStatus =
        status_histories?.length > 0
            ? status_histories[status_histories.length - 1].status
            : null;

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                alert("Pilih file gambar atau video yang valid.");
                return;
            }
            setData("file", file);
        } else {
            setData("file", null);
        }
    };

    const handleComplete = (e) => {
        e.preventDefault();
        setData("file", null);
        setData("description", "");
        post(route("tasks.complete", maintenance.id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let formData = new FormData();
            formData.append("file", data.file);
            formData.append("description", data.description);

            const res = await axios.post(
                route("feedbacks.store", maintenance.id),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // update state dari response
            setUploadedFiles((prev) => [...prev, res.data]);
            setData("file", null);
            setData("description", "");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);
            alert("Gagal mengunggah file.");
        } finally {
            setIsUploading(false);
        }
    };

    function handleDelete() {
        if (deleteFeedbackId) {
            setIsDeleting(true);
            post(route("feedbacks.destroy", deleteFeedbackId), {
                onSuccess: () => {
                    setUploadedFiles((prev) =>
                        prev.filter((f) => f.id !== deleteFeedbackId)
                    );
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data tugas.");
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            });
        }
    }

    function openDeleteModal(id) {
        setDeleteInventoryId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteInventoryId(null);
    }

    function handleStartTask() {
        setLoadingId(maintenance.id);
        post(route("tasks.start", maintenance.id), {
            preserveScroll: true,
            onFinish: () => setLoadingId(null), // reset setelah selesai
            onError: () => {
                alert("Gagal memulai tugas.");
                setLoadingId(null);
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Tugas" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
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
                                                    {status_histories.map(
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
                                            Media{" "}
                                            {(lastStatus == 1 ||
                                                lastStatus == 3) &&
                                                " - Upload dokumen gambar atau video dari kondisi awal, kegiatan, dan hasil akhir (" +
                                                    uploadedFiles.length +
                                                    "/5)"}{" "}
                                        </div>
                                        {uploadedFiles.length < 5 &&
                                            (lastStatus < 2 ||
                                                lastStatus == 3) && (
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="space-y-4 mt-2"
                                                >
                                                    <InputFile
                                                        ref={fileInputRef}
                                                        isRequired={true}
                                                        label="Dokumen"
                                                        placeholder="Dokumen"
                                                        onChange={onFileChange}
                                                        error={errors.file}
                                                    ></InputFile>
                                                    <Input
                                                        isRequired={true}
                                                        type="text"
                                                        label="Deskripsi"
                                                        placeholder="Deskripsi dokumen"
                                                        value={data.description}
                                                        onChange={(e) =>
                                                            setData(
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        error={
                                                            errors.description
                                                        }
                                                    />
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            disabled={
                                                                isUploading
                                                            }
                                                        >
                                                            {isUploading ? (
                                                                <>
                                                                    <span className="loading loading-spinner"></span>
                                                                    Mengunggah...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaUpload />{" "}
                                                                    Unggah
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        {uploadedFiles.map((f, i) => (
                                            <div
                                                className="flex items-start pr-5 pt-4"
                                                key={i}
                                            >
                                                <div className="flex items-center mr-5">
                                                    {(lastStatus < 2 ||
                                                        lastStatus == 3) && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedFile(
                                                                        f
                                                                    );
                                                                    document
                                                                        .getElementById(
                                                                            "preview_file_modal"
                                                                        )
                                                                        .showModal();
                                                                }}
                                                                className="btn btn-primary mr-1"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        f.id
                                                                    )
                                                                }
                                                                className="btn btn-error mr-5"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
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
                                            {lastStatus != 2 && (
                                                <Input
                                                    label="Laporan Pemeliharaan"
                                                    isRequired={true}
                                                    className="mb-2"
                                                    type="text"
                                                    placeholder="Laporan Pemeliharan"
                                                    value={data.feedback}
                                                    onChange={(e) =>
                                                        setData(
                                                            "feedback",
                                                            e.target.value
                                                        )
                                                    }
                                                    error={errors.feedback}
                                                    disabled={lastStatus == 2}
                                                />
                                            )}
                                            {(lastStatus == 1 ||
                                                lastStatus == 3) && (
                                                <FormButtonSubmit
                                                    backRoute={route(
                                                        "tasks.index"
                                                    )}
                                                    route={route(
                                                        "tasks.complete",
                                                        maintenance.id
                                                    )}
                                                    buttonColor="bg-success"
                                                    text="Selesai"
                                                    icon={<FaCheck />}
                                                    isSubmit={lastStatus != 2}
                                                    isLoading={processing}
                                                />
                                            )}
                                            {lastStatus == 0 && (
                                                <FormButtonFunction
                                                    backRoute={route(
                                                        "tasks.index"
                                                    )}
                                                    route={route(
                                                        "tasks.start",
                                                        maintenance.id
                                                    )}
                                                    buttonColor="bg-success"
                                                    text="Mulai"
                                                    icon={<FaPlay />}
                                                    isLoading={processing}
                                                    onClick={handleStartTask}
                                                />
                                            )}
                                        </form>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="tugas"
                isDeleting={isDeleting}
            />
        </AuthenticatedLayout>
    );
}
