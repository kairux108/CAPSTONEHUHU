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

class LabRequestDraftTest extends TestCase
{
    use RefreshDatabase;

    public function test_assigned_doctor_can_save_lab_request_draft(): void
    {
        // Ensure tests never use the real PostgreSQL database.
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

        // Create synthetic patient data.
        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-LAB-DRAFT',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $today = now('Asia/Manila')->toDateString();

        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-LAB-DRAFT',
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
            'queue_number' => 'Q-TEST-LAB-DRAFT',
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

        // Get actual catalog IDs.
        $cbc = LabTestCatalog::where(
            'name',
            'Complete Blood Count (CBC)'
        )->firstOrFail();

        $fbs = LabTestCatalog::where(
            'name',
            'Fasting Blood Sugar (FBS)'
        )->firstOrFail();

        Sanctum::actingAs($doctor);

        // Save two catalog tests and one custom test.
        $response = $this->postJson(
            "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
            [
                'clinical_indication' => 'TEST ONLY - Evaluation',
                'instructions' => 'TEST ONLY - Laboratory request',
                'catalog_test_ids' => [
                    $cbc->id,
                    $fbs->id,
                ],
                'custom_tests' => [
                    'TEST ONLY - Custom Examination',
                ],
            ]
        );

        $response->assertCreated()
            ->assertJsonPath('lab_request.status', 'draft')
            ->assertJsonCount(3, 'lab_request.items');

        $labRequestId = $response->json('lab_request.id');

        $this->assertDatabaseHas('lab_requests', [
            'id' => $labRequestId,
            'consultation_id' => $consultation->id,
            'requested_by' => $doctor->id,
            'status' => 'draft',
            'issued_by' => null,
            'issued_at' => null,
        ]);

        $this->assertDatabaseHas('lab_request_items', [
            'lab_request_id' => $labRequestId,
            'lab_test_catalog_id' => $cbc->id,
            'test_name' => 'Complete Blood Count (CBC)',
            'is_custom' => false,
        ]);

        $this->assertDatabaseHas('lab_request_items', [
            'lab_request_id' => $labRequestId,
            'lab_test_catalog_id' => $fbs->id,
            'test_name' => 'Fasting Blood Sugar (FBS)',
            'is_custom' => false,
        ]);

        $this->assertDatabaseHas('lab_request_items', [
            'lab_request_id' => $labRequestId,
            'lab_test_catalog_id' => null,
            'test_name' => 'TEST ONLY - Custom Examination',
            'is_custom' => true,
        ]);

        $this->assertSame(
            3,
            DB::table('lab_request_items')
                ->where('lab_request_id', $labRequestId)
                ->count()
        );

// SECURITY TEST 1:
// Another doctor must not create requests for this consultation.
$otherDoctor = User::factory()->create([
    'role' => 'doctor',
    'status' => 'active',
]);

Sanctum::actingAs($otherDoctor);

$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'catalog_test_ids' => [$cbc->id],
    ]
)->assertForbidden();

// Confirm no unauthorized request was created.
$this->assertSame(
    1,
    DB::table('lab_requests')
        ->where('consultation_id', $consultation->id)
        ->count()
);

// VALIDATION TEST 2:
// An authorized doctor cannot submit an empty request.
Sanctum::actingAs($doctor);

$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'catalog_test_ids' => [],
        'custom_tests' => [],
    ]
)->assertUnprocessable()
  ->assertJsonValidationErrors('tests');

// Confirm invalid input did not create another request.
$this->assertSame(
    1,
    DB::table('lab_requests')
        ->where('consultation_id', $consultation->id)
        ->count()
);

// VALIDATION TEST 3:
// Reject a catalog examination ID that does not exist.
$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'catalog_test_ids' => [999999999],
    ]
)->assertUnprocessable()
  ->assertJsonValidationErrors('catalog_test_ids.0');

// VALIDATION TEST 4:
// Reject duplicate catalog examinations.
$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'catalog_test_ids' => [
            $cbc->id,
            $cbc->id,
        ],
    ]
)->assertUnprocessable()
  ->assertJsonValidationErrors('catalog_test_ids.0');

// VALIDATION TEST 5:
// Reject an empty custom examination name.
$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'custom_tests' => ['   '],
    ]
)->assertUnprocessable()
  ->assertJsonValidationErrors('custom_tests.0');

// VALIDATION TEST 6:
// Reject duplicate custom names, ignoring case.
$this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'custom_tests' => [
            'Special Examination',
            'special examination',
        ],
    ]
)->assertUnprocessable()
  ->assertJsonValidationErrors('custom_tests.0');

// Invalid requests must never create additional records.
$this->assertSame(
    1,
    DB::table('lab_requests')
        ->where('consultation_id', $consultation->id)
        ->count()
);


// UPDATE DRAFT TEST:
// The assigned doctor edits the existing laboratory request.
Sanctum::actingAs($doctor);

$updateResponse = $this->putJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/{$labRequestId}/draft",
    [
        'clinical_indication' => 'TEST ONLY - Updated evaluation',
        'instructions' => 'TEST ONLY - Updated instructions',
        'catalog_test_ids' => [
            $fbs->id,
        ],
        'custom_tests' => [
            'TEST ONLY - Updated Custom Examination',
        ],
    ]
);

