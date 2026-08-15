import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useRef, useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { BadgeRole } from "@/Components/Badge";
import { parseDateTime } from "@/utils/helper-function";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ user }) {
    const breadcrumbs = ["Profil"];
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const onAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const onPhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Pilih file gambar yang valid.");
            e.target.value = "";
            return;
        }

        setUploading(true);
        router.post(
            route("profile.photo.update"),
            { photo: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onError: () => alert("Gagal mengunggah foto profil."),
                onFinish: () => {
                    setUploading(false);
                    e.target.value = "";
                },
            }
        );
    };

    const onRemovePhoto = () => {
        if (!confirm("Hapus foto profil?")) return;
        router.delete(route("profile.photo.destroy"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profil" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                        <div className="relative w-16 h-16 shrink-0 group">
                            <button
                                type="button"
                                onClick={onAvatarClick}
                                className="block w-16 h-16 rounded-full overflow-hidden cursor-pointer"
                                title="Ubah foto profil"
                            >
                                {user.photo_path ? (
                                    <img
                                        src={`/storage/${user.photo_path}`}
                                        alt="Foto profil"
                                        className="w-16 h-16 object-cover"
                                    />
                                ) : (
                                    <div className="avatar avatar-placeholder w-16 h-16">
                                        <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                            <span className="text-2xl">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {uploading ? (
                                        <span className="loading loading-spinner loading-sm text-white"></span>
                                    ) : (
                                        <FaCamera className="text-white" />
                                    )}
                                </div>
                            </button>
                            {user.photo_path && (
                                <button
                                    type="button"
                                    onClick={onRemovePhoto}
                                    className="absolute -top-1 -right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    title="Hapus foto profil"
                                >
                                    <FaTimes size={10} />
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onPhotoChange}
                            />
                        </div>
                        <div>
                            <div className="text-xl font-semibold">
                                {user.name}
                            </div>
                            <div className="mt-1">
                                <BadgeRole roles={user.roles} />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-6">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Telepon</th>
                                    <td>{user.phone ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>NIP</th>
                                    <td>{user.nip ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Pangkat/Golongan</th>
                                    <td>{user.pangkat_golongan ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Jabatan</th>
                                    <td>{user.jabatan ?? "-"}</td>
                                </tr>
                                <tr>
                                    <th>Bergabung Sejak</th>
                                    <td>{parseDateTime(user.created_at)}</td>
                                </tr>
                                <tr>
                                    <th>Terakhir Diperbarui</th>
                                    <td>{parseDateTime(user.updated_at)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <UpdateProfileInformationForm />
                <UpdatePasswordForm />
            </div>
        </AuthenticatedLayout>
    );
}
