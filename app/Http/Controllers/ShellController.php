<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ShellController extends Controller
{
    public function in(Request $request): JsonResponse
    {
        $request_id = uniqid('term-', true);
        $validated = $request->validate([
            'cwd' => 'required',
            'input' => 'required',
        ]);

        $output = [];
        $status = 0;
        $cwd = $validated['cwd'];
        $input = $validated['input'];

        Log::debug('[Terminal] Input', [
            'id' => $request_id,
            'cwd' => $cwd,
            'input' => $input,
        ]);

        $chdir = @chdir('/'.trim($cwd, '/'));
        if (!$chdir) {
            return response()->json([
                'output' => ['cd: no such file or directory:', $cwd],
                'status' => 1,
            ]);
        }

        exec($input, $output, $status);

        Log::debug('[Terminal] Executed ', [
            'id' => $request_id,
            'cwd' => $cwd,
            'input' => $input,
            'output' => implode('\n', $output),
        ]);

        return response()->json([
            'output' => $output,
            'status' => empty($output) ? 0 : $status,
        ]);
    }
}
