<?php
namespace App\Repositories;

use App\Models\LogbookNote;

class LogbookNoteRepository
{
    public function create(array $data): LogbookNote
    {
        return LogbookNote::create($data);
    }

    public function update($note, array $data)
    {
        $note->update($data);
        return $note;
    }

    public function delete($note)
    {
        return $note->delete();
    }
}
