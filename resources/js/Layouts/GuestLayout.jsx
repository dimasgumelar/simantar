import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 py-6">
            <Link href="/" className="flex flex-col items-center mb-6 text-center">
                <div className="text-4xl font-bold">SIMANTAR</div>
                <div className="text-sm opacity-70 mt-1">
                    Sistem Informasi Maintenance Alat Transmisi
                </div>
            </Link>

            <div className="card bg-base-100 shadow-sm w-full sm:max-w-md">
                <div className="card-body">{children}</div>
            </div>
        </div>
    );
}
