<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientClinicWideAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    private function createPatient(): Patient
    {
        return Patient::create([
            'patient_number' => 'PT-SECURITY-TEST',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);
    }

    public function test_doctor_cannot_access_clinic_wide_patient_routes(): void
    {
        $patient = $this->createPatient();

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        Sanctum::actingAs($doctor);

        $this->getJson('/api/patients')
            ->assertForbidden();

        $this->getJson("/api/patients/{$patient->id}")
            ->assertForbidden();
    }

    public function test_staff_can_access_clinic_patient_records(): void
    {
        $patient = $this->createPatient();

        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        Sanctum::actingAs($staff);

        $this->getJson('/api/patients')
            ->assertOk();

        $this->getJson("/api/patients/{$patient->id}")
            ->assertOk()
            ->assertJsonPath('patient.id', $patient->id);
    }

    public function test_admin_can_access_clinic_patient_records(): void
    {
        $patient = $this->createPatient();

        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/patients')
            ->assertOk();

        $this->getJson("/api/patients/{$patient->id}")
            ->assertOk()
            ->assertJsonPath('patient.id', $patient->id);
    }

    public function test_patient_role_cannot_access_clinic_wide_records(): void
    {
        $patient = $this->createPatient();

        $patientUser = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Sanctum::actingAs($patientUser);

        $this->getJson('/api/patients')
            ->assertForbidden();

        $this->getJson("/api/patients/{$patient->id}")
            ->assertForbidden();
    }

    public function test_unauthenticated_user_cannot_access_patient_records(): void
    {
        $patient = $this->createPatient();

        $this->getJson('/api/patients')
            ->assertUnauthorized();

        $this->getJson("/api/patients/{$patient->id}")
            ->assertUnauthorized();
    }

public function test_doctor_cannot_update_patient_through_removed_routes(): void
{
    $patient = $this->createPatient();

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    Sanctum::actingAs($doctor);

    $payload = [
        'first_name' => 'Unauthorized',
        'last_name' => 'Change',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
    ];

    $this->putJson(
        "/api/patients/{$patient->id}",
        $payload
    )->assertStatus(405);

    $this->patchJson(
        "/api/patients/{$patient->id}",
        $payload
    )->assertStatus(405);

    $this->assertDatabaseHas('patients', [
        'id' => $patient->id,
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
    ]);
}

}
