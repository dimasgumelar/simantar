<?php
namespace App\Repositories;

use App\Models\GuestBook;

class GuestBookRepository
{
    public function create(array $data): GuestBook
    {
        return GuestBook::create($data);
    }

    public function update($guestBook, array $data)
    {
        $guestBook->update($data);
        return $guestBook;
    }

    public function delete($guestBook)
    {
        return $guestBook->delete();
    }
}
