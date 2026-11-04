<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\QueueEntry;
use App\Models\User;
use App\Services\QueueRecommendationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;



class QueueManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_check_in_patient_and_add_to_queue(): void
    {
        // Ensure isolated SQLite testing.
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        // Freeze time at noon in Manila to avoid
        // timezone differences around midnight.
        $this->travelTo(
            now('Asia/Manila')->setTime(12, 0, 0)
        );

        $today = now('Asia/Manila')->toDateString();

        // Synthetic staff account.
        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        // Synthetic doctor account.
        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        // Synthetic patient record.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-QUEUE',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Appointment scheduled for today.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-QUEUE',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => '10:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'scheduled',
        ]);

        // Authenticate as staff.
        Sanctum::actingAs($staff);

        // STEP 1: Check in the patient.
        $checkInResponse = $this->patchJson(
            "/api/appointments/{$appointment->id}/check-in"
        );

        $checkInResponse->assertOk();

        $checkInResponse->assertJsonPath(
            'appointment.status',
            'checked_in'
        );

        $this->assertNotNull(
            $appointment->fresh()->checked_in_at
        );

        // Check-in alone does not create a queue entry.
        $this->assertDatabaseCount('queue_entries', 0);

        // STEP 2: Add the checked-in patient to the queue.
        $queueResponse = $this->postJson(
            '/api/queue',
            [
                'appointment_id' => $appointment->id,
                'priority' => 'normal',
            ]
        );

        $queueResponse->assertStatus(201);

        $queueResponse->assertJsonPath(
            'queue_entry.status',
            'waiting'
        );

        $queueResponse->assertJsonPath(
            'queue_entry.appointment_id',
            $appointment->id
        );

        // Verify exactly one queue entry was created.
        $this->assertDatabaseCount('queue_entries', 1);

        $queue = QueueEntry::query()->firstOrFail();

        // Verify assigned doctor and staff member.
        $this->assertSame(
            $doctor->id,
            (int) $queue->doctor_id
        );

        $this->assertSame(
            $staff->id,
            (int) $queue->created_by
        );

        // Verify queue date and number.
        $this->assertSame(
            $today,
            $queue->queue_date->toDateString()
        );

        $this->assertMatchesRegularExpression(
            '/^Q-\d{8}-\d{3}$/',
            $queue->queue_number
        );

        // Verify queue timestamp.
        $this->assertNotNull($queue->queued_at);

        // Appointment must remain checked in.
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'checked_in',
        ]);

        $this->travelBack();
    }

public function test_staff_cannot_add_same_appointment_to_queue_twice(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Create synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create a synthetic patient record.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-DUPLICATE-QUEUE',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Appointment is already checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-DUPLICATE-QUEUE',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    Sanctum::actingAs($staff);

    $queueData = [
        'appointment_id' => $appointment->id,
        'priority' => 'normal',
    ];

    // First attempt should succeed.
    $firstResponse = $this->postJson(
        '/api/queue',
        $queueData
    );

    $firstResponse->assertCreated();

    $firstResponse->assertJsonPath(
        'queue_entry.status',
        'waiting'
    );

    $this->assertDatabaseCount('queue_entries', 1);

    $originalQueue = QueueEntry::query()->sole();

    // Second attempt uses the same appointment.
    $secondResponse = $this->postJson(
        '/api/queue',
        $queueData
    );

    // Duplicate queue entry must be rejected.
    $secondResponse->assertStatus(422);

    $secondResponse->assertJsonValidationErrors([
        'appointment_id',
    ]);

    // Still exactly one queue entry.
    $this->assertDatabaseCount('queue_entries', 1);

    // Original queue entry must remain unchanged.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $originalQueue->id,
        'appointment_id' => $appointment->id,
        'status' => 'waiting',
    ]);

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    $this->travelBack();
}

public function test_staff_can_call_waiting_patient(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-CALL-QUEUE',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Patient already checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-CALL-QUEUE',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient is currently waiting.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-CALL-001',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => now(),
    ]);

    // Authenticate as staff.
    Sanctum::actingAs($staff);

    // Staff calls the waiting patient.
    $response = $this->patchJson(
        "/api/queue/{$queue->id}",
        [
            'status' => 'called',
        ]
    );

    // Verify successful response.
    $response->assertOk();

    $response->assertJsonPath(
        'queue_entry.status',
        'called'
    );

    // Verify queue status changed.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'status' => 'called',
    ]);

    // Verify call timestamp was recorded.
    $this->assertNotNull(
        $queue->fresh()->called_at
    );

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    // Queue entry count remains one.
    $this->assertDatabaseCount('queue_entries', 1);

    $this->travelBack();
}

