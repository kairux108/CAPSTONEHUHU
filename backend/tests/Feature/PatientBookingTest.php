<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_tests_use_an_isolated_sqlite_database(): void
    {
        $this->assertSame(
            'testing',
            app()->environment()
        );

        $this->assertSame(
            'sqlite',
            config('database.default')
        );

        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );
    }

    public function test_patient_can_book_an_available_appointment(): void
    {
        // Confirm test database isolation.
        $this->assertSame('testing', app()->environment());
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(
            ':memory:',
            config('database.connections.sqlite.database')
        );

        // Book seven days into the future.
        $date = Carbon::today('Asia/Manila')->addDays(7);

        // Create an active synthetic doctor.
        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        // Create a synthetic patient account.
        $patientUser = User::factory()->create([
            'role' => 'patient',
            'status' => 'active',
        ]);

        // Create a patient profile linked to the account.
        $patientId = DB::table('patients')->insertGetId([
            'user_id' => $patientUser->id,
            'patient_number' => 'PT-TEST-BOOKING',
            'first_name' => 'Synthetic',
            'last_name' => 'Patient',
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a weekly doctor schedule for the test date.
        DB::table('doctor_availabilities')->insert([
            'doctor_id' => $doctor->id,
            'day_of_week' => $date->dayOfWeek,
            'start_time' => '09:00:00',
            'end_time' => '12:00:00',
            'slot_duration_minutes' => 30,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Authenticate as the patient.
        Sanctum::actingAs($patientUser);

        // Submit a real API booking request.
        $response = $this->postJson(
            '/api/patient/booking',
            [
                'doctor_id' => $doctor->id,
                'appointment_date' => $date->toDateString(),
                'appointment_time' => '09:00',
                'reason_for_visit' => 'TEST ONLY - Consultation',
            ]
        );

        // Booking should succeed.
        $response->assertStatus(201);

        $response->assertJsonPath(
            'appointment.status',
            'scheduled'
        );

        // Verify appointment was saved.
        $appointment = Appointment::query()
            ->where('patient_id', $patientId)
            ->where('doctor_id', $doctor->id)
            ->firstOrFail();

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'patient_id' => $patientId,
            'doctor_id' => $doctor->id,
            'created_by' => $patientUser->id,
            'appointment_type' => 'online',
            'status' => 'scheduled',
        ]);

        // Verify date and time.
        $this->assertSame(
            $date->toDateString(),
            $appointment->appointment_date->format('Y-m-d')
        );

        $this->assertSame(
            '09:00',
            substr((string) $appointment->appointment_time, 0, 5)
        );

        // Verify a unique-looking appointment number was generated.
        $this->assertStringStartsWith(
            'APT-',
            $appointment->appointment_number
        );

        // Exactly one appointment should exist.
        $this->assertDatabaseCount('appointments', 1);
    }

public function test_two_patients_cannot_book_same_doctor_and_time(): void
{
    // Verify isolated testing database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $date = Carbon::today('Asia/Manila')->addDays(7);

    // Create one active doctor.
    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Create two different patient accounts.
    $patientA = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    $patientB = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    // Create a profile for each patient.
    foreach ([$patientA, $patientB] as $index => $user) {
        DB::table('patients')->insert([
            'user_id' => $user->id,
            'patient_number' => 'PT-DOUBLE-' . ($index + 1),
            'first_name' => 'Synthetic',
            'last_name' => 'Patient ' . ($index + 1),
            'birth_date' => '2000-01-01',
            'sex' => 'male',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Doctor works from 9 AM to 12 PM.
    DB::table('doctor_availabilities')->insert([
        'doctor_id' => $doctor->id,
        'day_of_week' => $date->dayOfWeek,
        'start_time' => '09:00:00',
        'end_time' => '12:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $bookingData = [
        'doctor_id' => $doctor->id,
        'appointment_date' => $date->toDateString(),
        'appointment_time' => '09:00',
        'reason_for_visit' => 'TEST ONLY - Consultation',
    ];

    // Patient A books 9:00 AM successfully.
    Sanctum::actingAs($patientA);

    $firstResponse = $this->postJson(
        '/api/patient/booking',
        $bookingData
    );

    $firstResponse->assertStatus(201);

    $firstResponse->assertJsonPath(
        'appointment.status',
        'scheduled'
    );

    // Patient B attempts to book the same slot.
    Sanctum::actingAs($patientB);

    $secondResponse = $this->postJson(
        '/api/patient/booking',
        $bookingData
    );

    // CURA must reject the duplicate booking.
    $secondResponse->assertStatus(422);

    $secondResponse->assertJsonValidationErrors([
        'appointment_time',
    ]);

    // Only Patient A's appointment must exist.
    $this->assertDatabaseCount('appointments', 1);

    $appointment = Appointment::query()->sole();

    $this->assertSame(
        $doctor->id,
        $appointment->doctor_id
    );

    $this->assertSame(
        $patientA->id,
        $appointment->created_by
    );

    $this->assertSame(
        'scheduled',
        $appointment->status
    );
}

public function test_patient_cannot_book_when_doctor_is_unavailable(): void
{
    // Ensure the test uses isolated SQLite.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $date = Carbon::today('Asia/Manila')->addDays(7);

    // Create synthetic doctor and patient accounts.
    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    // Create the patient's profile.
    DB::table('patients')->insert([
        'user_id' => $patientUser->id,
        'patient_number' => 'PT-TEST-UNAVAILABLE',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Doctor normally works from 9 AM to 12 PM.
    DB::table('doctor_availabilities')->insert([
        'doctor_id' => $doctor->id,
        'day_of_week' => $date->dayOfWeek,
        'start_time' => '09:00:00',
        'end_time' => '12:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Doctor is unavailable from 9 AM to 10 AM.
    DB::table('doctor_unavailabilities')->insert([
        'doctor_id' => $doctor->id,
        'start_at' => $date->toDateString() . ' 09:00:00',
        'end_at' => $date->toDateString() . ' 10:00:00',
        'is_all_day' => false,
        'reason' => 'TEST ONLY - Doctor unavailable',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Authenticate as the patient.
    Sanctum::actingAs($patientUser);

    // Attempt to book during unavailable hours.
    $response = $this->postJson(
        '/api/patient/booking',
        [
            'doctor_id' => $doctor->id,
            'appointment_date' => $date->toDateString(),
            'appointment_time' => '09:00',
            'reason_for_visit' => 'TEST ONLY - Consultation',
        ]
    );

    // Booking must be rejected.
    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'appointment_time',
    ]);

    // No appointment should have been created.
    $this->assertDatabaseCount('appointments', 0);
}

public function test_patient_cannot_book_outside_doctor_working_hours(): void
{
    // Confirm the isolated SQLite testing database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $date = Carbon::today('Asia/Manila')->addDays(7);

    // Create synthetic doctor and patient accounts.
    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
        'status' => 'active',
    ]);

    // Create the synthetic patient profile.
    DB::table('patients')->insert([
        'user_id' => $patientUser->id,
        'patient_number' => 'PT-TEST-WORKING-HOURS',
        'first_name' => 'Synthetic',
        'last_name' => 'Patient',
        'birth_date' => '2000-01-01',
        'sex' => 'male',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Doctor works from 9 AM to 12 PM.
    DB::table('doctor_availabilities')->insert([
        'doctor_id' => $doctor->id,
        'day_of_week' => $date->dayOfWeek,
        'start_time' => '09:00:00',
        'end_time' => '12:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Authenticate as the patient.
    Sanctum::actingAs($patientUser);

    // Attempt booking at 8:30 AM, before working hours.
    $response = $this->postJson(
        '/api/patient/booking',
        [
            'doctor_id' => $doctor->id,
            'appointment_date' => $date->toDateString(),
            'appointment_time' => '08:30',
            'reason_for_visit' =>
                'TEST ONLY - Outside Working Hours',
        ]
    );

    // Booking must be rejected.
    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'appointment_time',
    ]);

    // No appointment should be created.
    $this->assertDatabaseCount('appointments', 0);
}

public function test_doctor_cannot_use_patient_booking_endpoint(): void
{
    // Verify isolated SQLite testing database.
    $this->assertSame('testing', app()->environment());
    $this->assertSame('sqlite', config('database.default'));
    $this->assertSame(
        ':memory:',
        config('database.connections.sqlite.database')
    );

    $date = Carbon::today('Asia/Manila')->addDays(7);

    // Create an active synthetic doctor.
    $doctor = User::factory()->create([
        'role' => 'doctor',
        'status' => 'active',
    ]);

    // Authenticate as a doctor, not a patient.
    Sanctum::actingAs($doctor);

    // Attempt to use the patient-only booking endpoint.
    $response = $this->postJson(
        '/api/patient/booking',
        [
            'doctor_id' => $doctor->id,
            'appointment_date' => $date->toDateString(),
            'appointment_time' => '09:00',
            'reason_for_visit' =>
                'TEST ONLY - Unauthorized Booking',
        ]
    );

    // Doctor accounts must not access patient booking.
    $response->assertForbidden();

    // No appointment must be created.
    $this->assertDatabaseCount('appointments', 0);
}

}
