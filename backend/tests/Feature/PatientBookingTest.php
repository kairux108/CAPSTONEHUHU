<?php

namespace Tests\Feature;

use Tests\TestCase;

class PatientBookingTest extends TestCase
{
    public function test_booking_tests_use_an_isolated_sqlite_database(): void
    {
        $this->assertSame(
            'testing',
            app()->environment()
        );

        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }
}
