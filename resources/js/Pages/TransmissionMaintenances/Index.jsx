import React, { useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    CreateButton,
    ViewButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { BreadcrumbsTXMaintenance } from "@/Pages/TransmissionMaintenances/Constant";

export default function DailyMaintenanceIndex({ dailymaintenance }) {
    const breadcrumbs = [<BreadcrumbsTXMaintenance />, "Daftar"];

    return (
        <AuthenticatedLayout>
            <Head title="Pemeliharaan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li><a>Pemeliharaan Transmisi</a></li>
                            <li>Daftar</li>
                        </ul>
                    </div>
                {/* name of each tab group should be unique */}
                    <div className="tabs tabs-box">
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="IRD" defaultChecked />
                        <div className="tab-content bg-base-100 border-base-300 p-6">
                            <label className="input">
                                <span className="label">Tanggal Pelaksanaan</span>
                                <input type="date" />
                            </label>  
                            <fieldset className="fieldset">
                            <legend className="fieldset-legend">Lokasi Transmisi</legend>
                            <select defaultValue="Pick a browser" className="select">
                                <option disabled={true}>Pilih Transmisi</option>
                                <option>Mayjen Sungkono</option>
                                <option>Sambikerep</option>
                                <option>Oro-oro Ombo</option>
                                <option>Tuban</option>
                                <option>Besuki</option>
                                <option>Alasmalang</option>
                                <option>Brengos</option>
                                <option>Brengik</option>
                                <option>Gn. Doek</option>
                                <option>Gn. Gending</option>
                                <option>Gn. Pandan</option>
                                <option>Wonogondo</option>
                                
                            </select>
                            </fieldset>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Nama Teknisi</legend>
                                <input type="text" className="input" placeholder="Masukkan Nama Teknisi" />
                            </fieldset>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Tindakan</legend>
                                <label>Kondisi Sebelum : </label>
                                <input type="text" className="input" placeholder="Keterangan" />
                                <input type="file" className="file-input" />
                                <label>Tindakan : </label>
                                <input type="text" className="input" placeholder="Keterangan" />
                                <input type="file" className="file-input" />
                                <label>Kondisi Sesudah : </label>
                                <input type="text" className="input" placeholder="Keterangan" />
                                <input type="file" className="file-input" />
                            </fieldset>
                            <button className="btn btn-primary">Simpan</button>
                        </div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="MUX"  />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="PA" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="ENCODER" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="EXCITER" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="PARABOLA" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="SWITCHER" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="MONITOR" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="AKI GENSET" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="HEAT EXCHANGER" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="TX SWITCHING" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}