public function test_staff_cannot_complete_waiting_queue(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Use a fixed time of day for consistent testing.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-INVALID-QUEUE',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Patient appointment is checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-INVALID-QUEUE',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Queue is still waiting.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-INVALID-001',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => now(),
    ]);

    Sanctum::actingAs($staff);

    // Staff attempts to skip consultation and complete queue.
    $response = $this->patchJson(
        "/api/queue/{$queue->id}",
        [
            'status' => 'completed',
        ]
    );

    // Invalid transition must be rejected.
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['status']);

    // Queue must remain waiting.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'status' => 'waiting',
        'completed_at' => null,
    ]);

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    // No new queue entries created.
    $this->assertDatabaseCount('queue_entries', 1);

    $this->travelBack();
}

public function test_staff_cannot_bypass_doctor_consultation_completion(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-STAFF-BYPASS',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Patient appointment is checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-STAFF-BYPASS',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Doctor has already started consultation.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-STAFF-BYPASS',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'in_consultation',
        'queued_at' => now(),
        'called_at' => now(),
        'consultation_started_at' => now(),
    ]);

    // Consultation is still a draft.
    $consultation = \App\Models\Consultation::create([
        'queue_entry_id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'draft',
        'subjective' => 'TEST ONLY - Subjective',
        'objective' => 'TEST ONLY - Objective',
        'assessment' => 'TEST ONLY - Assessment',
        'plan' => 'TEST ONLY - Plan',
    ]);

    // Authenticate as staff, not the doctor.
    Sanctum::actingAs($staff);

    // Staff attempts to complete the queue directly.
    $response = $this->patchJson(
        "/api/queue/{$queue->id}",
        ['status' => 'completed']
    );

    // Staff must not bypass doctor completion.
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['status']);

    // All three records must remain unchanged.
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

public function test_assigned_doctor_can_start_called_queue(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Create synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create a synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-DOCTOR-START',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Appointment already checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-DOCTOR-START',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Staff has already called the patient.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-DOCTOR-START',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'called',
        'queued_at' => now(),
        'called_at' => now(),
    ]);

    // Authenticate as the assigned doctor.
    Sanctum::actingAs($doctor);

    // Doctor starts consultation using the real API.
    $response = $this->postJson(
        "/api/doctor/consultations/{$queue->id}/start"
    );

    // Verify successful response.
    $response->assertOk();

    $response->assertJsonPath(
        'queue_entry.status',
        'in_consultation'
    );

    // Verify database state.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'doctor_id' => $doctor->id,
        'status' => 'in_consultation',
    ]);

    // Consultation start timestamp must be recorded.
    $this->assertNotNull(
        $queue->fresh()->consultation_started_at
    );

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    // Queue count remains one.
    $this->assertDatabaseCount('queue_entries', 1);

    $this->travelBack();
}

public function test_staff_cannot_bypass_doctor_consultation_start(): void
{
    // Verify isolated SQLite database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Use a consistent time in Manila.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Create synthetic staff and doctor accounts.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-STAFF-START',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Create checked-in appointment.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-STAFF-START',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient has been called, but doctor
    // has NOT started the consultation.
    $queue = QueueEntry::create([
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-STAFF-START',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'called',
        'queued_at' => now(),
        'called_at' => now(),
        'consultation_started_at' => null,
    ]);

    // Authenticate as staff.
    Sanctum::actingAs($staff);

    // Staff attempts to start a consultation directly.
    $response = $this->patchJson(
        "/api/queue/{$queue->id}",
        [
            'status' => 'in_consultation',
        ]
    );

    // Only the doctor's start API should allow this.
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['status']);

    // Queue must remain called.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queue->id,
        'status' => 'called',
        'consultation_started_at' => null,
    ]);

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    // No additional queue entries.
    $this->assertDatabaseCount('queue_entries', 1);

    $this->travelBack();
}

