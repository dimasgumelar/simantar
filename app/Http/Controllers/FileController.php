<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\File;
use App\Services\ExportService;
use App\Services\FileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FileController extends Controller
{
    protected $fileService;
    protected $exportService;

    public function __construct(FileService $fileService, ExportService $exportService)
    {
        $this->fileService = $fileService;
        $this->exportService = $exportService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $files = $this->fileService->getAll($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('Files/Index', compact('files'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $files = $this->fileService->getAll($search, $perPage, $sortField, $sortDirection);

        $fileName = 'files_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($files) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nama', 'Kategori', 'File', 'Dibuat Oleh', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($files as $file) {
                fputcsv($handle, [
                    $file->id,
                    $file->name,
                    $file->category_name,
                    config('app.url')."/storage/".$file->file_path,
                    $file->created_by_user->name,
                    $file->created_at,
                    $file->updated_at,
                ]);
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = config('constants.file_category');
        return Inertia::render('Files/Form',[
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|min:1|max:4',
            'file' => 'required|max:2048|mimes:jpg,jpeg,png,pdf,xls,xlsx,mp4,mov',
        ]);

        $data['created_by'] = Auth::user()->id;
        $file = $this->fileService->create($data, $request->file('file') ?? null);
        if (!$file) {
            return redirect()->back()->with('error', 'Gagal menambah file.');
        }

        return redirect()->route('files.index')->with('success', 'Berhasil menambah file.');
    }

    /**
     * Display the specified resource.
     */
    public function show(File $file)
    {
        return Inertia::render('Files/Show', [
            'file' => $file,
            'transmission' => $file->transmission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(File $file)
    {
        $categories = config('constants.file_category');
        return Inertia::render('Files/Form', [
            'file' => $file,
            'categories' => $categories,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|min:1|max:4',
        ]);

        $fileUpdated = $this->fileService->update($file, $data);
        if (!$fileUpdated) {
            return redirect()->back()->with('error', 'Gagal mengubah file.');
        }

        return redirect()->route('files.index')->with('success', 'Berhasil mengubah file.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file)
    {
        $deleted = $this->fileService->delete($file);
        if (!$deleted) {
            return redirect()->back()->with('error', 'Gagal menghapus file.');
        }

        return redirect()->route('files.index')->with('success', 'Berhasil menghapus file.');
    }
}