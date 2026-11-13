<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTestCatalog extends Model
{
    // Match our existing migration's table name.
    protected $table = 'lab_test_catalog';

    protected $fillable = [
        'category',
        'name',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // Laboratory request items that reference this examination.
    public function requestItems()
    {
        return $this->hasMany(
            LabRequestItem::class,
            'lab_test_catalog_id'
        );
    }
}
