<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientRecordsTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_register_patient_successfully(): void
    {
        // Ensure we use isolated SQLite testing.
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

        // Create synthetic staff account.
        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        // Authenticate as staff.
        Sanctum::actingAs($staff);

        // Synthetic patient registration data.
        $data = [
            'first_name' => 'Synthetic',
            'middle_name' => 'Test',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'phone_number' => '09123456789',
            'barangay' => 'Magugpo',
            'city' => 'Tagum City',
            'province' => 'Davao del Norte',
            'emergency_contact_name' => 'Test Contact',
            'emergency_contact_relationship' => 'Parent',
            'emergency_contact_phone' => '09987654321',
        ];

        // Register patient through CURA API.
        $response = $this->postJson(
            '/api/patients',
            $data
        );

        // Registration should succeed.
        $response->assertStatus(201);

        $response->assertJsonPath(
            'message',
            'Patient registered successfully.'
        );

        $response->assertJsonPath(
            'patient.first_name',
            'Synthetic'
        );

        $response->assertJsonPath(
            'patient.last_name',
            'Patient'
        );

        $response->assertJsonPath(
            'patient.status',
            'active'
        );

        // Verify a patient number was generated.
        $patientNumber = $response->json(
            'patient.patient_number'
        );

        $this->assertIsString($patientNumber);

        $this->assertMatchesRegularExpression(
            '/^PT-[A-Z0-9]{8}$/',
            $patientNumber
        );

        // Verify patient data was saved.
        $this->assertDatabaseHas('patients', [
            'patient_number' => $patientNumber,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'sex' => 'male',
            'status' => 'active',
        ]);

        // Only one patient should exist.
        $this->assertDatabaseCount(
            'patients',
            1
        );

        // Confirm the record is retrievable.
        $patient = Patient::where(
            'patient_number',
            $patientNumber
        )->first();

        $this->assertNotNull($patient);
    }

public function test_doctor_cannot_register_patient(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Create a synthetic doctor account.
    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Authenticate as doctor.
    Sanctum::actingAs($doctor);

    // Submit valid synthetic patient information.
    $response = $this->postJson('/api/patients', [
        'first_name' => 'Unauthorized',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
    ]);

    // Doctor must not access staff-only registration.
    $response->assertStatus(403);

    // No patient record should be created.
    $this->assertDatabaseCount('patients', 0);
}


}
