
<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientAppointmentController;
use App\Http\Controllers\PatientBookingController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientProfileController;
use App\Http\Controllers\QueueEntryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VitalSignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Current Authenticated User
    |--------------------------------------------------------------------------
    */

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | Patient Mobile - Own Profile
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/patient/profile',
        [PatientProfileController::class, 'show']
    );

    Route::patch(
        '/patient/profile',
        [PatientProfileController::class, 'update']
    );

    /*
    |--------------------------------------------------------------------------
    | Patient Mobile - Appointments
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/patient/appointments/upcoming',
        [PatientAppointmentController::class, 'upcoming']
    );

    /*
    |--------------------------------------------------------------------------
    | Patient Mobile - Booking
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:patient')->group(function () {

        Route::get(
            '/patient/booking/doctors',
            [PatientBookingController::class, 'doctors']
        );

        Route::get(
            '/patient/booking/availability',
            [PatientBookingController::class, 'availability']
        );
        Route::post(
    '/patient/booking',
    [PatientBookingController::class, 'store']
);

    });

    /*
    |--------------------------------------------------------------------------
    | Admin Only - User Management
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Staff + Doctor - View Patients
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,staff,doctor')->group(function () {

        Route::get(
            '/patients',
            [PatientController::class, 'index']
        );

        Route::get(
            '/patients/{patient}',
            [PatientController::class, 'show']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Staff Only - Register Patients
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:staff')->group(function () {

        Route::post(
            '/patients',
            [PatientController::class, 'store']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Doctor Only - Edit Patients
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:doctor')->group(function () {

        Route::put(
            '/patients/{patient}',
            [PatientController::class, 'update']
        );

        Route::patch(
            '/patients/{patient}',
            [PatientController::class, 'update']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Staff + Doctor - View Appointments
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,staff,doctor')->group(function () {

        Route::get(
            '/appointment-doctors',
            [AppointmentController::class, 'doctors']
        );

        Route::get(
            '/appointments',
            [AppointmentController::class, 'index']
        );

        Route::get(
            '/appointments/{appointment}',
            [AppointmentController::class, 'show']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Staff Only - Manage Appointments
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:staff')->group(function () {

        Route::post(
            '/appointments',
            [AppointmentController::class, 'store']
        );

        Route::put(
            '/appointments/{appointment}',
            [AppointmentController::class, 'update']
        );

        Route::patch(
            '/appointments/{appointment}',
            [AppointmentController::class, 'update']
        );

        Route::patch(
            '/appointments/{appointment}/check-in',
            [AppointmentController::class, 'checkIn']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Staff + Doctor - View Vital Signs
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,staff,doctor')->group(function () {

        Route::get(
            '/vital-signs',
            [VitalSignController::class, 'index']
        );

        Route::get(
            '/vital-signs/{vitalSign}',
            [VitalSignController::class, 'show']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Staff Only - Record and Edit Vital Signs
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:staff')->group(function () {

        Route::post(
            '/vital-signs',
            [VitalSignController::class, 'store']
        );

        Route::put(
            '/vital-signs/{vitalSign}',
            [VitalSignController::class, 'update']
        );

        Route::patch(
            '/vital-signs/{vitalSign}',
            [VitalSignController::class, 'update']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Staff + Doctor - View Queue
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,staff,doctor')->group(function () {

        Route::get(
            '/queue',
            [QueueEntryController::class, 'index']
        );

        Route::get(
            '/queue/{queueEntry}',
            [QueueEntryController::class, 'show']
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Staff Only - Manage Queue
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:staff')->group(function () {

        Route::post(
            '/queue',
            [QueueEntryController::class, 'store']
        );

        Route::put(
            '/queue/{queueEntry}',
            [QueueEntryController::class, 'update']
        );

        Route::patch(
            '/queue/{queueEntry}',
            [QueueEntryController::class, 'update']
        );

    });

});
