<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabRequestItem extends Model
{
    protected $fillable = [
        'lab_request_id',
        'lab_test_catalog_id',
        'test_name',
        'category',
        'is_custom',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_custom' => 'boolean',
        ];
    }

    // Laboratory request containing this examination.
    public function labRequest()
    {
        return $this->belongsTo(LabRequest::class);
    }

    // Catalog examination, if one was selected.
    // Null for examinations entered through Other (Specify).
    public function catalogTest()
    {
        return $this->belongsTo(
            LabTestCatalog::class,
            'lab_test_catalog_id'
        );
    }
}
