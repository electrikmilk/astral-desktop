<?php

namespace App\Http\Controllers;

class RemoteController
{
    public function info()
    {
        return response()->json([
            'name' => exec('uname -n'),
            'system' => exec('uname -s'),
            'arch' => exec('uname -p'),
        ]);
    }
}
