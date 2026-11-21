<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\MedicationDoseLog;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientMedicationDoseApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Never run these tests against development PostgreSQL.
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    public function test_unauthenticated_user_cannot_record_dose(): void
    {
        $this->postJson('/api/patient/medication-doses', [
            'prescription_item_id' => 1,
            'request_id' => (string) Str::uuid(),
            'taken_at' => now()->toIso8601String(),
        ])->assertUnauthorized();
    }

    public function test_patient_can_record_own_issued_medication(): void
    {
        $fixture = $this->createIssuedMedication();

        Sanctum::actingAs($fixture['user']);

        $requestId = (string) Str::uuid();

        $response = $this->postJson(
            '/api/patient/medication-doses',
            [
                'prescription_item_id' => $fixture['item']->id,
                'request_id' => $requestId,
                'taken_at' => now()->toIso8601String(),
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'dose_log.prescription_item_id',
                $fixture['item']->id
            );

        $this->assertDatabaseHas('medication_dose_logs', [
            'patient_id' => $fixture['patient']->id,
            'prescription_item_id' => $fixture['item']->id,
            'recorded_by_user_id' => $fixture['user']->id,
            'request_id' => $requestId,
        ]);
    }

    public function test_patient_cannot_record_another_patients_dose(): void
    {
        $fixture = $this->createIssuedMedication();

        $otherUser = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        $this->createPatient($otherUser);

        Sanctum::actingAs($otherUser);

        $this->postJson(
            '/api/patient/medication-doses',
            [
                'prescription_item_id' => $fixture['item']->id,
                'request_id' => (string) Str::uuid(),
                'taken_at' => now()->toIso8601String(),
            ]
        )->assertNotFound();

        $this->assertDatabaseCount('medication_dose_logs', 0);
    }

    public function test_retry_does_not_create_duplicate_record(): void
    {
        $fixture = $this->createIssuedMedication();

        Sanctum::actingAs($fixture['user']);

        $payload = [
            'prescription_item_id' => $fixture['item']->id,
            'request_id' => (string) Str::uuid(),
            'taken_at' => now()->toIso8601String(),
        ];

        $first = $this->postJson(
            '/api/patient/medication-doses',
            $payload
        );

        $first->assertCreated();

        $second = $this->postJson(
            '/api/patient/medication-doses',
            $payload
        );

        $second
            ->assertOk()
            ->assertJsonPath(
                'dose_log.id',
                $first->json('dose_log.id')
            );

        $this->assertDatabaseCount('medication_dose_logs', 1);
    }

public function test_same_request_id_with_different_time_is_rejected(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    $requestId = (string) Str::uuid();

    $payload = [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => $requestId,
        'taken_at' => now()->subMinutes(2)->toIso8601String(),
    ];

    // First confirmation should be accepted.
    $this->postJson(
        '/api/patient/medication-doses',
        $payload
    )->assertCreated();

    // Reuse the same UUID with a different timestamp.
    $this->postJson(
        '/api/patient/medication-doses',
        array_merge($payload, [
            'taken_at' => now()->subMinute()->toIso8601String(),
        ])
    )
        ->assertStatus(409)
        ->assertJsonPath(
            'message',
            'This confirmation identifier has already been used.'
        );

    // The original record must remain the only record.
    $this->assertDatabaseCount('medication_dose_logs', 1);

    $this->assertDatabaseHas('medication_dose_logs', [
        'patient_id' => $fixture['patient']->id,
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => $requestId,
    ]);
}

public function test_patient_cannot_record_draft_prescription_dose(): void
{
    $fixture = $this->createIssuedMedication();

    // Change the existing prescription back to draft.
    $fixture['item']->prescription()->update([
        'status' => 'draft',
        'issued_at' => null,
    ]);

    Sanctum::actingAs($fixture['user']);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->toIso8601String(),
    ])->assertNotFound();

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_patient_cannot_record_dose_from_incomplete_consultation(): void
{
    $fixture = $this->createIssuedMedication();

    // Simulate an incomplete consultation.
    $prescription = $fixture['item']->prescription;

    $prescription->consultation()->update([
        'status' => 'draft',
        'completed_at' => null,
    ]);

    Sanctum::actingAs($fixture['user']);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->toIso8601String(),
    ])->assertNotFound();

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_non_patient_roles_cannot_record_medication_doses(): void
{
    $fixture = $this->createIssuedMedication();

    foreach (['doctor', 'staff', 'admin'] as $role) {
        $user = User::factory()->create([
            'role' => $role,
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/patient/medication-doses', [
            'prescription_item_id' => $fixture['item']->id,
            'request_id' => (string) Str::uuid(),
            'taken_at' => now()->toIso8601String(),
        ])->assertForbidden();
    }

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_patient_cannot_record_future_dose(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->addMinutes(10)->toIso8601String(),
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['taken_at']);

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_patient_cannot_record_dose_before_prescription_issuance(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->subHours(2)->toIso8601String(),
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['taken_at']);

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_patient_without_linked_profile_cannot_record_dose(): void
{
    $fixture = $this->createIssuedMedication();

    $userWithoutProfile = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    Sanctum::actingAs($userWithoutProfile);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->toIso8601String(),
    ])->assertNotFound();

    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_patient_can_record_prn_medication_without_scheduled_time(): void
{
    $fixture = $this->createIssuedMedication();

    // Simulate a doctor-issued as-needed prescription.
    $fixture['item']->update([
        'as_needed' => true,
        'schedule_type' => 'custom',
        'administration_times' => null,
    ]);

    Sanctum::actingAs($fixture['user']);

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => now()->toIso8601String(),
    ])
        ->assertCreated()
        ->assertJsonPath('dose_log.scheduled_for', null);

    $this->assertDatabaseCount('medication_dose_logs', 1);
}

