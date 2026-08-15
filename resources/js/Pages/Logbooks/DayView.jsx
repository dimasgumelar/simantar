import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { DownloadDropdownButton } from "@/Components/Button";
import { InputDropdownManual } from "@/Components/FormInput";
import { DateInput } from "@/Components/Flatpickr";
import { inertiaGet, parseDate } from "@/utils/helper-function";
import { BreadcrumbsLogbooks } from "@/Pages/Logbooks/Constant";
import LogbookDetail from "./Partials/LogbookDetail";
import PowerList from "./Partials/PowerList";

function todayStr() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

export default function LogbooksDayView({
    transmissions,
    transmissionId,
    tanggal,
    logbook,
    copyableLogbooks,
}) {
    const [selectedTransmission, setSelectedTransmission] =
        useState(transmissionId);
    const [selectedDate, setSelectedDate] = useState(tanggal);

    const breadcrumbs = [
        <BreadcrumbsLogbooks />,
        selectedDate === todayStr() ? "Hari Ini" : parseDate(selectedDate),
    ];

    function applyFilters(overrides = {}) {
        inertiaGet("logbooks.index", {
            transmission_id: selectedTransmission,
            tanggal: selectedDate,
            ...overrides,
        });
    }

    function handleTransmissionChange(e) {
        const value = e.target.value;
        setSelectedTransmission(value);
        applyFilters({ transmission_id: value });
    }

    function handleDateChange(value) {
        setSelectedDate(value);
        applyFilters({ tanggal: value });
    }

    function handleCreate() {
        router.post(route("logbooks.store"), {
            transmission_id: selectedTransmission,
            tanggal: selectedDate,
        });
    }

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
                        {logbook && (
                            <DownloadDropdownButton
                                options={[
                                    {
                                        label: "PDF",
                                        onClick: handleDownloadPdf,
                                    },
                                    {
                                        label: "CSV",
                                        onClick: handleDownloadCsv,
                                    },
                                ]}
                            />
                        )}
                    </div>

                    <div className="overflow-x-auto mt-2">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th className="w-32 align-middle">
                                        Transmisi
                                    </th>
                                    <td>
                                        <InputDropdownManual
                                            label=""
                                            value={selectedTransmission}
                                            onChange={handleTransmissionChange}
                                            list={transmissions}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="w-32 align-middle">
                                        Tanggal
                                    </th>
                                    <td>
                                        <DateInput
                                            label=""
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="w-32 align-middle">
                                        Power Transmisi
                                    </th>
                                    <td>
                                        {logbook ? (
                                            <PowerList
                                                logbook={logbook}
                                                canManage={true}
                                            />
                                        ) : (
                                            <span className="text-sm opacity-70">
                                                Buat logbook terlebih dahulu
                                                untuk mencatat power.
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {!selectedTransmission ? (
                        <div className="mt-6 text-center text-sm opacity-70">
                            Anda tidak memiliki akses ke transmisi manapun.
                        </div>
                    ) : logbook ? (
                        <LogbookDetail
                            logbook={logbook}
                            copyableLogbooks={copyableLogbooks}
                        />
                    ) : (
                        <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                            <p className="opacity-70">
                                Belum ada logbook untuk transmisi dan tanggal
                                ini.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreate}
                            >
                                Buat Logbook
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