// The request must remain a draft with the same ID.
$updateResponse->assertOk()
    ->assertJsonPath('lab_request.id', $labRequestId)
    ->assertJsonPath('lab_request.status', 'draft')
    ->assertJsonCount(2, 'lab_request.items');

// Confirm that the original laboratory request was updated.
$this->assertDatabaseHas('lab_requests', [
    'id' => $labRequestId,
    'consultation_id' => $consultation->id,
    'clinical_indication' => 'TEST ONLY - Updated evaluation',
    'instructions' => 'TEST ONLY - Updated instructions',
    'status' => 'draft',
]);

// CBC was removed.
$this->assertDatabaseMissing('lab_request_items', [
    'lab_request_id' => $labRequestId,
    'lab_test_catalog_id' => $cbc->id,
]);

// FBS remains selected.
$this->assertDatabaseHas('lab_request_items', [
    'lab_request_id' => $labRequestId,
    'lab_test_catalog_id' => $fbs->id,
    'test_name' => 'Fasting Blood Sugar (FBS)',
    'is_custom' => false,
]);

// Updated custom examination is saved.
$this->assertDatabaseHas('lab_request_items', [
    'lab_request_id' => $labRequestId,
    'test_name' => 'TEST ONLY - Updated Custom Examination',
    'is_custom' => true,
]);

// Confirm no additional laboratory request was created.
$this->assertSame(
    1,
    DB::table('lab_requests')
        ->where('consultation_id', $consultation->id)
        ->count()
);

// Confirm the updated request contains exactly two examinations.
$this->assertSame(
    2,
    DB::table('lab_request_items')
        ->where('lab_request_id', $labRequestId)
        ->count()
);

// SECURITY TEST 7:
// Another doctor cannot update this laboratory request.
$otherDoctor = User::factory()->create([
    'role' => 'doctor',
    'status' => 'active',
]);

$updateUrl = "/api/doctor/consultations/{$queue->id}"
    . "/lab-requests/{$labRequestId}/draft";

$attemptedChanges = [
    'clinical_indication' => 'UNAUTHORIZED CHANGE',
    'catalog_test_ids' => [$cbc->id],
];

Sanctum::actingAs($otherDoctor);

$this->putJson($updateUrl, $attemptedChanges)
    ->assertForbidden();

// Confirm the unauthorized update changed nothing.
$this->assertDatabaseHas('lab_requests', [
    'id' => $labRequestId,
    'clinical_indication' => 'TEST ONLY - Updated evaluation',
    'status' => 'draft',
]);

$this->assertSame(
    2,
    DB::table('lab_request_items')
        ->where('lab_request_id', $labRequestId)
        ->count()
);

// SECURITY TEST 8:
// Once a laboratory request is issued, it cannot be edited.
Sanctum::actingAs($doctor);

// Simulate an already-issued request in the isolated test DB.
// The actual issuance API will be implemented separately.
DB::table('lab_requests')
    ->where('id', $labRequestId)
    ->update([
        'status' => 'issued',
        'issued_by' => $doctor->id,
        'issued_at' => now(),
    ]);

$this->putJson($updateUrl, [
    'clinical_indication' => 'ILLEGAL CHANGE AFTER ISSUE',
    'catalog_test_ids' => [$cbc->id],
])->assertStatus(409);

// Confirm the issued request remains unchanged.
$this->assertDatabaseHas('lab_requests', [
    'id' => $labRequestId,
    'status' => 'issued',
    'clinical_indication' => 'TEST ONLY - Updated evaluation',
    'issued_by' => $doctor->id,
]);

$this->assertSame(
    2,
    DB::table('lab_request_items')
        ->where('lab_request_id', $labRequestId)
        ->count()
);


// RETRIEVAL TEST:
// The assigned doctor can retrieve issued laboratory requests.
Sanctum::actingAs($doctor);

$labRequestsUrl =
    "/api/doctor/consultations/{$queue->id}/lab-requests";

$this->getJson($labRequestsUrl)
    ->assertOk()
    ->assertJsonCount(1, 'lab_requests')
    ->assertJsonPath('lab_requests.0.id', $labRequestId)
    ->assertJsonPath('lab_requests.0.status', 'issued')
    ->assertJsonCount(2, 'lab_requests.0.items');

// Create another laboratory request that remains a draft.
$newDraft = $this->postJson(
    "/api/doctor/consultations/{$queue->id}/lab-requests/draft",
    [
        'catalog_test_ids' => [$cbc->id],
    ]
);

$newDraft->assertCreated();

$newDraftId = $newDraft->json('lab_request.id');

// Both requests must be returned, newest first.
$this->getJson($labRequestsUrl)
    ->assertOk()
    ->assertJsonCount(2, 'lab_requests')
    ->assertJsonPath('lab_requests.0.id', $newDraftId)
    ->assertJsonPath('lab_requests.0.status', 'draft')
    ->assertJsonPath('lab_requests.1.id', $labRequestId)
    ->assertJsonPath('lab_requests.1.status', 'issued');

// Another doctor must not access these requests.
Sanctum::actingAs($otherDoctor);

$this->getJson($labRequestsUrl)
    ->assertForbidden();

    }
}
