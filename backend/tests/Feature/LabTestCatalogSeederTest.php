<?php

namespace Tests\Feature;

use Database\Seeders\LabTestCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class LabTestCatalogSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_seeder_loads_tests_without_duplicates(): void
    {
        // Verify the isolated test database.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        // Populate the laboratory test catalog.
        (new LabTestCatalogSeeder())->run();

        // Verify the total number of examinations.
        $this->assertSame(
            67,
            DB::table('lab_test_catalog')->count()
        );

        // Verify the number of categories.
        $this->assertSame(
            7,
            DB::table('lab_test_catalog')
                ->distinct()
                ->count('category')
        );

        // Verify sample catalog examinations.
        $this->assertDatabaseHas('lab_test_catalog', [
            'category' => 'Hematology',
            'name' => 'Complete Blood Count (CBC)',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('lab_test_catalog', [
            'category' => 'Imaging and Diagnostics',
            'name' => 'Chest X-ray',
            'is_active' => true,
        ]);

        // Simulate a clinic disabling an examination.
        DB::table('lab_test_catalog')
            ->where('category', 'Hematology')
            ->where('name', 'Complete Blood Count (CBC)')
            ->update(['is_active' => false]);

        // Run the seeder again.
        (new LabTestCatalogSeeder())->run();

        // Confirm no duplicate examinations were created.
        $this->assertSame(
            67,
            DB::table('lab_test_catalog')->count()
        );

        // Confirm existing clinic settings are preserved.
        $this->assertDatabaseHas('lab_test_catalog', [
            'category' => 'Hematology',
            'name' => 'Complete Blood Count (CBC)',
            'is_active' => false,
        ]);
    }
}
