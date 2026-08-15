<?php
namespace App\Repositories;

use App\Models\LogbookPower;

class LogbookPowerRepository
{
    public function create(array $data): LogbookPower
    {
        return LogbookPower::create($data);
    }

    public function delete($power)
    {
        return $power->delete();
    }
}
