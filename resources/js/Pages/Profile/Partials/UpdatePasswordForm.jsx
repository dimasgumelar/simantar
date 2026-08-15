import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import { Input } from "@/Components/FormInput";

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
                <h2 className="card-title">Ubah Kata Sandi</h2>
                <form onSubmit={updatePassword} className="space-y-4 mt-2">
                    <Input
                        ref={currentPasswordInput}
                        isRequired={true}
                        type="password"
                        label="Kata Sandi Saat Ini"
                        placeholder="Kata Sandi Saat Ini"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        error={errors.current_password}
                    />
                    <Input
                        ref={passwordInput}
                        isRequired={true}
                        type="password"
                        label="Kata Sandi Baru"
                        placeholder="Kata Sandi Baru"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />
                    <Input
                        isRequired={true}
                        type="password"
                        label="Konfirmasi Kata Sandi"
                        placeholder="Konfirmasi Kata Sandi"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        error={errors.password_confirmation}
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