public function test_emergency_queue_requires_priority_reason(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Use a consistent Manila date.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Synthetic patient.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-EMERGENCY',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Checked-in appointment.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-EMERGENCY',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    Sanctum::actingAs($staff);

    // Staff attempts emergency queue creation
    // without explaining the emergency.
    $response = $this->postJson('/api/queue', [
        'appointment_id' => $appointment->id,
        'priority' => 'emergency',
    ]);

    // CURA must reject the request.
    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'priority_reason',
    ]);

    // No queue entry must be created.
    $this->assertDatabaseCount('queue_entries', 0);

    // Appointment stays checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    $this->travelBack();
}

public function test_staff_can_create_emergency_queue_with_reason(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Keep the test date consistent.
    $this->travelTo(
        now('Asia/Manila')->setTime(12, 0, 0)
    );

    $today = now('Asia/Manila')->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Synthetic patient record.
    $patientId = DB::table('patients')->insertGetId([
        'patient_number' => 'PT-TEST-VALID-EMERGENCY',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Appointment has already been checked in.
    $appointment = Appointment::create([
        'appointment_number' => 'APT-TEST-VALID-EMERGENCY',
        'patient_id' => $patientId,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '10:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Authenticate as staff.
    Sanctum::actingAs($staff);

    $reason = 'TEST ONLY - Immediate medical attention required';

    // Create emergency queue with a documented reason.
    $response = $this->postJson('/api/queue', [
        'appointment_id' => $appointment->id,
        'priority' => 'emergency',
        'priority_reason' => $reason,
    ]);

    // Verify successful queue creation.
    $response->assertStatus(201);

    $response->assertJsonPath(
        'queue_entry.priority',
        'emergency'
    );

    $response->assertJsonPath(
        'queue_entry.priority_reason',
        $reason
    );

    $response->assertJsonPath(
        'queue_entry.status',
        'waiting'
    );

    // Verify emergency queue data was saved.
    $this->assertDatabaseHas('queue_entries', [
        'appointment_id' => $appointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'priority' => 'emergency',
        'priority_reason' => $reason,
        'status' => 'waiting',
    ]);

    // Only one queue entry should exist.
    $this->assertDatabaseCount('queue_entries', 1);

    $queue = QueueEntry::query()->sole();

    // Verify queue number and creation timestamp.
    $this->assertMatchesRegularExpression(
        '/^Q-\d{8}-\d{3}$/',
        $queue->queue_number
    );

    $this->assertNotNull($queue->queued_at);

    // Appointment must remain checked in.
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'checked_in',
    ]);

    $this->travelBack();
}

public function test_emergency_patient_is_recommended_before_due_online_appointment(): void
{
    // Use only the isolated SQLite test database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze the test clock at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patients.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-RECOMMEND-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A: emergency walk-in.
    $emergencyAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-EMERGENCY-REC',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:30:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B: normal online appointment due now.
    $onlineAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-ONLINE-REC',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '12:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Emergency patient is waiting.
    $emergencyQueue = QueueEntry::create([
        'appointment_id' => $emergencyAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-EMERGENCY-REC',
        'queue_date' => $today,
        'priority' => 'emergency',
        'priority_reason' => 'TEST ONLY - Urgent medical attention',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(20),
    ]);

    // Normal online patient is also waiting.
    QueueEntry::create([
        'appointment_id' => $onlineAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-ONLINE-REC',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(10),
    ]);

    // Ask CURA which patient should be next.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Expected policy: emergency takes precedence.
    $this->assertSame(
        $emergencyQueue->id,
        $recommendation['queue_entry']->id
    );
}

public function test_due_online_appointment_is_recommended_before_normal_walk_in(): void
{
    // Verify isolated test database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patients.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-ONLINE-WINDOW-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A: normal walk-in.
    $walkInAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-WINDOW-WALKIN',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B: online appointment due at noon.
    $onlineAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-WINDOW-ONLINE',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '12:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Walk-in patient has been waiting longer.
    QueueEntry::create([
        'appointment_id' => $walkInAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-WINDOW-WALKIN',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(30),
    ]);

    // Online patient arrived at 11:55 AM.
    $onlineQueue = QueueEntry::create([
        'appointment_id' => $onlineAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-WINDOW-ONLINE',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(5),
    ]);

    // Request the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Online appointment should receive protected priority.
    $this->assertSame(
        $onlineQueue->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'scheduled_due',
        $recommendation['type']
    );

    // Noon appointment window starts at 11:50 AM.
    $this->assertSame(
        '11:50:00',
        $recommendation['protected_window_start']
    );

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_longest_waiting_walk_in_is_recommended_when_online_not_due(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patients.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-WALKIN-REC-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A: walk-in who arrived earlier.
    $walkInAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-WALKIN-REC',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:00:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B: online appointment at 1 PM.
    $onlineAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-FUTURE-ONLINE',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '13:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Walk-in entered queue at 11:30 AM.
    $walkInQueue = QueueEntry::create([
        'appointment_id' => $walkInAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-WALKIN-REC',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(30),
    ]);

    // Online patient entered queue at 11:45 AM.
    QueueEntry::create([
        'appointment_id' => $onlineAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-FUTURE-ONLINE',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(15),
    ]);

    // Get CURA's recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Walk-in should be recommended.
    $this->assertSame(
        $walkInQueue->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'walk_in_waiting',
        $recommendation['type']
    );

    // Both patients remain in the queue.
    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_earliest_online_appointment_is_recommended_when_only_online_patients_wait(): void
{
    // Verify the isolated SQLite test database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Create synthetic staff and doctor accounts.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patients.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-ONLINE-ONLY-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A has the later appointment at 3 PM.
    $laterAppointment = Appointment::create([
        'appointment_number' => 'APT-ONLINE-LATER',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '15:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B has the earlier appointment at 2 PM.
    $earlierAppointment = Appointment::create([
        'appointment_number' => 'APT-ONLINE-EARLIER',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '14:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient A entered the queue first.
    QueueEntry::create([
        'appointment_id' => $laterAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-ONLINE-LATER',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(60),
    ]);

    // Patient B entered later but has an earlier appointment.
    $earlierQueue = QueueEntry::create([
        'appointment_id' => $earlierAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-ONLINE-EARLIER',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(30),
    ]);

    // Ask CURA for the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // The earlier scheduled appointment must be recommended.
    $this->assertSame(
        $earlierQueue->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'online_only',
        $recommendation['type']
    );

    $this->assertSame(
        '14:00:00',
        $recommendation['appointment_time']
    );

    // Both patients must remain waiting.
    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_priority_patient_is_recommended_before_due_online_appointment(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor accounts.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patients.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-PRIORITY-REC-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A: staff-flagged priority walk-in.
    $priorityAppointment = Appointment::create([
        'appointment_number' => 'APT-PRIORITY-REC',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:30:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B: normal online appointment due at noon.
    $onlineAppointment = Appointment::create([
        'appointment_number' => 'APT-PRIORITY-ONLINE-REC',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '12:00:00',
        'appointment_type' => 'online',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Staff-flagged priority patient is waiting.
    $priorityQueue = QueueEntry::create([
        'appointment_id' => $priorityAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-PRIORITY-REC',
        'queue_date' => $today,
        'priority' => 'priority',
        'priority_reason' => 'TEST ONLY - Priority assistance',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(20),
    ]);

    // Normal online patient is also waiting.
    QueueEntry::create([
        'appointment_id' => $onlineAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-PRIORITY-ONLINE-REC',
        'queue_date' => $today,
        'priority' => 'normal',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(10),
    ]);

    // Get CURA's recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Priority patient should be recommended first.
    $this->assertSame(
        $priorityQueue->id,
        $recommendation['queue_entry']->id
    );

    // Database records should remain unchanged.
    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_emergency_patient_is_recommended_before_priority_patient(): void
{
    // Confirm the isolated SQLite test database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two synthetic patient records.
    $patientIds = [];

    foreach ([1, 2] as $number) {
        $patientIds[] = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-EMERG-PRIOR-' . $number,
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . $number,
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Patient A: regular priority appointment.
    $priorityAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-PRIOR-ORDER',
        'patient_id' => $patientIds[0],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:30:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Patient B: emergency appointment.
    $emergencyAppointment = Appointment::create([
        'appointment_number' => 'APT-TEST-EMERG-ORDER',
        'patient_id' => $patientIds[1],
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'appointment_date' => $today,
        'appointment_time' => '11:55:00',
        'appointment_type' => 'walk_in',
        'status' => 'checked_in',
        'checked_in_at' => now(),
    ]);

    // Priority patient arrived earlier.
    $priorityQueue = QueueEntry::create([
        'appointment_id' => $priorityAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-PRIOR-ORDER',
        'queue_date' => $today,
        'priority' => 'priority',
        'priority_reason' => 'TEST ONLY - Priority assistance',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(30),
    ]);

    // Emergency patient arrived later.
    $emergencyQueue = QueueEntry::create([
        'appointment_id' => $emergencyAppointment->id,
        'doctor_id' => $doctor->id,
        'created_by' => $staff->id,
        'queue_number' => 'Q-TEST-EMERG-ORDER',
        'queue_date' => $today,
        'priority' => 'emergency',
        'priority_reason' => 'TEST ONLY - Urgent assessment',
        'status' => 'waiting',
        'queued_at' => $now->copy()->subMinutes(5),
    ]);

    // Ask CURA for the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Emergency must take precedence.
    $this->assertSame(
        $emergencyQueue->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'emergency_priority',
        $recommendation['type']
    );

    // Recommendation must not modify queue records.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $priorityQueue->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $emergencyQueue->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}


public function test_queue_recommendation_returns_null_when_queue_is_empty(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Confirm that the queue is empty.
    $this->assertDatabaseCount('queue_entries', 0);

    // Request CURA's next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended('2026-11-10');

    // An empty queue must return no recommendation.
    $this->assertNull($recommendation);

    // No queue entry should be created.
    $this->assertDatabaseCount('queue_entries', 0);
}

public function test_longest_waiting_emergency_patient_is_recommended_first(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    // Create the newer emergency first to ensure
    // recommendations are based on waiting time,
    // not database insertion order.
    foreach ([
        ['label' => 'NEWER', 'minutes' => 5],
        ['label' => 'OLDER', 'minutes' => 30],
    ] as $index => $case) {

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-EMERG-ORDER-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Emergency Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' => 'APT-EMERG-ORDER-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => '11:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' => 'Q-EMERG-ORDER-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'emergency',
            'priority_reason' => 'TEST ONLY - Urgent assessment',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['minutes']),
        ]);
    }

    // Ask CURA for the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // The emergency patient who arrived earlier wins.
    $this->assertSame(
        $queues['OLDER']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'emergency_priority',
        $recommendation['type']
    );

    // Both patients must remain waiting.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['NEWER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['OLDER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_longest_waiting_priority_patient_is_recommended_first(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    // Insert newer patient first to verify that
    // queue arrival time determines the recommendation.
    foreach ([
        ['label' => 'NEWER', 'minutes' => 5],
        ['label' => 'OLDER', 'minutes' => 30],
    ] as $case) {

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' =>
                'PT-PRIORITY-ORDER-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Priority Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-PRIORITY-ORDER-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => '11:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-PRIORITY-ORDER-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'priority',
            'priority_reason' =>
                'TEST ONLY - Priority assistance',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['minutes']),
        ]);
    }

    // Ask CURA for the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // The longest-waiting priority patient comes first.
    $this->assertSame(
        $queues['OLDER']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'priority_patient',
        $recommendation['type']
    );

    // Recommendation does not modify queue records.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['NEWER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['OLDER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_called_emergency_patient_is_excluded_from_recommendations(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Synthetic staff and doctor accounts.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'EMERGENCY',
            'priority' => 'emergency',
            'status' => 'called',
            'minutes' => 30,
        ],
        [
            'label' => 'NORMAL',
            'priority' => 'normal',
            'status' => 'waiting',
            'minutes' => 15,
        ],
    ] as $case) {

        // Synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-EXCLUDE-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-EXCLUDE-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => '11:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Queue entry.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' => 'Q-EXCLUDE-' . $case['label'],
            'queue_date' => $today,
            'priority' => $case['priority'],
            'priority_reason' =>
                $case['priority'] === 'emergency'
                    ? 'TEST ONLY - Emergency'
                    : null,
            'status' => $case['status'],
            'queued_at' => $now->copy()
                ->subMinutes($case['minutes']),
            'called_at' =>
                $case['status'] === 'called'
                    ? $now->copy()->subMinutes(5)
                    : null,
        ]);
    }

    // Ask CURA for the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Only the waiting patient should be selected.
    $this->assertSame(
        $queues['NORMAL']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'walk_in_waiting',
        $recommendation['type']
    );

    // The called emergency patient remains called.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['EMERGENCY']->id,
        'status' => 'called',
    ]);

    // The normal patient remains waiting.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['NORMAL']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_expired_online_protection_does_not_override_waiting_walk_in(): void
{
    // Use only the isolated SQLite testing database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'ONLINE',
            'type' => 'online',
            'time' => '11:30:00',
            'waiting_minutes' => 40,
        ],
        [
            'label' => 'WALKIN',
            'type' => 'walk_in',
            'time' => '11:50:00',
            'waiting_minutes' => 10,
        ],
    ] as $case) {

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-EXPIRED-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-EXPIRED-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => $case['time'],
            'appointment_type' => $case['type'],
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-EXPIRED-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['waiting_minutes']),
        ]);
    }

    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Online protection ended at 11:45 AM.
    // The normal walk-in should now be recommended.
    $this->assertSame(
        $queues['WALKIN']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'walk_in_waiting',
        $recommendation['type']
    );

    // Neither queue entry should be modified.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['ONLINE']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['WALKIN']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_early_online_appointment_does_not_override_waiting_walk_in(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'ONLINE',
            'type' => 'online',
            'time' => '12:30:00',
            'waiting_minutes' => 5,
        ],
        [
            'label' => 'WALKIN',
            'type' => 'walk_in',
            'time' => '11:50:00',
            'waiting_minutes' => 10,
        ],
    ] as $case) {

        // Create synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-EARLY-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-EARLY-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => $case['time'],
            'appointment_type' => $case['type'],
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Add patient to waiting queue.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' => 'Q-EARLY-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['waiting_minutes']),
        ]);
    }

    // Request the next recommended patient.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Online appointment protection begins at 12:20 PM.
    // At noon, the walk-in should be recommended.
    $this->assertSame(
        $queues['WALKIN']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'walk_in_waiting',
        $recommendation['type']
    );

    // Recommendation must not modify either entry.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['ONLINE']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['WALKIN']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_online_appointment_is_protected_exactly_ten_minutes_early(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();

    // Create synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'WALKIN',
            'type' => 'walk_in',
            'time' => '11:45:00',
            'waiting_minutes' => 30,
        ],
        [
            'label' => 'ONLINE',
            'type' => 'online',
            'time' => '12:10:00',
            'waiting_minutes' => 5,
        ],
    ] as $case) {

        // Synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-BOUNDARY-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-BOUNDARY-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => $case['time'],
            'appointment_type' => $case['type'],
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Waiting queue entry.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-BOUNDARY-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['waiting_minutes']),
        ]);
    }

    // Request CURA's recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // At exactly 12:00 PM, the 12:10 PM
    // online appointment enters its protected window.
    $this->assertSame(
        $queues['ONLINE']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'scheduled_due',
        $recommendation['type']
    );

    // Recommendation must not modify queue statuses.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['ONLINE']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['WALKIN']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_online_appointment_is_protected_exactly_fifteen_minutes_late(): void
{
    // Confirm the isolated test database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    // Synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'WALKIN',
            'type' => 'walk_in',
            'time' => '11:20:00',
            'waiting_minutes' => 40,
        ],
        [
            'label' => 'ONLINE',
            'type' => 'online',
            'time' => '11:45:00',
            'waiting_minutes' => 30,
        ],
    ] as $case) {

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-LATE-BOUND-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-LATE-BOUND-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => $case['time'],
            'appointment_type' => $case['type'],
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-LATE-BOUND-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['waiting_minutes']),
        ]);
    }

    // Request CURA's recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Appointment time: 11:45 AM.
    // Protection ends exactly at 12:00 PM.
    $this->assertSame(
        $queues['ONLINE']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'scheduled_due',
        $recommendation['type']
    );

    // Recommendations must not modify queue entries.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['ONLINE']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['WALKIN']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}


