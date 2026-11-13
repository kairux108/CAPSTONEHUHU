<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Diagnosis;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientMedicalRecordsTest extends TestCase
{
    use RefreshDatabase;

    private int $sequence = 0;

    protected function setUp(): void
    {
        parent::setUp();

        // Never run these tests against PostgreSQL.
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    private function createRecord(array $options = []): array
    {
        $this->sequence++;
        $number = $this->sequence;

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
            'patient_number' => "PT-MOBILE-{$number}",
            'first_name' => 'Synthetic',
            'last_name' => "Patient{$number}",
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);

        $appointment = Appointment::create([
            'appointment_number' => "APT-MOBILE-{$number}",
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
            'queue_number' => "Q-MOBILE-{$number}",
            'queue_date' => now()->subDay()->toDateString(),
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now()->subDay(),
            'completed_at' => now()->subDay(),
        ]);

        $status = $options['consultation_status'] ?? 'completed';

        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => $status,
            'subjective' => 'PRIVATE SOAP SUBJECTIVE TEST',
            'objective' => 'PRIVATE SOAP OBJECTIVE TEST',
            'assessment' => 'PRIVATE SOAP ASSESSMENT TEST',
            'plan' => 'PRIVATE SOAP PLAN TEST',
            'care_instructions' => 'TEST ONLY - Drink water',
            'follow_up_instructions' => 'TEST ONLY - Follow up',
            'completed_at' => $status === 'completed'
                ? now()->subDay()
                : null,
        ]);

        Diagnosis::create([
            'consultation_id' => $consultation->id,
            'name' => 'TEST ONLY - Diagnosis',
            'notes' => 'PRIVATE DOCTOR DIAGNOSIS NOTES',
            'reviewed' => $options['reviewed'] ?? true,
        ]);

        $prescriptionStatus =
            $options['prescription_status'] ?? 'issued';

        $prescription = Prescription::create([
            'consultation_id' => $consultation->id,
            'status' => $prescriptionStatus,
            'issued_at' => $prescriptionStatus === 'issued'
                ? now()->subDay()
                : null,
        ]);

        if ($prescriptionStatus === 'issued') {
            $prescription->issued_by = $doctor->id;
            $prescription->save();
        }

        $prescription->items()->create([
            'medicine' => 'TEST ONLY - Medicine',
            'strength' => '10 mg',
            'dosage' => '1 tablet',
            'frequency' => 'Once daily',
            'duration_days' => 5,
            'duration' => '5 days',
            'instructions' => 'TEST ONLY - Instructions',
        ]);

        return compact(
            'user',
            'doctor',
            'patient',
            'consultation',
            'prescription'
        );
    }

    public function test_patient_can_view_own_completed_records(): void
    {
        $record = $this->createRecord();

        Sanctum::actingAs($record['user']);

        $this->getJson('/api/patient/medical-records')
            ->assertOk()
            ->assertJsonPath('patient.id', $record['patient']->id)
            ->assertJsonCount(1, 'records.data')
            ->assertJsonPath(
                'records.data.0.consultation_id',
                $record['consultation']->id
            )
            ->assertJsonPath(
                'records.data.0.diagnosis.name',
                'TEST ONLY - Diagnosis'
            )
            ->assertJsonPath(
                'records.data.0.prescription.status',
                'issued'
            )
            ->assertJsonPath(
                'records.data.0.prescription.medications.0.medicine',
                'TEST ONLY - Medicine'
            );
    }

    public function test_patient_cannot_view_another_patients_records(): void
    {
        $own = $this->createRecord();
        $other = $this->createRecord();

        Sanctum::actingAs($own['user']);

        $this->getJson(
            '/api/patient/medical-records?patient_id=' .
            $other['patient']->id
        )
            ->assertOk()
            ->assertJsonCount(1, 'records.data')
            ->assertJsonPath('patient.id', $own['patient']->id)
            ->assertJsonPath(
                'records.data.0.consultation_id',
                $own['consultation']->id
            )
            ->assertJsonPath('records.total', 1);
    }

    public function test_draft_consultations_are_hidden(): void
    {
        $record = $this->createRecord([
            'consultation_status' => 'draft',
            'prescription_status' => 'draft',
        ]);

        Sanctum::actingAs($record['user']);

        $this->getJson('/api/patient/medical-records')
            ->assertOk()
            ->assertJsonCount(0, 'records.data');
    }

    public function test_unreviewed_diagnosis_and_draft_prescription_are_hidden(): void
    {
        $record = $this->createRecord([
            'reviewed' => false,
            'prescription_status' => 'draft',
        ]);

        Sanctum::actingAs($record['user']);

        $this->getJson('/api/patient/medical-records')
            ->assertOk()
            ->assertJsonCount(1, 'records.data')
            ->assertJsonPath('records.data.0.diagnosis', null)
            ->assertJsonPath('records.data.0.prescription', null);
    }

    public function test_internal_doctor_notes_are_not_exposed(): void
    {
        $record = $this->createRecord();

        Sanctum::actingAs($record['user']);

        $this->getJson('/api/patient/medical-records')
            ->assertOk()
            ->assertJsonMissingPath('records.data.0.soap_notes')
            ->assertDontSee('PRIVATE SOAP SUBJECTIVE TEST')
            ->assertDontSee('PRIVATE SOAP OBJECTIVE TEST')
            ->assertDontSee('PRIVATE DOCTOR DIAGNOSIS NOTES');
    }

    public function test_patient_without_linked_profile_gets_404(): void
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patient/medical-records')
            ->assertNotFound();
    }

    public function test_staff_and_doctor_cannot_access_patient_records_endpoint(): void
    {
        foreach (['staff', 'doctor'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'status' => 'active',
            ]);

            Sanctum::actingAs($user);

            $this->getJson('/api/patient/medical-records')
                ->assertForbidden();
        }
    }

    public function test_unauthenticated_request_is_denied(): void
    {
        $this->getJson('/api/patient/medical-records')
            ->assertUnauthorized();
    }
}
