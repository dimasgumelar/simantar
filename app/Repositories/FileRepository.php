<?php
namespace App\Repositories;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileRepository
{
    public function store($file, $folder)
    {
        $disk = 'public';

        // cek folder, kalau belum ada → buat
        if (!Storage::disk($disk)->exists($folder)) {
            Storage::disk($disk)->makeDirectory($folder);
        }

        return $file->store($folder, $disk);
    }

    public function delete($filePath)
    {
        if ($filePath) {
            Storage::disk('public')->delete($filePath);
        }
    }

    // public function store($file, $folder)
    // {
    //     $filename = $file->hashName();
    //     $destination = base_path('../storage/'.$folder);
    //     if (!file_exists($destination)) {
    //         mkdir($destination, 0755, true);
    //     }
    //     $file->move($destination, $filename);
    //     return $folder.'/' . $filename;
    // }

    // public function delete($filePath)
    // {
    //     if (empty($filePath)) {
    //         return;
    //     }
    //     $oldPath = base_path('../storage/' . $filePath);
    //     if (file_exists($oldPath)) {
    //         unlink($oldPath);
    //     }
    // }

    // public function all($search, $perPage, $sortField, $sortDirection)
    // {
    //     $categories = config('constants.file_category');
    //     $caseSql = "CASE files.category ";

    //     foreach ($categories as $item) {
    //         $caseSql .= "WHEN {$item['value']} THEN '{$item['label']}' ";
    //     }

    //     $caseSql .= "ELSE 'Tidak Diketahui' END AS category_name";

    //     $query = File::query()->select('files.*')->selectRaw($caseSql);
    //     if ($search) {
    //         $query->where('files.name', 'like', "%{$search}%");
    //         $query->having('category_name', 'like', "%{$search}%");
    //     }

    //     if ($sortField && in_array($sortField, ['id', 'name', 'created_at'])) {
    //         $query->orderBy($sortField, $sortDirection);
    //     }

    //     if ($sortField == "category") {
    //         $query->orderBy("category_name", $sortDirection);
    //     }

    //     if ($perPage > 0) {
    //         $files = $query->paginate($perPage)->withQueryString()->onEachSide(0);
    //     } else {
    //         $files = $query->get();
    //     }


    //     return $files;
    // }

    public function all($search, $perPage, $sortField, $sortDirection)
    {
        $categories = config('constants.file_category');

        $caseSql = "CASE files.category ";
        foreach ($categories as $item) {
            $caseSql .= "WHEN {$item['value']} THEN '{$item['label']}' ";
        }
        $caseSql .= "ELSE 'Tidak Diketahui' END AS category_name";

        $query = File::query()
            ->select('files.*')
            ->selectRaw($caseSql);

        if ($search) {
            $query->where('files.name', 'like', "%{$search}%");
            $query->orWhereRaw(
                str_replace(' AS category_name', '', $caseSql) . " LIKE ?",
                ["%{$search}%"]
            );
        }

        if ($sortField && in_array($sortField, ['id', 'name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($sortField === 'category') {
            $query->orderBy('category_name', $sortDirection);
        }

        if ($perPage > 0) {
            return $query->paginate($perPage)->withQueryString()->onEachSide(0);
        }

        return $query->get();
    }

    public function find($id)
    {
        return File::find($id);
    }

    public function create($data): File
    {
        return File::create($data);
    }

    public function update($file, $data)
    {
        $file->update($data);
        return $file;
    }

    public function destroy($file)
    {
        return $file->delete();
    }
}