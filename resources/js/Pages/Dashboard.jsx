import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BadgeRole } from "@/Components/Badge";
import Roles from "@/utils/UserFromUsePage";

export default function Dashboard({}) {
    const { userFromUsePage, role } = Roles();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Beranda
                </h2>
            }
        >
            <Head title="Beranda" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex flex-row items-center">
                        <div>Hai! {userFromUsePage.name}</div>
                        <div className="ml-2">
                            <BadgeRole roles={userFromUsePage.roles} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
