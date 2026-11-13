<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DoctorPatientAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Protect the development PostgreSQL database.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    private function createDoctor(): User
    {
        return User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);
    }

    private function createPatient(
        string $number,
        string $firstName
    ): Patient {
        return Patient::create([
            'patient_number' => $number,
            'first_name' => $firstName,
            'last_name' => 'TestPatient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);
    }

    private function assignPatient(
        User $doctor,
        Patient $patient,
        string $appointmentNumber,
        ?string $date = null,
        string $status = 'scheduled'
    ): Appointment {
        return Appointment::create([
            'appointment_number' => $appointmentNumber,
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' =>
                $date ?? now('Asia/Manila')->toDateString(),
            'appointment_time' => '10:00:00',
            'appointment_type' => 'walk_in',
            'status' => $status,
        ]);
    }

    public function test_doctor_sees_only_their_assigned_patients(): void
    {
        $doctorA = $this->createDoctor();
        $doctorB = $this->createDoctor();

        $patientA = $this->createPatient(
            'PT-ACCESS-A',
            'Alpha'
        );

        $patientB = $this->createPatient(
            'PT-ACCESS-B',
            'Beta'
        );

        $this->assignPatient(
            $doctorA,
            $patientA,
            'APT-ACCESS-A'
        );

        $this->assignPatient(
            $doctorB,
            $patientB,
            'APT-ACCESS-B'
        );

        Sanctum::actingAs($doctorA);

        $this->getJson('/api/doctor/patients')
            ->assertOk()
            ->assertJsonCount(1, 'patients')
            ->assertJsonPath(
                'patients.0.id',
                $patientA->id
            )
            ->assertJsonPath('stats.total', 1);
    }

    public function test_past_and_cancelled_appointments_are_excluded(): void
    {
        $doctor = $this->createDoctor();

        $pastPatient = $this->createPatient(
            'PT-ACCESS-PAST',
            'Past'
        );

        $cancelledPatient = $this->createPatient(
            'PT-ACCESS-CANCELLED',
            'Cancelled'
        );

        $this->assignPatient(
            $doctor,
            $pastPatient,
            'APT-ACCESS-PAST',
            now('Asia/Manila')
                ->subDay()
                ->toDateString()
        );

        $this->assignPatient(
            $doctor,
            $cancelledPatient,
            'APT-ACCESS-CANCELLED',
            null,
            'cancelled'
        );

        Sanctum::actingAs($doctor);

        $this->getJson('/api/doctor/patients')
            ->assertOk()
            ->assertJsonCount(0, 'patients')
            ->assertJsonPath('stats.total', 0);
    }

    public function test_patient_appears_only_once_with_multiple_appointments(): void
    {
        $doctor = $this->createDoctor();

        $patient = $this->createPatient(
            'PT-ACCESS-DUP',
            'Duplicate'
        );

        $this->assignPatient(
            $doctor,
            $patient,
            'APT-ACCESS-DUP-1'
        );

        $this->assignPatient(
            $doctor,
            $patient,
            'APT-ACCESS-DUP-2'
        );

        Sanctum::actingAs($doctor);

        $this->getJson('/api/doctor/patients')
            ->assertOk()
            ->assertJsonCount(1, 'patients')
            ->assertJsonPath('stats.total', 1);
    }

    public function test_search_finds_only_assigned_patients(): void
    {
        $doctor = $this->createDoctor();

        $alpha = $this->createPatient(
            'PT-ACCESS-SEARCH-A',
            'Alpha'
        );

        $beta = $this->createPatient(
            'PT-ACCESS-SEARCH-B',
            'Beta'
        );

        $this->assignPatient(
            $doctor,
            $alpha,
            'APT-ACCESS-SEARCH-A'
        );

        $this->assignPatient(
            $doctor,
            $beta,
            'APT-ACCESS-SEARCH-B'
        );

        Sanctum::actingAs($doctor);

        $this->getJson(
            '/api/doctor/patients?search=ALPHA'
        )
            ->assertOk()
            ->assertJsonCount(1, 'patients')
            ->assertJsonPath(
                'patients.0.id',
                $alpha->id
            )
            ->assertJsonPath('stats.total', 2);
    }

    public function test_pagination_is_scoped_to_assigned_patients(): void
    {
        $doctor = $this->createDoctor();

        for ($i = 1; $i <= 21; $i++) {
            $patient = $this->createPatient(
                "PT-ACCESS-PAGE-{$i}",
                "Patient{$i}"
            );

            $this->assignPatient(
                $doctor,
                $patient,
                "APT-ACCESS-PAGE-{$i}"
            );
        }

        Sanctum::actingAs($doctor);

        $this->getJson('/api/doctor/patients?page=2')
            ->assertOk()
            ->assertJsonCount(1, 'patients')
            ->assertJsonPath(
                'pagination.current_page',
                2
            )
            ->assertJsonPath(
                'pagination.last_page',
                2
            )
            ->assertJsonPath(
                'pagination.total',
                21
            );
    }

    public function test_staff_and_patient_roles_are_denied(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        Sanctum::actingAs($staff);

        $this->getJson('/api/doctor/patients')
            ->assertForbidden();

        $patientUser = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Sanctum::actingAs($patientUser);

        $this->getJson('/api/doctor/patients')
            ->assertForbidden();
    }

    public function test_inactive_doctor_is_denied(): void
    {
        $doctor = $this->createDoctor();

        $doctor->update([
            'status' => 'inactive',
        ]);

        Sanctum::actingAs($doctor);

        $this->getJson('/api/doctor/patients')
            ->assertForbidden();
    }

    public function test_unauthenticated_request_is_denied(): void
    {
        $this->getJson('/api/doctor/patients')
            ->assertUnauthorized();
    }
}
