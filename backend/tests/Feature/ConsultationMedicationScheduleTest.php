<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\PrescriptionItem;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConsultationMedicationScheduleTest extends TestCase
{
    use RefreshDatabase;

    private function createDraftEndpoint(): string
    {
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $doctor = User::factory()->create([
            'role' => 'doctor',
        ]);

        $today = now('Asia/Manila')->toDateString();

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-SCHEDULE-TEST',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' => 'APT-SCHEDULE-TEST',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-SCHEDULE-TEST',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'in_consultation',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
        ]);

        Sanctum::actingAs($doctor);

        return "/api/doctor/consultations/{$queue->id}/draft";
    }

    public function test_fixed_times_are_saved(): void
    {
        $url = $this->createDraftEndpoint();

        $this->putJson($url, [
            'prescription_items' => [
                [
                    'medicine' => 'TEST ONLY - Medicine A',
                    'frequency' => 'Twice daily',
                    'schedule_type' => 'fixed',
                    'as_needed' => false,
                    'administration_times' => [
                        '08:00',
                        '20:00',
                    ],
                ],
            ],
        ])->assertOk();

        $item = PrescriptionItem::firstOrFail();

        $this->assertSame('fixed', $item->schedule_type);
        $this->assertSame(
            ['08:00', '20:00'],
            $item->administration_times
        );
        $this->assertFalse($item->as_needed);
    }

    public function test_prn_custom_instructions_are_saved(): void
    {
        $url = $this->createDraftEndpoint();

        $this->putJson($url, [
            'prescription_items' => [
                [
                    'medicine' => 'TEST ONLY - Medicine B',
                    'schedule_type' => 'custom',
                    'as_needed' => true,
                    'timing_instructions' =>
                        'TEST ONLY - Follow the doctor instructions.',
                ],
            ],
        ])->assertOk();

        $item = PrescriptionItem::firstOrFail();

        $this->assertTrue($item->as_needed);
        $this->assertSame(
            'custom',
            $item->schedule_type
        );
        $this->assertSame(
            'TEST ONLY - Follow the doctor instructions.',
            $item->timing_instructions
        );
    }

    public function test_invalid_administration_time_is_rejected(): void
    {
        $url = $this->createDraftEndpoint();

        $this->putJson($url, [
            'prescription_items' => [
                [
                    'medicine' => 'TEST ONLY - Medicine C',
                    'schedule_type' => 'fixed',
                    'administration_times' => [
                        '25:99',
                    ],
                ],
            ],
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'prescription_items.0.administration_times.0',
            ]);

        $this->assertDatabaseCount('prescription_items', 0);
    }

public function test_missing_schedule_details_are_rejected(): void
{
    $url = $this->createDraftEndpoint();

    $cases = [
        [
            'type' => 'fixed',
            'errors' => [
                'prescription_items.0.administration_times',
            ],
        ],
        [
            'type' => 'interval',
            'errors' => [
                'prescription_items.0.interval_hours',
                'prescription_items.0.interval_scope',
            ],
        ],
        [
            'type' => 'meal',
            'errors' => [
                'prescription_items.0.meal_relation',
            ],
        ],
        [
            'type' => 'custom',
            'errors' => [
                'prescription_items.0.timing_instructions',
            ],
        ],
    ];

    foreach ($cases as $case) {
        $response = $this->putJson($url, [
            'prescription_items' => [
                [
                    'medicine' => 'TEST ONLY - Medicine',
                    'schedule_type' => $case['type'],
                ],
            ],
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors($case['errors']);
    }

    $this->assertDatabaseCount('prescription_items', 0);
}

public function test_fixed_schedule_rejects_interval_fields(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'fixed',
                'administration_times' => [
                    '08:00',
                    '20:00',
                ],
                'interval_hours' => 4,
            ],
        ],
    ]);

    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'prescription_items.0.interval_hours',
    ]);

    $this->assertDatabaseCount('prescription_items', 0);
}

public function test_fixed_schedule_rejects_interval_scope(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'fixed',
                'administration_times' => [
                    '08:00',
                    '20:00',
                ],
                'interval_scope' => 'while_awake',
            ],
        ],
    ]);

    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'prescription_items.0.interval_scope',
    ]);

    $this->assertDatabaseCount('prescription_items', 0);
}

public function test_interval_schedule_rejects_fixed_times(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'interval',
                'interval_hours' => 8,
                'interval_scope' => 'around_clock',
                'administration_times' => [
                    '08:00',
                    '20:00',
                ],
            ],
        ],
    ]);

    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'prescription_items.0.administration_times',
    ]);

    $this->assertDatabaseCount('prescription_items', 0);
}

public function test_valid_interval_schedule_is_saved(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'interval',
                'as_needed' => false,
                'interval_hours' => 8,
                'interval_scope' => 'around_clock',
            ],
        ],
    ]);

    $response->assertOk();

    $item = PrescriptionItem::firstOrFail();

    $this->assertSame('interval', $item->schedule_type);
    $this->assertSame(8, $item->interval_hours);
    $this->assertSame(
        'around_clock',
        $item->interval_scope
    );
    $this->assertNull($item->administration_times);
}

public function test_valid_meal_schedule_is_saved(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'meal',
                'as_needed' => false,
                'meal_relation' => 'after',
                'timing_instructions' =>
                    'TEST ONLY - Follow doctor instructions.',
            ],
        ],
    ]);

    $response->assertOk();

    $item = PrescriptionItem::firstOrFail();

    $this->assertSame(
        'meal',
        $item->schedule_type
    );

    $this->assertSame(
        'after',
        $item->meal_relation
    );

    $this->assertFalse($item->as_needed);

    $this->assertNull($item->administration_times);
    $this->assertNull($item->interval_hours);
    $this->assertNull($item->interval_scope);
}

public function test_prn_rejects_recurring_interval_schedule(): void
{
    $url = $this->createDraftEndpoint();

    $response = $this->putJson($url, [
        'prescription_items' => [
            [
                'medicine' => 'TEST ONLY - Medicine',
                'schedule_type' => 'interval',
                'as_needed' => true,
                'interval_hours' => 4,
                'interval_scope' => 'while_awake',
                'timing_instructions' =>
                    'TEST ONLY - Use only when needed.',
            ],
        ],
    ]);

    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'prescription_items.0.schedule_type',
    ]);

    $this->assertDatabaseCount('prescription_items', 0);
}

}