public function test_previous_day_emergency_does_not_override_todays_waiting_patient(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);

    $today = $now->toDateString();
    $yesterday = $now->copy()->subDay()->toDateString();

    // Create synthetic staff and doctor.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'YESTERDAY',
            'date' => $yesterday,
            'priority' => 'emergency',
            'minutes' => 1470,
        ],
        [
            'label' => 'TODAY',
            'date' => $today,
            'priority' => 'normal',
            'minutes' => 10,
        ],
    ] as $case) {

        // Create synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-DATE-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' => 'APT-DATE-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $case['date'],
            'appointment_time' => '11:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => $now->copy()
                ->subMinutes($case['minutes']),
        ]);

        // Create queue entry.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' => 'Q-DATE-' . $case['label'],
            'queue_date' => $case['date'],
            'priority' => $case['priority'],
            'priority_reason' =>
                $case['priority'] === 'emergency'
                    ? 'TEST ONLY - Emergency assessment'
                    : null,
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['minutes']),
        ]);
    }

    // Request recommendation for today only.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Today's waiting patient must be recommended.
    $this->assertSame(
        $queues['TODAY']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'walk_in_waiting',
        $recommendation['type']
    );

    // Verify neither queue status was modified.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['YESTERDAY']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['TODAY']->id,
        'status' => 'waiting',
    ]);

    // FIX: Normalize SQLite date/datetime values
    // before checking the actual queue dates.
    $this->assertSame(
        $yesterday,
        Carbon::parse(
            $queues['YESTERDAY']->fresh()->queue_date
        )->toDateString()
    );

    $this->assertSame(
        $today,
        Carbon::parse(
            $queues['TODAY']->fresh()->queue_date
        )->toDateString()
    );

    // Recommendation must not create or delete entries.
    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_earliest_due_online_appointment_is_recommended_first(): void
{
    // Verify isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    // Insert the later appointment first.
    // This ensures insertion order cannot
    // accidentally satisfy the test.
    foreach ([
        [
            'label' => 'LATER',
            'time' => '12:05:00',
            'waiting_minutes' => 40,
        ],
        [
            'label' => 'EARLIER',
            'time' => '11:55:00',
            'waiting_minutes' => 5,
        ],
    ] as $case) {

        // Synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-DUE-ORDER-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Online appointment.
        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-DUE-ORDER-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => $case['time'],
            'appointment_type' => 'online',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Waiting queue entry.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-DUE-ORDER-' . $case['label'],
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'waiting',
            'queued_at' => $now->copy()
                ->subMinutes($case['waiting_minutes']),
        ]);
    }

    // Request CURA's recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Both online appointments are due.
    // The earlier scheduled appointment
    // should be recommended first.
    $this->assertSame(
        $queues['EARLIER']->id,
        $recommendation['queue_entry']->id
    );

    $this->assertSame(
        'scheduled_due',
        $recommendation['type']
    );

    // Recommendation must not change either queue.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['LATER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['EARLIER']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

