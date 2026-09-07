import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { InputDropdownManual, Textarea } from "@/Components/FormInput";
import { BreadcrumbsJadwal } from "@/Pages/Schedules/Constant";

export default function TransmissionAdminForm({
    transmission = {},
    linkedUsers = [],
    defaultShiftCodes = [],
}) {
    const breadcrumbs = [
        <BreadcrumbsJadwal />,
        transmission.name,
        "Atur Admin Transmisi",
    ];

    const { data, setData, put, processing, errors } = useForm({
        admin_transmisi_id: transmission.admin_transmisi_id || "",
        shift_codes_text: (transmission.shift_codes || []).join("\n"),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("schedules.admin-transmisi.update", transmission.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Atur Admin Transmisi - ${transmission.name}`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <InputDropdownManual
                            label="Admin Transmisi"
                            value={data.admin_transmisi_id}
                            onChange={(e) =>
                                setData("admin_transmisi_id", e.target.value)
                            }
                            error={errors.admin_transmisi_id}
                            list={[
                                { user_id: "", name: "Tidak ada" },
                                ...linkedUsers,
                            ]}
                            idKey="user_id"
                        />
                        <p className="text-sm text-base-content/60">
                            Admin transmisi hanya bisa dipilih dari pegawai
                            yang sudah terhubung ke transmisi ini. Admin
                            transmisi bertugas mengisi jadwal dinas bulanan
                            untuk seluruh pegawai di transmisinya.
                        </p>
                        <Textarea
                            label="Kode Shift"
                            placeholder={defaultShiftCodes.join("\n")}
                            value={data.shift_codes_text}
                            onChange={(e) =>
                                setData("shift_codes_text", e.target.value)
                            }
                            error={errors.shift_codes_text}
                            rows={6}
                        />
                        <p className="text-sm text-base-content/60">
                            Satu kode shift per baris, akan muncul sebagai
                            pilihan di jadwal dinas transmisi ini. Kosongkan
                            untuk memakai kode standar:{" "}
                            {defaultShiftCodes.join(", ")}.
                        </p>
                        <FormButton
                            processing={processing}
                            isEdit={true}
                            route={route("schedules.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
