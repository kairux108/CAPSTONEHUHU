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

class ConsultationCompletionSuccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_completion_updates_all_three_records(): void
    {
        // Confirm the isolated SQLite test database.
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
            'patient_number' => 'PT-TEST-SUCCESS',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-SUCCESS',
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
            'queue_number' => 'Q-TEST-SUCCESS',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'in_consultation',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
        ]);

        // Complete synthetic SOAP draft.
        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'draft',
            'subjective' => 'TEST ONLY - Subjective',
            'objective' => 'TEST ONLY - Objective',
            'assessment' => 'TEST ONLY - Assessment',
            'plan' => 'TEST ONLY - Plan',
        ]);

        // Reviewed synthetic diagnosis.
        DB::table('diagnoses')->insert([
            'consultation_id' => $consultation->id,
            'name' => 'TEST ONLY - Synthetic Diagnosis',
            'reviewed' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Authenticate as the assigned doctor.
        Sanctum::actingAs($doctor);

        // Complete the consultation through Laravel API.
        $response = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/complete",
            ['confirm_completion' => true]
        );

        // Verify successful API response.
        $response->assertOk();

        $response->assertJsonPath(
            'consultation.status',
            'completed'
        );

        $response->assertJsonPath(
            'queue_entry.status',
            'completed'
        );

        $response->assertJsonPath(
            'appointment.status',
            'completed'
        );

        // Verify records were saved.
        $this->assertDatabaseHas('consultations', [
            'id' => $consultation->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('queue_entries', [
            'id' => $queue->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'completed',
        ]);

        // Verify completion timestamps.
        $this->assertNotNull(
            $consultation->fresh()->completed_at
        );

        $this->assertNotNull(
            $queue->fresh()->completed_at
        );
    }
}
