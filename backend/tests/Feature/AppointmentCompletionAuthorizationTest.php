<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentCompletionAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_cannot_complete_appointment_through_normal_update_endpoint(): void
    {
        $this->assertIsolatedTestDatabase();

        [$staff, $appointment] = $this->makeCheckedInAppointment();
        Sanctum::actingAs($staff);

        foreach (['patchJson', 'putJson'] as $method) {
            $response = $this->{$method}(
                "/api/appointments/{$appointment->id}",
                ['status' => 'completed']
            );

            $response->assertStatus(422);
            $response->assertJsonValidationErrors(['status']);

            $this->assertDatabaseHas('appointments', [
                'id' => $appointment->id,
                'status' => 'checked_in',
            ]);
        }
    }

    public function test_normal_appointment_service_cannot_bypass_completion_workflow(): void
    {
        $this->assertIsolatedTestDatabase();

        [, $appointment] = $this->makeCheckedInAppointment();

        try {
            app(AppointmentService::class)->update(
                $appointment,
                ['status' => 'completed']
            );

            $this->fail('Direct appointment completion must be rejected.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('status', $exception->errors());
        }

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'checked_in',
        ]);
    }

    private function assertIsolatedTestDatabase(): void
    {
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    private function makeCheckedInAppointment(): array
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'status' => 'active',
        ]);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        $patientId = DB::table('patients')->insertGetId([
            'patient_number' => 'PT-TEST-COMPLETION-GUARD',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $appointment = Appointment::create([
            'appointment_number' => 'APT-TEST-COMPLETION-GUARD',
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $staff->id,
            'appointment_date' => now('Asia/Manila')->toDateString(),
            'appointment_time' => '09:00:00',
            'appointment_type' => 'walk_in',
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return [$staff, $appointment];
    }
}
