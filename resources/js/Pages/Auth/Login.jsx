import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => {
                window.location.reload();
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div role="alert" className="alert alert-success mb-4">
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="label block mb-2" htmlFor="login">
                        Email atau NIP
                    </label>
                    <input
                        id="login"
                        type="text"
                        name="login"
                        className="input w-full"
                        value={data.login}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData("login", e.target.value)}
                    />
                    {errors.login && (
                        <div className="text-error text-sm mt-1">
                            {errors.login}
                        </div>
                    )}
                </div>

                <div>
                    <label className="label block mb-2" htmlFor="password">
                        Kata Sandi
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="input w-full"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                        <div className="text-error text-sm mt-1">
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <label className="label cursor-pointer gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            className="checkbox checkbox-sm"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="label-text">Ingat Saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="link link-hover text-sm"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={processing}
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Masuk"
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}
