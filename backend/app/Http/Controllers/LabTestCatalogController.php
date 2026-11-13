<?php

namespace App\Http\Controllers;

use App\Models\LabTestCatalog;
use Illuminate\Http\JsonResponse;

class LabTestCatalogController extends Controller
{
    public function index(): JsonResponse
    {
        $tests = LabTestCatalog::query()
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get([
                'id',
                'category',
                'name',
            ]);

        $categories = $tests
            ->groupBy('category')
            ->map(function ($items, $category) {
                return [
                    'name' => $category,
                    'tests' => $items
                        ->map(function ($test) {
                            return [
                                'id' => $test->id,
                                'name' => $test->name,
                            ];
                        })
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
