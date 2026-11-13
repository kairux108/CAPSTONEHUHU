<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\LabRequest;
use App\Models\LabTestCatalog;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class LabRequestRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_lab_request_supports_catalog_and_custom_examinations(): void
    {
        // Protect the real PostgreSQL database.
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-LAB',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $today = now('Asia/Manila')->toDateString();

        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-LAB',
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
            'queue_number' => 'Q-TEST-LAB',
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

        // Create a catalog examination.
        $cbc = LabTestCatalog::create([
            'category' => 'Hematology',
            'name' => 'Complete Blood Count (CBC)',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Create the request through the consultation.
        $labRequest = $consultation->labRequests()->create([
            'requested_by' => $doctor->id,
            'clinical_indication' => 'TEST ONLY - Evaluation',
            'instructions' => 'TEST ONLY - No clinical use',
        ]);

        // Select an examination from the catalog.
        $labRequest->items()->create([
            'lab_test_catalog_id' => $cbc->id,
            'test_name' => $cbc->name,
            'category' => $cbc->category,
            'is_custom' => false,
        ]);

        // Add a custom examination using Other (Specify).
        $labRequest->items()->create([
            'lab_test_catalog_id' => null,
            'test_name' => 'TEST ONLY - Custom Examination',
            'category' => 'Other',
            'is_custom' => true,
        ]);

        // Verify all relationships.
        $this->assertCount(
            1,
            $consultation->fresh()->labRequests
        );

        $this->assertSame(
            $consultation->id,
            $labRequest->consultation->id
        );

        $this->assertSame(
            $doctor->id,
            $labRequest->requestingDoctor->id
        );

        $this->assertCount(
            2,
            $labRequest->fresh()->items
        );

        $this->assertSame(
            'draft',
            $labRequest->fresh()->status
        );

        $catalogItem = $labRequest->items()
            ->where('is_custom', false)
            ->firstOrFail();

        $this->assertSame(
            $cbc->id,
            $catalogItem->catalogTest->id
        );

        $this->assertFalse($catalogItem->is_custom);

        $customItem = $labRequest->items()
            ->where('is_custom', true)
            ->firstOrFail();

        $this->assertTrue($customItem->is_custom);

        $this->assertNull(
            $customItem->lab_test_catalog_id
        );

        $this->assertSame(
            'TEST ONLY - Custom Examination',
            $customItem->test_name
        );

        // Verify one consultation can have multiple laboratory requests.
        $secondRequest = $consultation->labRequests()->create([
            'requested_by' => $doctor->id,
            'clinical_indication' => 'TEST ONLY - Follow-up evaluation',
            'instructions' => 'TEST ONLY - Second laboratory request',
        ]);

        // The two requests must have different IDs.
        $this->assertNotEquals(
            $labRequest->id,
            $secondRequest->id
        );

        // Both requests must belong to the same consultation.
        $this->assertSame(
            2,
            $consultation->labRequests()->count()
        );

        // The second request must start as a draft.
        $this->assertSame(
            'draft',
            $secondRequest->fresh()->status
        );

        // Verify referenced records cannot be accidentally deleted.
        foreach ([
            ['table' => 'lab_test_catalog', 'id' => $cbc->id],
            ['table' => 'lab_requests', 'id' => $labRequest->id],
        ] as $record) {
            try {
                DB::table($record['table'])
                    ->where('id', $record['id'])
                    ->delete();

                $this->fail(
                    "Foreign-key restriction failed for {$record['table']}"
                );
            } catch (\Illuminate\Database\QueryException $e) {
                // Expected: deletion is blocked by the foreign key.
                $this->assertDatabaseHas(
                    $record['table'],
                    ['id' => $record['id']]
                );
            }
        }
    }
}