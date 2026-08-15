<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class WebController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }
}
