<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_cura_core_tables_exist(): void
    {
        // Verify isolated testing database.
        $this->assertSame(
            'testing',
            app()->environment()
        );

        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        // Verify CURA core tables.
        $this->assertTrue(
            Schema::hasTable('appointments')
        );

        $this->assertTrue(
            Schema::hasTable('queue_entries')
        );

        $this->assertTrue(
            Schema::hasTable('consultations')
        );
    }
}
