<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Prescription;
use App\Models\QueueEntry;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientMedicationScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Always use an isolated SQLite test database.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    public function test_unauthenticated_patient_cannot_view_medications(): void
    {
        $this->getJson('/api/patient/medications')
            ->assertUnauthorized();
    }

    public function test_authenticated_patient_can_view_medications(): void
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Patient::create([
            'user_id' => $user->id,
            'patient_number' => 'PT-MED-001',
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patient/medications')
            ->assertOk()
            ->assertExactJson([
                'medications' => [],
            ]);
    }

    public function test_non_patient_roles_cannot_view_medications(): void
    {
        foreach (['doctor', 'staff', 'admin'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'status' => 'active',
            ]);

            Sanctum::actingAs($user);

            $this->getJson('/api/patient/medications')
                ->assertForbidden();
        }
    }

    public function test_patient_without_linked_profile_cannot_view_medications(): void
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patient/medications')
            ->assertNotFound();
    }

    public function test_patient_can_view_own_issued_medication_schedule(): void
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        $patient = Patient::create([
            'user_id' => $user->id,
            'patient_number' => 'PT-MED-002',
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);

        $appointment = Appointment::create([
            'appointment_number' => 'APT-MED-002',
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => now()->subDay()->toDateString(),
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'completed',
        ]);

        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-MED-002',
            'queue_date' => now()->subDay()->toDateString(),
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now()->subDay(),
            'completed_at' => now()->subDay(),
        ]);

        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'completed',
            'completed_at' => now()->subDay(),
        ]);

        $prescription = Prescription::create([
            'consultation_id' => $consultation->id,
            'status' => 'issued',
            'issued_at' => now()->subDay(),
        ]);

        $prescription->issued_by = $doctor->id;
        $prescription->save();

        $medication = $prescription->items()->create([
            'medicine' => 'TEST ONLY - Medication A',
            'strength' => '10 mg',
            'dosage' => '1 tablet',
            'frequency' => 'Twice daily',
            'duration_days' => 5,
            'duration' => '5 days',
            'instructions' => 'TEST ONLY - Instructions',
            'schedule_type' => 'fixed',
            'as_needed' => false,
            'administration_times' => ['08:00', '20:00'],
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patient/medications')
            ->assertOk()
            ->assertJsonCount(1, 'medications')
            ->assertJsonPath('medications.0.id', $medication->id)
            ->assertJsonPath(
                'medications.0.medicine',
                'TEST ONLY - Medication A'
            )
            ->assertJsonPath(
                'medications.0.prescription_id',
                $prescription->id
            )
            ->assertJsonPath(
                'medications.0.schedule_type',
                'fixed'
            )
            ->assertJsonPath(
                'medications.0.administration_times',
                ['08:00', '20:00']
            );
    }

public function test_patient_cannot_view_another_patients_medications(): void
{
    $patientUser = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    $otherUser = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // The logged-in patient.
    Patient::create([
        'user_id' => $patientUser->id,
        'patient_number' => 'PT-MED-003',
        'first_name' => 'Test',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
    ]);

    // Another patient who owns the prescription.
    $otherPatient = Patient::create([
        'user_id' => $otherUser->id,
        'patient_number' => 'PT-MED-004',
        'first_name' => 'Other',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
    ]);

    $appointment = Appointment::create([
        'appointment_number' => 'APT-MED-004',
        'patient_id' => $otherPatient->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'appointment_date' => now()->subDay()->toDateString(),
        'appointment_time' => '09:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'completed',
    ]);

    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'queue_number' => 'Q-MED-004',
        'queue_date' => now()->subDay()->toDateString(),
        'priority' => 'normal',
        'status' => 'completed',
        'queued_at' => now()->subDay(),
        'completed_at' => now()->subDay(),
    ]);

    $consultation = Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'completed',
        'completed_at' => now()->subDay(),
    ]);

    $prescription = Prescription::create([
        'consultation_id' => $consultation->id,
        'status' => 'issued',
        'issued_at' => now()->subDay(),
    ]);

    $prescription->issued_by = $doctor->id;
    $prescription->save();

    $prescription->items()->create([
        'medicine' => 'PRIVATE TEST MEDICATION',
        'dosage' => '1 tablet',
        'frequency' => 'Once daily',
        'schedule_type' => 'fixed',
        'administration_times' => ['08:00'],
    ]);

    // Authenticate as the first patient, not the owner.
    Sanctum::actingAs($patientUser);

    $this->getJson('/api/patient/medications')
        ->assertOk()
        ->assertJsonCount(0, 'medications')
        ->assertDontSee('PRIVATE TEST MEDICATION');
}

