import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { InputDropdownManual } from "@/Components/FormInput";
import { DateInput } from "@/Components/Flatpickr";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsLogbooks } from "@/Pages/Logbooks/Constant";
import LogbookDetail from "./Partials/LogbookDetail";

export default function LogbooksDayView({
    transmissions,
    transmissionId,
    tanggal,
    logbook,
    copyableLogbooks,
}) {
    const breadcrumbs = [<BreadcrumbsLogbooks />, "Hari Ini"];

    const [selectedTransmission, setSelectedTransmission] =
        useState(transmissionId);
    const [selectedDate, setSelectedDate] = useState(tanggal);

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

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <InputDropdownManual
                            label="Transmisi"
                            value={selectedTransmission}
                            onChange={handleTransmissionChange}
                            list={transmissions}
                        />
                        <DateInput
                            label="Tanggal"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
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