public function test_cancelled_emergency_patient_does_not_override_waiting_priority_patient(): void
{
    // Confirm isolated SQLite testing.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    // Freeze time at noon in Manila.
    $now = Carbon::parse(
        '2026-11-10 12:00:00',
        'Asia/Manila'
    );

    $this->travelTo($now);
    $today = $now->toDateString();

    // Create synthetic staff and doctor accounts.
    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $queues = [];

    foreach ([
        [
            'label' => 'EMERGENCY',
            'priority' => 'emergency',
            'status' => 'cancelled',
            'minutes' => 30,
        ],
        [
            'label' => 'PRIORITY',
            'priority' => 'priority',
            'status' => 'waiting',
            'minutes' => 10,
        ],
    ] as $case) {

        // Create synthetic patient.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' =>
                'PT-CANCEL-TEST-' . $case['label'],
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create checked-in appointment.
        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-CANCEL-TEST-' . $case['label'],
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => $today,
            'appointment_time' => '11:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        // Create queue entry with its current status.
        $queues[$case['label']] = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' =>
                'Q-CANCEL-TEST-' . $case['label'],
            'queue_date' => $today,
            'priority' => $case['priority'],
            'priority_reason' =>
                'TEST ONLY - Staff priority classification',
            'status' => $case['status'],
            'queued_at' => $now->copy()
                ->subMinutes($case['minutes']),
        ]);
    }

    // Request CURA's next recommendation.
    $recommendation = app(
        QueueRecommendationService::class
    )->getNextRecommended($today);

    $this->assertNotNull($recommendation);

    // Cancelled emergency entry must be excluded.
    $this->assertSame(
        $queues['PRIORITY']->id,
        $recommendation['queue_entry']->id
    );

    // The active priority patient should be selected.
    $this->assertSame(
        'priority_patient',
        $recommendation['type']
    );

    // Verify the queue statuses remain unchanged.
    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['EMERGENCY']->id,
        'status' => 'cancelled',
    ]);

    $this->assertDatabaseHas('queue_entries', [
        'id' => $queues['PRIORITY']->id,
        'status' => 'waiting',
    ]);

    $this->assertDatabaseCount('queue_entries', 2);

    $this->travelBack();
}

}