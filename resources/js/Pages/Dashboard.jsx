import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FaBroadcastTower } from "react-icons/fa";
import { BadgeRole } from "@/Components/Badge";
import Roles from "@/utils/UserFromUsePage";
import TableDropdown from "@/Components/TableDropdown";
import { DateInput } from "@/Components/Flatpickr";
import { inertiaGet } from "@/utils/helper-function";
import DailyActivityChart from "@/Pages/Dashboard/Charts/DailyActivityChart";
import NoteCategoryChart from "@/Pages/Dashboard/Charts/NoteCategoryChart";
import PowerTrendChart from "@/Pages/Dashboard/Charts/PowerTrendChart";
import SignatureStatusChart from "@/Pages/Dashboard/Charts/SignatureStatusChart";

const PRESETS = [
    { label: "7 Hari", days: 7 },
    { label: "30 Hari", days: 30 },
    { label: "90 Hari", days: 90 },
];

function daysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1));
    return date.toISOString().slice(0, 10);
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

export default function Dashboard({ transmissions = [], filters = {}, charts = {} }) {
    const { userFromUsePage } = Roles();

    const [selectedTransmissions, setSelectedTransmissions] = useState(
        filters.transmissions || []
    );
    const [from, setFrom] = useState(filters.from || daysAgo(30));
    const [to, setTo] = useState(filters.to || today());

    function applyFilters(overrides = {}) {
        inertiaGet("dashboard", {
            transmissions: selectedTransmissions,
            from,
            to,
            ...overrides,
        });
    }

    function toggleTransmission(id) {
        const updated = selectedTransmissions.includes(id)
            ? selectedTransmissions.filter((t) => t !== id)
            : [...selectedTransmissions, id];

        setSelectedTransmissions(updated);
        applyFilters({ transmissions: updated });
    }

    function applyPreset(days) {
        const newFrom = daysAgo(days);
        const newTo = today();
        setFrom(newFrom);
        setTo(newTo);
        applyFilters({ from: newFrom, to: newTo });
    }

    const activePreset =
        PRESETS.find((preset) => from === daysAgo(preset.days) && to === today())
            ?.days ?? "";

    function handleFromChange(value) {
        setFrom(value);
        applyFilters({ from: value });
    }

    function handleToChange(value) {
        setTo(value);
        applyFilters({ to: value });
    }

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

            <div className="card bg-base-100 shadow-sm w-full mt-4">
                <div className="card-body">
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className="select select-bordered select-sm w-24 shrink-0"
                            value={activePreset}
                            onChange={(e) => {
                                if (e.target.value) {
                                    applyPreset(Number(e.target.value));
                                }
                            }}
                        >
                            <option value="">Cepat</option>
                            {PRESETS.map((preset) => (
                                <option key={preset.days} value={preset.days}>
                                    {preset.label}
                                </option>
                            ))}
                        </select>
                        <div className="w-28">
                            <DateInput
                                value={from}
                                onChange={handleFromChange}
                                maxDate={to}
                                placeholder="Dari"
                                size="input-sm"
                            />
                        </div>
                        <span className="opacity-40 text-sm">-</span>
                        <div className="w-28">
                            <DateInput
                                value={to}
                                onChange={handleToChange}
                                minDate={from}
                                maxDate={today()}
                                placeholder="Sampai"
                                size="input-sm"
                            />
                        </div>
                        <div className="md:ml-auto">
                            <TableDropdown
                                title={
                                    selectedTransmissions.length > 0
                                        ? `${selectedTransmissions.length} Transmisi Dipilih`
                                        : "Semua Transmisi"
                                }
                                icon={<FaBroadcastTower />}
                                list={transmissions}
                                selectedList={selectedTransmissions}
                                toggleItem={toggleTransmission}
                                size="btn-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="card bg-base-100 shadow-sm w-full">
                    <div className="card-body">
                        <h3 className="font-semibold">
                            Jumlah Acara &amp; Keterangan per Hari
                        </h3>
                        <DailyActivityChart data={charts.dailyCounts} />
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm w-full">
                    <div className="card-body">
                        <h3 className="font-semibold">
                            Distribusi Kategori Keterangan
                        </h3>
                        <NoteCategoryChart data={charts.noteCategories} />
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm w-full">
                    <div className="card-body">
                        <h3 className="font-semibold">Tren Daya (Power)</h3>
                        <PowerTrendChart data={charts.powerTrend} />
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm w-full">
                    <div className="card-body">
                        <h3 className="font-semibold">
                            Status Tanda Tangan per Transmisi
                        </h3>
                        <SignatureStatusChart data={charts.signatureStatus} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
