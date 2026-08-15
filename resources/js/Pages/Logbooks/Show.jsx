import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { parseDate } from "@/utils/helper-function";
import { BreadcrumbsLogbooks } from "@/Pages/Logbooks/Constant";
import LogbookDetail from "./Partials/LogbookDetail";

export default function LogbooksShow({ logbook, copyableLogbooks }) {
    const breadcrumbs = [
        <BreadcrumbsLogbooks />,
        `${logbook.transmission.name} - ${parseDate(logbook.tanggal)}`,
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />

                    <LogbookDetail
                        logbook={logbook}
                        copyableLogbooks={copyableLogbooks}
                    />

                    <div className="flex justify-end mt-4">
                        <Link
                            href={route("logbooks.index")}
                            className="btn btn-secondary"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
