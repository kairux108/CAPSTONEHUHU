<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\QueueEntry;
use App\Models\User;
use App\Services\QueueRecommendationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DoctorQueueRecommendationFilterTest extends TestCase
{
    use RefreshDatabase;

    private int $sequence = 0;

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_doctor_only_receives_their_own_recommended_patient(): void
    {
        $this->assertIsolatedDatabase();
        $this->freezeQueueTime();

        $doctorA = $this->makeDoctor();
        $doctorB = $this->makeDoctor();

        $own = $this->makeWaitingEntry($doctorA, $doctorA, 'normal', 'walk_in', 40);
        $otherEmergency = $this->makeWaitingEntry($doctorB, $doctorB, 'emergency', 'walk_in', 10);

        $service = app(QueueRecommendationService::class);
        $date = now('Asia/Manila')->toDateString();

        $this->assertSame(
            $own->id,
            $service->getNextRecommended($date, $doctorA->id)['queue_entry']->id
        );
        $this->assertSame(
            $otherEmergency->id,
            $service->getNextRecommended($date)['queue_entry']->id
        );
    }

    public function test_doctor_filter_excludes_entries_whose_appointment_belongs_to_another_doctor(): void
    {
        $this->assertIsolatedDatabase();
        $this->freezeQueueTime();

        $doctorA = $this->makeDoctor();
        $doctorB = $this->makeDoctor();

        $mismatched = $this->makeWaitingEntry($doctorA, $doctorB, 'emergency', 'walk_in', 30);
        $own = $this->makeWaitingEntry($doctorA, $doctorA, 'normal', 'walk_in', 10);

        $service = app(QueueRecommendationService::class);
        $recommendation = $service->getNextRecommended(now('Asia/Manila')->toDateString(), $doctorA->id);

        $this->assertNotNull($recommendation);
        $this->assertSame($own->id, $recommendation['queue_entry']->id);
        $this->assertNotSame($mismatched->id, $recommendation['queue_entry']->id);
    }

    public function test_due_online_appointment_is_recommended_before_earlier_normal_walk_in(): void
    {
        $this->assertIsolatedDatabase();
        $this->freezeQueueTime();

        $doctor = $this->makeDoctor();
        $walkIn = $this->makeWaitingEntry($doctor, $doctor, 'normal', 'walk_in', 30);
        $online = $this->makeWaitingEntry($doctor, $doctor, 'normal', 'online', 10);

        $recommendation = app(QueueRecommendationService::class)
            ->getNextRecommended(now('Asia/Manila')->toDateString(), $doctor->id);

        $this->assertNotNull($recommendation);
        $this->assertSame($online->id, $recommendation['queue_entry']->id);
        $this->assertNotSame($walkIn->id, $recommendation['queue_entry']->id);
    }

    private function assertIsolatedDatabase(): void
    {
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
    }

    private function freezeQueueTime(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-12 09:00:00', 'Asia/Manila'));
    }

    private function makeDoctor(): User
    {
        return User::factory()->create(['role' => 'doctor', 'status' => 'active']);
    }

    private function makeWaitingEntry(
        User $queueDoctor,
        User $appointmentDoctor,
        string $priority,
        string $appointmentType,
        int $minutesAgo
    ): QueueEntry {
        $number = ++$this->sequence;
        $staff = User::factory()->create(['role' => 'staff', 'status' => 'active']);

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => sprintf('PT-TEST-RECOMMEND-%04d', $number),
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' => sprintf('APT-TEST-RECOMMEND-%04d', $number),
            'patient_id' => $patientId,
            'doctor_id' => $appointmentDoctor->id,
            'created_by' => $staff->id,
            'appointment_date' => now('Asia/Manila')->toDateString(),
            'appointment_time' => '09:00:00',
            'appointment_type' => $appointmentType,
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $queueDoctor->id,
            'created_by' => $staff->id,
            'queue_number' => sprintf('Q-TEST-RECOMMEND-%04d', $number),
            'queue_date' => now('Asia/Manila')->toDateString(),
            'priority' => $priority,
            'priority_reason' => $priority === 'normal' ? null : 'Synthetic test priority',
            'status' => 'waiting',
            'queued_at' => now()->subMinutes($minutesAgo),
        ]);
    }
}