public function test_patient_cannot_view_draft_prescription_medications(): void
{
    $user = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $patient = Patient::create([
        'user_id' => $user->id,
        'patient_number' => 'PT-MED-DRAFT-001',
        'first_name' => 'Test',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
    ]);

    $appointment = Appointment::create([
        'appointment_number' => 'APT-MED-DRAFT-001',
        'patient_id' => $patient->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'appointment_date' => now()->subDay()->toDateString(),
        'appointment_time' => '09:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'completed',
    ]);

    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'queue_number' => 'Q-MED-DRAFT-001',
        'queue_date' => now()->subDay()->toDateString(),
        'priority' => 'normal',
        'status' => 'completed',
        'queued_at' => now()->subDay(),
        'completed_at' => now()->subDay(),
    ]);

    $consultation = Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'completed',
        'completed_at' => now()->subDay(),
    ]);

    // Prescription has NOT been issued.
    $prescription = Prescription::create([
        'consultation_id' => $consultation->id,
        'status' => 'draft',
        'issued_at' => null,
    ]);

    $prescription->items()->create([
        'medicine' => 'PRIVATE DRAFT MEDICINE',
        'dosage' => '1 tablet',
        'frequency' => 'Once daily',
        'schedule_type' => 'fixed',
        'administration_times' => ['08:00'],
    ]);

    Sanctum::actingAs($user);

    $this->getJson('/api/patient/medications')
        ->assertOk()
        ->assertJsonCount(0, 'medications')
        ->assertDontSee('PRIVATE DRAFT MEDICINE');
}

public function test_patient_cannot_view_medications_from_incomplete_consultation(): void
{
    $user = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $patient = Patient::create([
        'user_id' => $user->id,
        'patient_number' => 'PT-MED-INCOMPLETE-001',
        'first_name' => 'Test',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
    ]);

    $appointment = Appointment::create([
        'appointment_number' => 'APT-MED-INCOMPLETE-001',
        'patient_id' => $patient->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'appointment_date' => now()->subDay()->toDateString(),
        'appointment_time' => '09:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'scheduled',
    ]);

    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'queue_number' => 'Q-MED-INCOMPLETE-001',
        'queue_date' => now()->subDay()->toDateString(),
        'priority' => 'normal',
        'status' => 'in_consultation',
        'queued_at' => now()->subDay(),
    ]);

    // Consultation is NOT completed.
    $consultation = Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'draft',
        'completed_at' => null,
    ]);

    // Deliberately inconsistent test data:
    // an issued prescription linked to an incomplete consultation.
    $prescription = Prescription::create([
        'consultation_id' => $consultation->id,
        'status' => 'issued',
        'issued_at' => now()->subDay(),
    ]);

    $prescription->issued_by = $doctor->id;
    $prescription->save();

    $prescription->items()->create([
        'medicine' => 'PRIVATE INCOMPLETE MEDICINE',
        'dosage' => '1 tablet',
        'frequency' => 'Once daily',
        'schedule_type' => 'fixed',
        'administration_times' => ['08:00'],
    ]);

    Sanctum::actingAs($user);

    $this->getJson('/api/patient/medications')
        ->assertOk()
        ->assertJsonCount(0, 'medications')
        ->assertDontSee('PRIVATE INCOMPLETE MEDICINE');
}

}
