import { Link } from "@inertiajs/react";

export function BreadcrumbsInventoryTransactions() {
    return (
        <Link href={route("inventoryTransactions.index")}>Transaksi Alat</Link>
    );
}
