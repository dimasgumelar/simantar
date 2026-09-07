import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { DownloadDropdownButton } from "@/Components/Button";
import { parseDate } from "@/utils/helper-function";
import { BreadcrumbsLogbooks } from "@/Pages/Logbooks/Constant";
import LogbookDetail from "./Partials/LogbookDetail";
import PowerList from "./Partials/PowerList";
import PetugasList from "./Partials/PetugasList";
import GuestBookList from "./Partials/GuestBookList";
import Roles from "@/utils/UserFromUsePage";

export default function LogbooksShow({
    logbook,
    copyableLogbooks,
    eventNameSuggestions = [],
}) {
    const { role } = Roles();
    const canManage = role.hasOperator || role.hasKoordinator;

    const breadcrumbs = [
        <BreadcrumbsLogbooks />,
        `${logbook.transmission.name} - ${parseDate(logbook.tanggal)}`,
    ];

    function handleDownloadPdf() {
        window.location.href = route("logbooks.pdf", logbook.id);
    }

    function handleDownloadCsv() {
        window.location.href = route("logbooks.csv", logbook.id);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <Breadcrumbs list={breadcrumbs} />
                        <DownloadDropdownButton
                            options={[
                                { label: "PDF", onClick: handleDownloadPdf },
                                { label: "CSV", onClick: handleDownloadCsv },
                            ]}
                        />
                    </div>

                    <div className="overflow-x-auto mt-2">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>Transmisi</th>
                                    <td>{logbook.transmission.name}</td>
                                </tr>
                                <tr>
                                    <th>Tanggal</th>
                                    <td>{parseDate(logbook.tanggal)}</td>
                                </tr>
                                <tr>
                                    <th>Power Transmisi</th>
                                    <td>
                                        <PowerList
                                            logbook={logbook}
                                            canManage={canManage}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <PetugasList logbook={logbook} />

                    <GuestBookList logbook={logbook} canManage={canManage} />

                    <LogbookDetail
                        logbook={logbook}
                        copyableLogbooks={copyableLogbooks}
                        eventNameSuggestions={eventNameSuggestions}
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
