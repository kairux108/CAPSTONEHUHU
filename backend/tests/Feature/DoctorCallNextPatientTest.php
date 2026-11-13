<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Carbon\Carbon;

class DoctorCallNextPatientTest extends TestCase
{
    use RefreshDatabase;

    private static int $sequence = 0;

    public function test_doctor_calls_emergency_before_priority_and_normal(): void
    {
        $this->assertIsolatedTestDatabase();

        $doctor = $this->makeDoctor();
        $normal = $this->makeQueueEntry($doctor, 'normal', 'waiting', 60);
        $priority = $this->makeQueueEntry($doctor, 'priority', 'waiting', 40);
        $emergency = $this->makeQueueEntry($doctor, 'emergency', 'waiting', 10);

        Sanctum::actingAs($doctor);

        $response = $this->postJson('/api/doctor/queue/call-next');

        $response->assertOk()
            ->assertJsonPath('queue_entry.id', $emergency->id)
            ->assertJsonPath('queue_entry.status', 'called');

        $this->assertDatabaseHas('queue_entries', [
            'id' => $normal->id,
            'status' => 'waiting',
        ]);
        $this->assertDatabaseHas('queue_entries', [
            'id' => $priority->id,
            'status' => 'waiting',
        ]);
        $this->assertDatabaseHas('queue_entries', [
            'id' => $emergency->id,
            'status' => 'called',
        ]);
        $this->assertNotNull($emergency->fresh()->called_at);
    }

    public function test_doctor_calls_earliest_arrival_within_same_priority(): void
    {
        $this->assertIsolatedTestDatabase();

        $doctor = $this->makeDoctor();
        $later = $this->makeQueueEntry($doctor, 'normal', 'waiting', 5);
        $earlier = $this->makeQueueEntry($doctor, 'normal', 'waiting', 35);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertOk()
            ->assertJsonPath('queue_entry.id', $earlier->id);

        $this->assertSame('waiting', $later->fresh()->status);
        $this->assertSame('called', $earlier->fresh()->status);
    }

    public function test_second_call_is_blocked_while_first_patient_is_called(): void
    {
        $this->assertIsolatedTestDatabase();

        $doctor = $this->makeDoctor();
        $first = $this->makeQueueEntry($doctor, 'normal', 'waiting', 20);
        $second = $this->makeQueueEntry($doctor, 'normal', 'waiting', 10);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertOk()
            ->assertJsonPath('queue_entry.id', $first->id);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertStatus(409);

        $this->assertSame('called', $first->fresh()->status);
        $this->assertSame('waiting', $second->fresh()->status);
    }

    public function test_call_is_blocked_while_a_patient_is_in_consultation(): void
    {
        $this->assertIsolatedTestDatabase();

        $doctor = $this->makeDoctor();
        $active = $this->makeQueueEntry($doctor, 'normal', 'in_consultation', 30);
        $waiting = $this->makeQueueEntry($doctor, 'normal', 'waiting', 10);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertStatus(409);

        $this->assertSame('in_consultation', $active->fresh()->status);
        $this->assertSame('waiting', $waiting->fresh()->status);
    }

    public function test_doctor_cannot_call_another_doctors_patient(): void
    {
        $this->assertIsolatedTestDatabase();

        $doctor = $this->makeDoctor();
        $otherDoctor = $this->makeDoctor();
        $otherPatient = $this->makeQueueEntry($otherDoctor);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertStatus(409);

        $this->assertSame('waiting', $otherPatient->fresh()->status);
    }

    public function test_staff_cannot_use_doctor_call_next_endpoint(): void
    {
        $this->assertIsolatedTestDatabase();

        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);
        $waiting = $this->makeQueueEntry($this->makeDoctor());

        Sanctum::actingAs($staff);

        $this->postJson('/api/doctor/queue/call-next')
            ->assertForbidden();

        $this->assertSame('waiting', $waiting->fresh()->status);
    }

    public function test_unauthenticated_call_is_rejected(): void
    {
        $this->assertIsolatedTestDatabase();

        $this->postJson('/api/doctor/queue/call-next')
            ->assertUnauthorized();
    }

    public function test_no_waiting_patients_returns_conflict(): void
    {
        $this->assertIsolatedTestDatabase();

        Sanctum::actingAs($this->makeDoctor());

        $this->postJson('/api/doctor/queue/call-next')
            ->assertStatus(409);
    }