public function test_unauthenticated_user_cannot_view_dose_history(): void
{
    $this->getJson('/api/patient/medication-doses')
        ->assertUnauthorized();
}

public function test_patient_can_view_only_own_dose_history(): void
{
    $own = $this->createIssuedMedication();
    $other = $this->createIssuedMedication();

    // First patient records a dose.
    Sanctum::actingAs($own['user']);

    $ownResponse = $this->postJson(
        '/api/patient/medication-doses',
        [
            'prescription_item_id' => $own['item']->id,
            'request_id' => (string) Str::uuid(),
            'taken_at' => now()->toIso8601String(),
        ]
    );

    $ownResponse->assertCreated();

    // Another patient records a separate dose.
    Sanctum::actingAs($other['user']);

    $this->postJson(
        '/api/patient/medication-doses',
        [
            'prescription_item_id' => $other['item']->id,
            'request_id' => (string) Str::uuid(),
            'taken_at' => now()->toIso8601String(),
        ]
    )->assertCreated();

    // The first patient must see only their own history.
    Sanctum::actingAs($own['user']);

    $this->getJson('/api/patient/medication-doses')
        ->assertOk()
        ->assertJsonCount(1, 'dose_logs.data')
        ->assertJsonPath(
            'dose_logs.data.0.id',
            $ownResponse->json('dose_log.id')
        )
        ->assertJsonPath(
            'dose_logs.data.0.prescription_item_id',
            $own['item']->id
        );

    // Two records exist, but the patient only received one.
    $this->assertDatabaseCount('medication_dose_logs', 2);
}

