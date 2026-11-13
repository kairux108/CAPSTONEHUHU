<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\LabTestCatalog;
use App\Models\QueueEntry;
use App\Models\User;
use Database\Seeders\LabTestCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LabRequestIssuanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_assigned_doctor_can_issue_lab_request(): void
    {
        // Protect the real PostgreSQL database.
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $this->seed(LabTestCatalogSeeder::class);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-LAB-ISSUE',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $today = now('Asia/Manila')->toDateString();

        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-LAB-ISSUE',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'completed',
            'checked_in_at' => now(),
        ]);

        $queue = QueueEntry::create([
            'appointment_id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'created_by' => $doctor->id,
            'queue_number' => 'Q-TEST-LAB-ISSUE',
            'queue_date' => $today,
            'priority' => 'normal',
            'status' => 'completed',
            'queued_at' => now(),
            'called_at' => now(),
            'consultation_started_at' => now(),
            'completed_at' => now(),
        ]);

        $consultation = Consultation::create([
            'queue_entry_id' => $queue->id,
            'doctor_id' => $doctor->id,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $cbc = LabTestCatalog::where(
            'name',
            'Complete Blood Count (CBC)'
        )->firstOrFail();

        Sanctum::actingAs($doctor);

        // Step A: Create a laboratory request draft.
        $draftResponse = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
            [
                'clinical_indication' => 'TEST ONLY - Evaluation',
                'catalog_test_ids' => [$cbc->id],
                'custom_tests' => [
                    'TEST ONLY - Custom Examination',
                ],
            ]
        );

        $draftResponse->assertCreated()
            ->assertJsonPath('lab_request.status', 'draft');

        $labRequestId = $draftResponse->json('lab_request.id');

        // Step B: Issue the request with doctor confirmation.
        $issueResponse = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/lab-requests/{$labRequestId}/issue",
            [
                'confirm_issue' => true,
            ]
        );

        $issueResponse->assertOk()
            ->assertJsonPath('lab_request.id', $labRequestId)
            ->assertJsonPath('lab_request.status', 'issued')
            ->assertJsonPath('lab_request.issued_by', $doctor->id)
            ->assertJsonCount(2, 'lab_request.items');

        // Step C: Verify saved issuance information.
        $this->assertDatabaseHas('lab_requests', [
            'id' => $labRequestId,
            'consultation_id' => $consultation->id,
            'requested_by' => $doctor->id,
            'issued_by' => $doctor->id,
            'status' => 'issued',
        ]);

        $this->assertNotNull(
            DB::table('lab_requests')
                ->where('id', $labRequestId)
                ->value('issued_at')
        );

        // Catalog examination must still exist.
        $this->assertDatabaseHas('lab_request_items', [
            'lab_request_id' => $labRequestId,
            'lab_test_catalog_id' => $cbc->id,
            'test_name' => 'Complete Blood Count (CBC)',
            'is_custom' => false,
        ]);

        // Custom examination must still exist.
        $this->assertDatabaseHas('lab_request_items', [
            'lab_request_id' => $labRequestId,
            'test_name' => 'TEST ONLY - Custom Examination',
            'is_custom' => true,
        ]);

        // Issuance must not create additional requests.
        $this->assertSame(
            1,
            DB::table('lab_requests')
                ->where('consultation_id', $consultation->id)
                ->count()
        );

// SECURITY TEST 1:
// The same laboratory request cannot be issued twice.

$issueUrl = "/api/doctor/consultations/{$queue->id}"
    . "/lab-requests/{$labRequestId}/issue";

$originalIssuedAt = DB::table('lab_requests')
    ->where('id', $labRequestId)
    ->value('issued_at');

$this->postJson($issueUrl, [
    'confirm_issue' => true,
])->assertStatus(409);


// SECURITY TEST 2:
// Issuance requires explicit confirmation.

$this->postJson($issueUrl, [])
    ->assertUnprocessable()
    ->assertJsonValidationErrors('confirm_issue');

$this->postJson($issueUrl, [
    'confirm_issue' => false,
])->assertUnprocessable()
  ->assertJsonValidationErrors('confirm_issue');


// SECURITY TEST 3:
// Another doctor cannot issue the laboratory request.

$otherDoctor = User::factory()->create([
    'role' => 'doctor',
    'status' => 'active',
]);

Sanctum::actingAs($otherDoctor);

$this->postJson($issueUrl, [
    'confirm_issue' => true,
])->assertForbidden();


// INTEGRITY CHECK:
// Failed attempts must not change the issued request.

$this->assertDatabaseHas('lab_requests', [
    'id' => $labRequestId,
    'status' => 'issued',
    'issued_by' => $doctor->id,
]);

$this->assertSame(
    $originalIssuedAt,
    DB::table('lab_requests')
        ->where('id', $labRequestId)
        ->value('issued_at')
);

$this->assertSame(
    2,
    DB::table('lab_request_items')
        ->where('lab_request_id', $labRequestId)
        ->count()
);

// SECURITY TEST 4:
// A laboratory request cannot be issued before
// the consultation is completed.

// Switch back to the assigned doctor.
Sanctum::actingAs($doctor);

// Create a second, separate laboratory request draft.
$secondDraftResponse = $this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'clinical_indication' => 'TEST ONLY - Second request',
        'catalog_test_ids' => [$cbc->id],
    ]
);

$secondDraftResponse->assertCreated();

$secondRequestId = $secondDraftResponse->json('lab_request.id');

$secondIssueUrl = "/api/doctor/consultations/{$queue->id}"
    . "/lab-requests/{$secondRequestId}/issue";

// Simulate an incomplete consultation in SQLite.
DB::table('consultations')
    ->where('id', $consultation->id)
    ->update([
        'status' => 'draft',
        'completed_at' => null,
    ]);

// Issuance must be rejected.
$this->postJson($secondIssueUrl, [
    'confirm_issue' => true,
])->assertStatus(409);

// Request must remain a draft.
$this->assertDatabaseHas('lab_requests', [
    'id' => $secondRequestId,
    'status' => 'draft',
    'issued_by' => null,
    'issued_at' => null,
]);


// SECURITY TEST 5:
// An empty laboratory request cannot be issued.

// Restore completed consultation status.
DB::table('consultations')
    ->where('id', $consultation->id)
    ->update([
        'status' => 'completed',
        'completed_at' => now(),
    ]);

// Simulate a draft with no examination items.
DB::table('lab_request_items')
    ->where('lab_request_id', $secondRequestId)
    ->delete();

// The API must reject issuance.
$this->postJson($secondIssueUrl, [
    'confirm_issue' => true,
])->assertStatus(422);

// Confirm the second request remains unissued.
$this->assertDatabaseHas('lab_requests', [
    'id' => $secondRequestId,
    'status' => 'draft',
    'issued_by' => null,
    'issued_at' => null,
]);

// Confirm the original issued request was not affected.
$this->assertDatabaseHas('lab_requests', [
    'id' => $labRequestId,
    'status' => 'issued',
    'issued_by' => $doctor->id,
]);

// Exactly two laboratory requests should exist.
$this->assertSame(
    2,
    DB::table('lab_requests')
        ->where('consultation_id', $consultation->id)
        ->count()
);

    }
}
