<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LabRequestSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_laboratory_request_tables_and_columns_exist(): void
    {
        // Protect the real PostgreSQL database.
        $this->assertSame('sqlite', config('database.default'));

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $tables = [
            'lab_requests' => [
                'id',
                'consultation_id',
                'requested_by',
                'status',
                'clinical_indication',
                'instructions',
                'issued_by',
                'issued_at',
            ],

            'lab_test_catalog' => [
                'id',
                'category',
                'name',
                'is_active',
                'sort_order',
            ],

            'lab_request_items' => [
                'id',
                'lab_request_id',
                'lab_test_catalog_id',
                'test_name',
                'category',
                'is_custom',
                'notes',
            ],
        ];

        foreach ($tables as $table => $columns) {
            $this->assertTrue(
                Schema::hasTable($table),
                "Missing table: {$table}"
            );

            foreach ($columns as $column) {
                $this->assertTrue(
                    Schema::hasColumn($table, $column),
                    "Missing column: {$table}.{$column}"
                );
            }
        }
    }
}
