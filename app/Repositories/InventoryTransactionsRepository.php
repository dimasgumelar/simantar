<?php
namespace App\Repositories;

use App\Models\InventoryTransactions;

class InventoryTransactionsRepository
{
    public function all($search, $perPage, $sortField, $sortDirection)
    {
        $status = config('constants.inventory_transactions_status_name');

        $caseSql = "CASE inventory_transactions.status ";
        foreach ($status as $item) {
            $caseSql .= "WHEN {$item['value']} THEN '{$item['label']}' ";
        }
        $caseSql .= "ELSE 'Tidak Diketahui' END AS status_name";

        $query = InventoryTransactions::query()
            ->select('inventory_transactions.*')
            ->selectRaw($caseSql);
        if ($search) {
            $query->where('inventory_transactions.status', 'like', "%{$search}%")
            ->orWhere('inventories.name', 'like', "%{$search}%")
            ->orWhere('borrower.name', 'like', "%{$search}%")
            ->orWhere('pic.name', 'like', "%{$search}%");
            $query->orWhereRaw(
                str_replace(' AS status_name', '', $caseSql) . " LIKE ?",
                ["%{$search}%"]
            );
            // $query->where(function($q) use ($search) {
            // });
        }
        $query->join('users as borrower', 'inventory_transactions.user_id', '=', 'borrower.id');
        $query->join('users as pic', 'inventory_transactions.pic_id', '=', 'pic.id');
        $query->join('inventories', 'inventory_transactions.inventory_id', '=', 'inventories.id');

        if ($sortField && in_array($sortField, ['id', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        if ($sortField == "pic") {
            $query->orderBy("pic.name", $sortDirection);
        }

        if ($sortField == "name") {
            $query->orderBy("borrower.name", $sortDirection);
        }

        if ($sortField == "inventory") {
            $query->orderBy("inventories.name", $sortDirection);
        }

        if ($sortField == "transmission") {
            $query->orderBy("transmission.name", $sortDirection);
        }

        if ($sortField == "status") {
            $query->orderBy("status_name", $sortDirection);
        }

        if ($perPage > 0) {
            $inventoryTransactions = $query->with(['user:id,name', 'pic:id,name', 'inventory:id,name', 'transmission:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $inventoryTransactions = $query->get();
        }


        return $inventoryTransactions;
    }

    public function find($id)
    {
        return InventoryTransactions::find($id);
    }

    public function create($data): InventoryTransactions
    {
        return InventoryTransactions::create($data);
    }

    public function update($inventory, $data)
    {
        $inventory->update($data);
        return $inventory;
    }

    public function delete($inventory)
    {
        return $inventory->delete();
    }
}