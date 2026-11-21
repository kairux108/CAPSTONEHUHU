<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class MedicationDoseLogMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_medication_dose_log_table_has_required_structure(): void
    {
        // Verify the test uses isolated SQLite.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $this->assertTrue(
            Schema::hasTable('medication_dose_logs')
        );

        $columns = [
            'id',
            'patient_id',
            'prescription_item_id',
            'recorded_by_user_id',
            'taken_at',
            'scheduled_for',
            'request_id',
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(
                Schema::hasColumn('medication_dose_logs', $column),
                "Missing column: {$column}"
            );
        }

        // Confirm foreign-key relationships.
        $foreignKeys = collect(
            DB::select(
                "PRAGMA foreign_key_list('medication_dose_logs')"
            )
        );

        $expected = [
            'patient_id' => 'patients',
            'prescription_item_id' => 'prescription_items',
            'recorded_by_user_id' => 'users',
        ];

        foreach ($expected as $column => $table) {
            $foreignKey = $foreignKeys->firstWhere(
                'from',
                $column
            );

            $this->assertNotNull(
                $foreignKey,
                "Missing foreign key: {$column}"
            );

            $this->assertSame(
                $table,
                $foreignKey->table
            );

            $this->assertSame(
                'RESTRICT',
                strtoupper($foreignKey->on_delete)
            );
        }
    }

    public function test_request_id_has_a_unique_index(): void
    {
        $indexes = DB::select(
            "PRAGMA index_list('medication_dose_logs')"
        );

        $hasUniqueRequestId = false;

        foreach ($indexes as $index) {
            if ((int) $index->unique !== 1) {
                continue;
            }

            $columns = collect(
                DB::select(
                    "PRAGMA index_info('{$index->name}')"
                )
            )->pluck('name')->all();

            if ($columns === ['request_id']) {
                $hasUniqueRequestId = true;
                break;
            }
        }

        $this->assertTrue(
            $hasUniqueRequestId,
            'request_id must have a unique index.'
        );
    }
}
