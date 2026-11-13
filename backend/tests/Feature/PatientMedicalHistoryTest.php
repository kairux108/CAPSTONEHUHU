<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientMedicalHistoryTest extends TestCase
{
    use RefreshDatabase;

    private function createHistoryFixture(
        string $consultationStatus = 'completed',
        string $prescriptionStatus = 'issued',
        bool $hasCurrentAssignment = true
    ): array {
        // Ensure all tests use isolated SQLite.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $today = now('Asia/Manila')->toDateString();

        $yesterday = now('Asia/Manila')
            ->subDay()
            ->toDateString();

        // Synthetic doctor.
        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        // Synthetic patient.
        $patient = Patient::create([
            'patient_number' => 'PT-TEST-HISTORY',
            'first_name' => 'Synthetic',
            'last_name' => 'HistoryPatient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);

        // Current appointment authorizes the doctor
        // to view this patient's history today.
        if ($hasCurrentAssignment) {
            Appointment::create([
                'appointment_number' => 'APT-HISTORY-TODAY',
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'created_by' => $doctor->id,
                'appointment_date' => $today,
                'appointment_time' => '10:00:00',
                'appointment_type' => 'walk_in',
                'status' => 'scheduled',
            ]);
        }

        // Historical completed appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-HISTORY-PAST',
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $yesterday,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'completed',
            'checked_in_at' => now()->subDay(),
        ]);

        // Historical queue entry.
        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-TEST-HISTORY',
            'queue_date' => $yesterday,
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now()->subDay(),
            'called_at' => now()->subDay(),
            'consultation_started_at' => now()->subDay(),
            'completed_at' => now()->subDay(),
        ]);

        // Historical consultation.
        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => $consultationStatus,
            'subjective' => 'TEST ONLY - Subjective',
            'objective' => 'TEST ONLY - Objective',
            'assessment' => 'TEST ONLY - Assessment',
            'plan' => 'TEST ONLY - Plan',
            'care_instructions' => 'TEST ONLY - Care instructions',
            'follow_up_instructions' => 'TEST ONLY - Follow up',
            'completed_at' =>
                $consultationStatus === 'completed'
                    ? now()->subDay()
                    : null,
        ]);

        // Synthetic reviewed diagnosis.
        DB::table('diagnoses')->insert([
            'consultation_id' => $consultation->id,
            'name' => 'TEST ONLY - Diagnosis',
            'notes' => 'Synthetic diagnosis',
            'reviewed' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Prescription belonging to the consultation.
        $prescription = Prescription::create([
            'consultation_id' => $consultation->id,
            'status' => $prescriptionStatus,
            'issued_at' =>
                $prescriptionStatus === 'issued'
                    ? now()->subDay()
                    : null,
        ]);

        if ($prescriptionStatus === 'issued') {
            $prescription->issued_by = $doctor->id;
            $prescription->save();
        }

        // Synthetic medicine.
        $prescription->items()->create([
            'medicine' => 'TEST ONLY - Medicine',
            'strength' => '10 mg',
            'dosage' => '1 tablet',
            'frequency' => 'Once daily',
            'duration_days' => 5,
            'duration' => '5 days',
            'instructions' => 'TEST ONLY',
        ]);

        return compact(
            'doctor',
            'patient',
            'appointment',
            'queue',
            'consultation',
            'prescription'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Test 1 - Authorized Doctor Can View History
    |--------------------------------------------------------------------------
    */

    public function test_assigned_doctor_can_view_completed_medical_history(): void
    {
        $fixture = $this->createHistoryFixture();

        Sanctum::actingAs($fixture['doctor']);

        $response = $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        );

        $response->assertOk();

        $response->assertJsonPath(
            'patient.id',
            $fixture['patient']->id
        );

        $response->assertJsonCount(
            1,
            'history.data'
        );

        $response->assertJsonPath(
            'history.data.0.consultation_id',
            $fixture['consultation']->id
        );

        $response->assertJsonPath(
            'history.data.0.diagnosis.name',
            'TEST ONLY - Diagnosis'
        );

        $response->assertJsonPath(
            'history.data.0.prescription.status',
            'issued'
        );

        $response->assertJsonPath(
            'history.data.0.prescription.items.0.medicine',
            'TEST ONLY - Medicine'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Test 2 - Unrelated Doctor Cannot View History
    |--------------------------------------------------------------------------
    */

    public function test_unrelated_doctor_cannot_view_patient_history(): void
    {
        $fixture = $this->createHistoryFixture();

        $anotherDoctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        Sanctum::actingAs($anotherDoctor);

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Test 3 - Staff and Patients Are Not Authorized
    |--------------------------------------------------------------------------
    */

    public function test_staff_and_patients_cannot_use_doctor_history_endpoint(): void
    {
        $fixture = $this->createHistoryFixture();

        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        Sanctum::actingAs($staff);

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertForbidden();

        $patientUser = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        Sanctum::actingAs($patientUser);

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertForbidden();
    }

    /*
    |--------------------------------------------------------------------------
    | Test 4 - Draft Consultations Are Excluded
    |--------------------------------------------------------------------------
    */

    public function test_draft_consultations_are_not_included_in_history(): void
    {
        $fixture = $this->createHistoryFixture(
            consultationStatus: 'draft'
        );

        Sanctum::actingAs($fixture['doctor']);

        $response = $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        );

        $response->assertOk();

        $response->assertJsonCount(
            0,
            'history.data'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Test 5 - Unissued Prescriptions Are Hidden
    |--------------------------------------------------------------------------
    */

    public function test_unissued_prescriptions_are_not_exposed(): void
    {
        $fixture = $this->createHistoryFixture(
            prescriptionStatus: 'draft'
        );

        Sanctum::actingAs($fixture['doctor']);

        $response = $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        );

        $response->assertOk();

        $response->assertJsonCount(
            1,
            'history.data'
        );

        $response->assertJsonPath(
            'history.data.0.prescription',
            null
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Test 6 - Current Assignment Is Required
    |--------------------------------------------------------------------------
    */

    public function test_past_assignment_alone_does_not_grant_current_access(): void
    {
        $fixture = $this->createHistoryFixture(
            hasCurrentAssignment: false
        );

        Sanctum::actingAs($fixture['doctor']);

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Test 7 - Inactive Doctor Is Rejected
    |--------------------------------------------------------------------------
    */

    public function test_inactive_doctor_cannot_view_medical_history(): void
    {
        $fixture = $this->createHistoryFixture();

        $fixture['doctor']->update([
            'status' => 'inactive',
        ]);

        Sanctum::actingAs($fixture['doctor']);

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertForbidden();
    }

    /*
    |--------------------------------------------------------------------------
    | Test 8 - Authentication Is Required
    |--------------------------------------------------------------------------
    */

    public function test_unauthenticated_request_cannot_view_history(): void
    {
        $fixture = $this->createHistoryFixture();

        $this->getJson(
            "/api/doctor/patients/{$fixture['patient']->id}/medical-history"
        )->assertUnauthorized();
    }
}
