<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConsultationValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_incomplete_soap_notes_prevent_consultation_completion(): void
    {
        // Confirm isolated test database.
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $today = now('Asia/Manila')->toDateString();

        // Synthetic doctor account.
        $doctor = User::factory()->create([
            'role' => 'doctor',
        ]);

        // Synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-SOAP',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-SOAP',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Queue currently in consultation.
        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-TEST-SOAP',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'in_consultation',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
        ]);

        // Incomplete SOAP draft: Plan is missing.
        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'draft',
            'subjective' => 'TEST ONLY - Subjective',
            'objective' => 'TEST ONLY - Objective',
            'assessment' => 'TEST ONLY - Assessment',
            'plan' => null,
        ]);

        // Diagnosis is reviewed, isolating the SOAP validation.
        DB::table('diagnoses')->insert([
            'consultation_id' => $consultation->id,
            'name' => 'TEST ONLY - Synthetic Diagnosis',
            'reviewed' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs($doctor);

        // Attempt to complete an incomplete consultation.
        $response = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/complete",
            ['confirm_completion' => true]
        );

        // Expect validation to reject the missing Plan.
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['plan']);

        // Nothing should be completed.
        $this->assertDatabaseHas('consultations', [
            'id' => $consultation->id,
            'status' => 'draft',
            'completed_at' => null,
        ]);

        $this->assertDatabaseHas('queue_entries', [
            'id' => $queue->id,
            'status' => 'in_consultation',
            'completed_at' => null,
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'checked_in',
        ]);
    }

public function test_unreviewed_diagnosis_prevents_consultation_completion(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic doctor.
    $doctor = User::factory()->create([
        'role' => 'doctor',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-DIAGNOSIS',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Checked-in appointment.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-DIAGNOSIS',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'appointment_date' => $today,
        'appointment_time' => '09:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Queue in consultation.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $doctor->id,
        'queue_number' => 'Q-TEST-DIAGNOSIS',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'in_consultation',
        'queued_at' => now(),
        'called_at' => now(),
        'consultation_started_at' => now(),
    ]);

    // All SOAP fields are complete.
    $consultation = Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'draft',
        'subjective' => 'TEST ONLY - Subjective',
        'objective' => 'TEST ONLY - Objective',
        'assessment' => 'TEST ONLY - Assessment',
        'plan' => 'TEST ONLY - Plan',
    ]);

    // Diagnosis exists but has NOT been reviewed.
    DB::table('diagnoses')->insert([
        'consultation_id' => $consultation->id,
        'name' => 'TEST ONLY - Synthetic Diagnosis',
        'reviewed' => false,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs($doctor);

    // Attempt consultation completion.
    $response = $this->postJson(
        "/api/doctor/consultations/{$queue->id}/complete",
        ['confirm_completion' => true]
    );

    // Unreviewed diagnosis must be rejected.
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['diagnosis']);

    // All database records must remain unchanged.
    $this->assertDatabaseHas('consultations', [
        'id' => $consultation->id,
        'status' => 'draft',
        'completed_at' => null,
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'status' => 'in_consultation',
        'completed_at' => null,
    ]);

    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);
}

public function test_another_doctor_cannot_complete_assigned_consultation(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $today = now('Asia/Manila')->toDateString();

    // Doctor A owns the consultation.
    $assignedDoctor = User::factory()->create([
        'role' => 'doctor',
    ]);

    // Doctor B must not access Doctor A's consultation.
    $otherDoctor = User::factory()->create([
        'role' => 'doctor',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-AUTH',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Appointment assigned to Doctor A.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-AUTH',
        'patient_id' => $patientId,
        'doctor_id' => $assignedDoctor->id,
        'created_by' => $assignedDoctor->id,
        'appointment_date' => $today,
        'appointment_time' => '09:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Queue assigned to Doctor A.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $assignedDoctor->id,
        'created_by' => $assignedDoctor->id,
        'queue_number' => 'Q-TEST-AUTH',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'in_consultation',
        'queued_at' => now(),
        'called_at' => now(),
        'consultation_started_at' => now(),
    ]);

    // Complete SOAP draft belonging to Doctor A.
    $consultation = Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $assignedDoctor->id,
        'status' => 'draft',
        'subjective' => 'TEST ONLY - Subjective',
        'objective' => 'TEST ONLY - Objective',
        'assessment' => 'TEST ONLY - Assessment',
        'plan' => 'TEST ONLY - Plan',
    ]);

    // Reviewed diagnosis.
    DB::table('diagnoses')->insert([
        'consultation_id' => $consultation->id,
        'name' => 'TEST ONLY - Synthetic Diagnosis',
        'reviewed' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Authenticate as Doctor B, not Doctor A.
    Sanctum::actingAs($otherDoctor);

    // Doctor B attempts to complete Doctor A's consultation.
    $response = $this->postJson(
        "/api/doctor/consultations/{$queue->id}/complete",
        ['confirm_completion' => true]
    );

    // The controller should hide unassigned queue entries.
    $response->assertNotFound();

    // Consultation must remain unchanged.
    $this->assertDatabaseHas('consultations', [
        'id' => $consultation->id,
        'doctor_id' => $assignedDoctor->id,
        'status' => 'draft',
        'completed_at' => null,
    ]);

    // Queue must remain unchanged.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'status' => 'in_consultation',
        'completed_at' => null,
    ]);

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);
}

}
