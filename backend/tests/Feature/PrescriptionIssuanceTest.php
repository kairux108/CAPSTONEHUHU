<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Prescription;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PrescriptionIssuanceTest extends TestCase
{
    use RefreshDatabase;

    private function createCompletedConsultationWithPrescription(): array
    {
        // Verify that tests use SQLite in-memory.
        $this->assertSame('sqlite', config('database.default'));

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $today = now('Asia/Manila')->toDateString();

        // Create a synthetic doctor.
        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        // Create a synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-PRESCRIPTION',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a completed appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-PRESCRIPTION',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'completed',
            'checked_in_at' => now(),
        ]);

        // Create a completed queue entry.
        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-TEST-PRESCRIPTION',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
            'completed_at' => now(),
        ]);

        // Create a completed consultation.
        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'completed',
            'subjective' => 'TEST ONLY - Subjective',
            'objective' => 'TEST ONLY - Objective',
            'assessment' => 'TEST ONLY - Assessment',
            'plan' => 'TEST ONLY - Plan',
            'completed_at' => now(),
        ]);

        // Create an unissued prescription draft.
        $prescription = Prescription::create([
            'consultation_id' => $consultation->id,
            'status' => 'draft',
        ]);

        // Add a synthetic medicine item.
        $prescription->items()->create([
            'medicine' => 'TEST ONLY - Medicine',
            'strength' => '10 mg',
            'dosage' => '1 tablet',
            'frequency' => 'once daily',
            'duration_days' => 5,
            'duration' => '5 days',
            'instructions' => 'TEST ONLY - Not medical advice',
        ]);

        return compact(
            'doctor',
            'appointment',
            'queue',
            'consultation',
            'prescription'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Test 1: Assigned Doctor Can Issue Prescription
    |--------------------------------------------------------------------------
    */

    public function test_assigned_doctor_can_issue_prescription_after_consultation_completion(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        Sanctum::actingAs($fixture['doctor']);

        $response = $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            ['confirm_issue' => true]
        );

        $response->assertOk();

        $response->assertJsonPath(
            'prescription.status',
            'issued'
        );




        $response->assertJsonPath(
            'prescription.issued_by',
            $fixture['doctor']->id
        );

        $response->assertJsonCount(
            1,
            'prescription.items'
        );

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'consultation_id' => $fixture['consultation']->id,
            'status' => 'issued',
            'issued_by' => $fixture['doctor']->id,
        ]);

        $this->assertNotNull(
            $fixture['prescription']->fresh()->issued_at
        );

        $this->assertDatabaseCount('prescription_items', 1);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 2: Consultation Must Be Completed
    |--------------------------------------------------------------------------
    */

    public function test_prescription_cannot_be_issued_before_consultation_completion(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        $fixture['consultation']->update([
            'status' => 'draft',
            'completed_at' => null,
        ]);

        Sanctum::actingAs($fixture['doctor']);

        $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            ['confirm_issue' => true]
        )->assertStatus(409);

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'status' => 'draft',
            'issued_by' => null,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 3: Another Doctor Cannot Issue Prescription
    |--------------------------------------------------------------------------
    */

    public function test_another_doctor_cannot_issue_assigned_doctors_prescription(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        $anotherDoctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        Sanctum::actingAs($anotherDoctor);

        $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            ['confirm_issue' => true]
        )->assertForbidden();

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'status' => 'draft',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 4: Staff Cannot Issue Prescription
    |--------------------------------------------------------------------------
    */

    public function test_staff_cannot_issue_prescription(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        Sanctum::actingAs($staff);

        $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            ['confirm_issue' => true]
        )->assertForbidden();

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'status' => 'draft',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 5: Prevent Duplicate Prescription Issuance
    |--------------------------------------------------------------------------
    */

    public function test_issued_prescription_cannot_be_issued_again(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        Sanctum::actingAs($fixture['doctor']);

        $url = "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue";

        $this->postJson(
            $url,
            ['confirm_issue' => true]
        )->assertOk();

        $this->postJson(
            $url,
            ['confirm_issue' => true]
        )->assertStatus(409);

        $this->assertDatabaseCount('prescriptions', 1);

        $this->assertDatabaseCount('prescription_items', 1);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 6: Prescription Must Contain Medicine
    |--------------------------------------------------------------------------
    */

    public function test_prescription_without_medicine_cannot_be_issued(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        $fixture['prescription']->items()->delete();

        Sanctum::actingAs($fixture['doctor']);

        $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            ['confirm_issue' => true]
        )->assertStatus(422);

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'status' => 'draft',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Test 7: Explicit Doctor Confirmation Required
    |--------------------------------------------------------------------------
    */

    public function test_prescription_issuance_requires_explicit_confirmation(): void
    {
        $fixture = $this->createCompletedConsultationWithPrescription();

        Sanctum::actingAs($fixture['doctor']);

        $this->postJson(
            "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
            []
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors('confirm_issue');

        $this->assertDatabaseHas('prescriptions', [
            'id' => $fixture['prescription']->id,
            'status' => 'draft',
        ]);
    }

/*
|--------------------------------------------------------------------------
| Test 8: Prescription Issuance Preserves Medication Schedule
|--------------------------------------------------------------------------
*/

public function test_issuing_prescription_preserves_medication_schedule(): void
{
    // Create a completed consultation with a draft prescription.
    $fixture = $this->createCompletedConsultationWithPrescription();

    // Retrieve the existing synthetic medication item.
    $item = $fixture['prescription']
        ->items()
        ->firstOrFail();

    // Add doctor-specified scheduling information.
    $item->update([
        'schedule_type' => 'fixed',
        'as_needed' => false,
        'administration_times' => [
            '08:00',
            '20:00',
        ],
        'meal_relation' => 'after',
        'timing_instructions' =>
            'TEST ONLY - Medication scheduling verification.',
    ]);

    $originalItemId = $item->id;

    // Authenticate as the assigned doctor.
    Sanctum::actingAs($fixture['doctor']);

    // Issue the prescription through the actual API.
    $response = $this->postJson(
        "/api/doctor/consultations/{$fixture['queue']->id}/prescription/issue",
        ['confirm_issue' => true]
    );

    $response->assertOk();

    $response->assertJsonPath(
        'prescription.status',
        'issued'
    );

        // Verify scheduling information reaches the frontend API.
        $response->assertJsonPath(
            'prescription.items.0.schedule_type',
            'fixed'
        );

        $response->assertJsonPath(
            'prescription.items.0.administration_times',
            ['08:00', '20:00']
        );

        $response->assertJsonPath(
            'prescription.items.0.as_needed',
            false
        );

        $response->assertJsonPath(
            'prescription.items.0.meal_relation',
            'after'
        );

        $response->assertJsonPath(
            'prescription.items.0.timing_instructions',
            'TEST ONLY - Medication scheduling verification.'
        );


    // Reload the medication from the database.
    $savedItem = $item->fresh();

    $this->assertNotNull($savedItem);

    // Issuance must preserve the original item record.
    $this->assertSame(
        $originalItemId,
        $savedItem->id
    );

    // Medication scheduling fields must remain unchanged.
    $this->assertSame(
        'fixed',
        $savedItem->schedule_type
    );

    $this->assertSame(
        ['08:00', '20:00'],
        $savedItem->administration_times
    );

    $this->assertFalse(
        $savedItem->as_needed
    );

    $this->assertSame(
        'after',
        $savedItem->meal_relation
    );

    $this->assertSame(
        'TEST ONLY - Medication scheduling verification.',
        $savedItem->timing_instructions
    );

    // Issuance must not duplicate the medication.
    $this->assertDatabaseCount(
        'prescription_items',
        1
    );
}

}
