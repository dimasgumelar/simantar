import { router } from "@inertiajs/react";
import Roles from "@/utils/UserFromUsePage";
import { parseDateTime } from "@/utils/helper-function";

export default function PetugasList({ logbook }) {
    const { userFromUsePage, role } = Roles();
    const canManage = role.hasOperator || role.hasKoordinator;
    const hasSigned = logbook.petugas_list.some(
        (petugas) => petugas.id === userFromUsePage.id
    );
    const canSign = canManage && !hasSigned;

    const handleSign = () => {
        router.post(
            route("logbooks.sign", logbook.id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <div className="overflow-x-auto mt-2">
            <table className="table">
                <tbody>
                    <tr>
                        <th>Petugas</th>
                        <td>
                            <div className="flex flex-col gap-2">
                                {logbook.petugas_list.length === 0 ? (
                                    <span className="text-sm opacity-70">
                                        Belum ada yang menandatangani.
                                    </span>
                                ) : (
                                    logbook.petugas_list.map((petugas) => (
                                        <div
                                            key={petugas.id}
                                            className="flex items-center gap-2"
                                        >
                                            <span>{petugas.name}</span>
                                            <span className="badge badge-outline badge-success">
                                                TTD{" "}
                                                {parseDateTime(
                                                    petugas.pivot.signed_at
                                                )}
                                            </span>
                                        </div>
                                    ))
                                )}
                                {canSign && (
                                    <div>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={handleSign}
                                        >
                                            Tanda Tangani
                                        </button>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