public function test_non_patient_roles_cannot_view_dose_history(): void
{
    foreach (['doctor', 'staff', 'admin'] as $role) {
        $user = User::factory()->create([
            'role' => $role,
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patient/medication-doses')
            ->assertForbidden();
    }
}

public function test_patient_without_profile_cannot_view_dose_history(): void
{
    $user = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    Sanctum::actingAs($user);

    $this->getJson('/api/patient/medication-doses')
        ->assertNotFound();
}


public function test_patient_dose_history_is_paginated(): void
{
    $fixture = $this->createIssuedMedication();

    // Create 12 synthetic dose records to test pagination.
    // These are database test fixtures, not clinical records.
    $latestLog = null;

    for ($i = 0; $i < 12; $i++) {
        $latestLog = MedicationDoseLog::create([
            'patient_id' => $fixture['patient']->id,
            'prescription_item_id' => $fixture['item']->id,
            'recorded_by_user_id' => $fixture['user']->id,
            'taken_at' => now()->subMinutes(12 - $i),
            'scheduled_for' => null,
            'request_id' => (string) Str::uuid(),
        ]);
    }

    Sanctum::actingAs($fixture['user']);

    // First page: newest 10 records.
    $this->getJson('/api/patient/medication-doses?page=1')
        ->assertOk()
        ->assertJsonCount(10, 'dose_logs.data')
        ->assertJsonPath('dose_logs.total', 12)
        ->assertJsonPath('dose_logs.per_page', 10)
        ->assertJsonPath('dose_logs.current_page', 1)
        ->assertJsonPath(
            'dose_logs.data.0.id',
            $latestLog->id
        );

    // Second page: remaining 2 records.
    $this->getJson('/api/patient/medication-doses?page=2')
        ->assertOk()
        ->assertJsonCount(2, 'dose_logs.data')
        ->assertJsonPath('dose_logs.total', 12)
        ->assertJsonPath('dose_logs.current_page', 2);

    $this->assertDatabaseCount(
        'medication_dose_logs',
        12
    );
}

public function test_patient_can_submit_mobile_iso_timestamp(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    // Match JavaScript new Date().toISOString():
    // YYYY-MM-DDTHH:mm:ss.sssZ
    $mobileTimestamp = now()
        ->utc()
        ->format('Y-m-d\TH:i:s.v\Z');

    $this->postJson('/api/patient/medication-doses', [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => $mobileTimestamp,
    ])
        ->assertCreated()
        ->assertJsonPath(
            'dose_log.prescription_item_id',
            $fixture['item']->id
        );

    $this->assertDatabaseCount('medication_dose_logs', 1);
}

public function test_patient_cannot_submit_malformed_timestamps(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    $invalidTimestamps = [
        'not-a-date',
        '2026-11-21 08:30:00',
        '2026-11-21T08:30:00',
    ];

    foreach ($invalidTimestamps as $timestamp) {
        $this->postJson('/api/patient/medication-doses', [
            'prescription_item_id' => $fixture['item']->id,
            'request_id' => (string) Str::uuid(),
            'taken_at' => $timestamp,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['taken_at']);
    }

    // Invalid timestamps must never create dose records.
    $this->assertDatabaseCount('medication_dose_logs', 0);
}

public function test_mobile_timestamp_with_milliseconds_can_be_retried(): void
{
    $fixture = $this->createIssuedMedication();

    Sanctum::actingAs($fixture['user']);

    // Simulate a JavaScript timestamp with nonzero milliseconds.
    $mobileTimestamp = now()
        ->utc()
        ->subMinute()
        ->format('Y-m-d\TH:i:s') . '.487Z';

    $payload = [
        'prescription_item_id' => $fixture['item']->id,
        'request_id' => (string) Str::uuid(),
        'taken_at' => $mobileTimestamp,
    ];

    // First submission creates the record.
    $first = $this->postJson(
        '/api/patient/medication-doses',
        $payload
    );

    $first->assertCreated();

    // Identical mobile retry should return the same record.
    $this->postJson(
        '/api/patient/medication-doses',
        $payload
    )
        ->assertOk()
        ->assertJsonPath(
            'dose_log.id',
            $first->json('dose_log.id')
        );

    // Never create two records from one request UUID.
    $this->assertDatabaseCount('medication_dose_logs', 1);
}

    private function createPatient(User $user): Patient
    {
        return Patient::create([
            'user_id' => $user->id,
            'patient_number' => 'TEST-' . Str::upper(Str::random(10)),
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
        ]);
    }

    private function createIssuedMedication(): array
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        $patient = $this->createPatient($user);

        $appointment = Appointment::create([
            'appointment_number' =>
                'APT-DOSE-' . Str::upper(Str::random(8)),
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => now()->toDateString(),
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'completed',
        ]);

        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' =>
                'Q-DOSE-' . Str::upper(Str::random(8)),
            'queue_date' => now()->toDateString(),
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now()->subHours(2),
            'completed_at' => now()->subHour(),
        ]);

        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'completed',
            'completed_at' => now()->subHour(),
        ]);

        $prescription = Prescription::create([
            'consultation_id' => $consultation->id,
            'status' => 'issued',
            'issued_at' => now()->subMinutes(30),
        ]);

        $prescription->issued_by = $doctor->id;
        $prescription->save();

        $item = $prescription->items()->create([
            'medicine' => 'TEST ONLY - Medication A',
            'dosage' => '1 tablet',
            'frequency' => 'Once daily',
            'schedule_type' => 'fixed',
            'administration_times' => ['08:00'],
        ]);

        return compact('user', 'patient', 'item');
    }
}
