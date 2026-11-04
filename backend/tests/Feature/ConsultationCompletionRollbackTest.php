<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\QueueEntry;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class ConsultationCompletionRollbackTest extends TestCase
{
    use RefreshDatabase;

    public function test_failed_appointment_completion_rolls_back_all_records(): void
    {
        // Use only the isolated SQLite testing database.
        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $today = now('Asia/Manila')->toDateString();

        // Create a synthetic doctor.
        $doctor = User::factory()->create([
            'role' => 'doctor',
        ]);

        // Create a synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-ROLLBACK',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-ROLLBACK',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Create a queue entry in consultation.
        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-TEST-ROLLBACK',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'in_consultation',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
        ]);

        // Create a complete synthetic SOAP draft.
        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'draft',
            'subjective' => 'TEST ONLY - Subjective',
            'objective' => 'TEST ONLY - Objective',
            'assessment' => 'TEST ONLY - Assessment',
            'plan' => 'TEST ONLY - Plan',
        ]);

        // Create a reviewed synthetic diagnosis.
        DB::table('diagnoses')->insert([
            'consultation_id' => $consultation->id,
            'name' => 'TEST ONLY - Synthetic Diagnosis',
            'reviewed' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Simulate an appointment service failure.
        $mock = Mockery::mock(AppointmentService::class);

        $mock->shouldReceive('complete')
            ->once()
            ->andThrow(
                new RuntimeException(
                    'Simulated appointment completion failure.'
                )
            );

        $this->app->instance(
            AppointmentService::class,
            $mock
        );

        // Authenticate as the synthetic doctor.
        Sanctum::actingAs($doctor);

        // Attempt to complete the consultation.
        $response = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/complete",
            [
                'confirm_completion' => true,
            ]
        );

        // The simulated failure should reject completion.
        $response->assertStatus(500);

        // Verify the transaction rolled back.
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
}
