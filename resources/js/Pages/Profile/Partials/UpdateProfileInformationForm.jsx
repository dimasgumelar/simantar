import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/Components/FormInput";

export default function UpdateProfileInformation() {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
                <h2 className="card-title">Informasi Profil</h2>
                <form onSubmit={submit} className="space-y-4 mt-2">
                    <Input
                        isRequired={true}
                        type="text"
                        label="Nama"
                        placeholder="Nama"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        type="email"
                        label="Email"
                        value={data.email}
                        disabled={true}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`btn ${
                                processing
                                    ? "btn-disabled"
                                    : recentlySuccessful
                                    ? "btn-success"
                                    : "btn-primary"
                            }`}
                            disabled={processing}
                        >
                            {processing
                                ? "Menyimpan..."
                                : recentlySuccessful
                                ? "Tersimpan"
                                : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