public function test_staff_cannot_call_another_patient_while_one_is_already_called(): void
{
    $this->assertIsolatedTestDatabase();

    $doctor = $this->makeDoctor();

    $called = $this->makeQueueEntry(
        $doctor, 'normal', 'called', 30
    );

    $waiting = $this->makeQueueEntry(
        $doctor, 'normal', 'waiting', 10
    );

    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    Sanctum::actingAs($staff);

    $this->patchJson(
        "/api/queue/{$waiting->id}",
        ['status' => 'called']
    )
        ->assertStatus(422)
        ->assertJsonValidationErrors(['status']);

    $this->assertSame('called', $called->fresh()->status);
    $this->assertSame('waiting', $waiting->fresh()->status);
}

public function test_staff_cannot_call_patient_during_active_consultation(): void
{
    $this->assertIsolatedTestDatabase();

    $doctor = $this->makeDoctor();

    $active = $this->makeQueueEntry(
        $doctor, 'normal', 'in_consultation', 30
    );

    $waiting = $this->makeQueueEntry(
        $doctor, 'normal', 'waiting', 10
    );

    $staff = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    Sanctum::actingAs($staff);

    $this->patchJson(
        "/api/queue/{$waiting->id}",
        ['status' => 'called']
    )
        ->assertStatus(422)
        ->assertJsonValidationErrors(['status']);

    $this->assertSame(
        'in_consultation',
        $active->fresh()->status
    );

    $this->assertSame(
        'waiting',
        $waiting->fresh()->status
    );
}


    private function assertIsolatedTestDatabase(): void
    {
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
    }

    private function makeDoctor(): User
    {
        return User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);
    }

    private function makeQueueEntry(
        User $doctor,
        string $priority = 'normal',
        string $status = 'waiting',
        int $minutesAgo = 15
    ): QueueEntry {
        $number = ++self::$sequence;

        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => sprintf('PT-TEST-CALL-%04d', $number),
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' => sprintf('APT-TEST-CALL-%04d', $number),
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => now('Asia/Manila')->toDateString(),
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'queue_number' => sprintf('Q-TEST-CALL-%04d', $number),
            'queue_date' => now('Asia/Manila')->toDateString(),
            'priority' => $priority,
            'priority_reason' => $priority === 'normal'
                ? null
                : 'Synthetic priority for feature test',
            'status' => $status,
            'queued_at' => now()->subMinutes($minutesAgo),
        ]);
    }

public function test_doctor_calls_due_online_appointment_before_earlier_walk_in(): void
{
    $this->assertIsolatedTestDatabase();

    // Simulate 9:00 AM in the Philippines.
    $this->travelTo(
        Carbon::parse('2026-11-12 09:00:00', 'Asia/Manila')
    );

    try {
        $doctor = $this->makeDoctor();

        // Walk-in arrived 45 minutes earlier.
        $walkIn = $this->makeQueueEntry(
            $doctor,
            'normal',
            'waiting',
            45
        );

        // Online patient arrived only 5 minutes earlier.
        $online = $this->makeQueueEntry(
            $doctor,
            'normal',
            'waiting',
            5
        );

        // Give the second patient a due online appointment.
        DB::table('appointments')
            ->where('id', $online->appointment_id)
            ->update([
                'appointment_type' => 'online',
                'appointment_time' => '09:00:00',
            ]);

        Sanctum::actingAs($doctor);

        // Doctor calls the next recommended patient.
        $response = $this->postJson(
            '/api/doctor/queue/call-next'
        );

        // The due online patient should be called.
        $response->assertOk()
            ->assertJsonPath('queue_entry.id', $online->id)
            ->assertJsonPath('queue_entry.status', 'called');

        // Earlier walk-in remains waiting.
        $this->assertSame(
            'waiting',
            $walkIn->fresh()->status
        );

        // Due online appointment is called.
        $this->assertSame(
            'called',
            $online->fresh()->status
        );

        $this->assertNotNull(
            $online->fresh()->called_at
        );
    } finally {
        // Restore the normal clock after testing.
        $this->travelBack();
    }
}

}
