<?php

use App\Http\Controllers\PatientMedicationController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\LabTestCatalogController;
use App\Http\Controllers\LabRequestController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorQueueController;
use App\Http\Controllers\PatientAppointmentController;
use App\Http\Controllers\PatientBookingController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientProfileController;
use App\Http\Controllers\QueueEntryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VitalSignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientMedicalHistoryController;
use App\Http\Controllers\DoctorPatientController;
use App\Http\Controllers\PatientMedicalRecordsController;


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
| Doctor Portal - My Queue & Consultation
|--------------------------------------------------------------------------
*/

Route::middleware('role:doctor')->group(function () {


// Doctor - View authorized patient medical history.
Route::get(
    '/doctor/patients/{patient}/medical-history',
    [PatientMedicalHistoryController::class, 'show']
)->whereNumber('patient');


    /*
    |--------------------------------------------------------------------------
    | Doctor Queue
    |--------------------------------------------------------------------------
    */

    // View today's assigned queue.
    Route::get(
        '/doctor/queue',
        [DoctorQueueController::class, 'index']
    );

    // Doctor-controlled Smart Queue:
    // Call the next eligible waiting patient.
    Route::post(
        '/doctor/queue/call-next',
        [DoctorQueueController::class, 'callNext']
    );

    // View selected queue entry.
    Route::get(
        '/doctor/queue/{queueEntry}',
        [DoctorQueueController::class, 'show']
    )->whereNumber('queueEntry');



    /*
    |--------------------------------------------------------------------------
    | Doctor Consultation
    |--------------------------------------------------------------------------
    */

    // Load saved consultation.
    Route::get(
        '/doctor/consultations/{queueEntry}',
        [ConsultationController::class, 'show']
    );

    // Save consultation draft.
    Route::put(
        '/doctor/consultations/{queueEntry}/draft',
        [ConsultationController::class, 'saveDraft']
    );

    // Start consultation.
    Route::post(
        '/doctor/consultations/{queueEntry}/start',
        [ConsultationController::class, 'start']
    );


    // Complete consultation.
    Route::post(
        '/doctor/consultations/{queueEntry}/complete',
        [ConsultationController::class, 'complete']
    );

    // Issue digital prescription after consultation completion.
    Route::post(
        '/doctor/consultations/{queueEntry}/prescription/issue',
        [PrescriptionController::class, 'issue']
    )->whereNumber('queueEntry');

// Doctor - View active laboratory and diagnostic examinations.
Route::get(
    '/doctor/lab-tests',
    [LabTestCatalogController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| Doctor - Laboratory Request Management
|--------------------------------------------------------------------------
|
| All routes require Sanctum authentication and the doctor role.
|
*/

// Retrieve saved laboratory requests (draft and issued).
Route::get(
    '/doctor/consultations/{queueEntry}/lab-requests',
    [LabRequestController::class, 'index']
)->whereNumber('queueEntry');

// Create a new laboratory request draft.
Route::post(
    '/doctor/consultations/{queueEntry}/lab-requests/draft',
    [LabRequestController::class, 'storeDraft']
)->whereNumber('queueEntry');

// Update an existing laboratory request draft.
Route::put(
    '/doctor/consultations/{queueEntry}/lab-requests/{labRequest}/draft',
    [LabRequestController::class, 'updateDraft']
)->whereNumber('queueEntry')
  ->whereNumber('labRequest');

// Issue a laboratory request after consultation completion.
Route::post(
    '/doctor/consultations/{queueEntry}/lab-requests/{labRequest}/issue',
    [LabRequestController::class, 'issue']
)->whereNumber('queueEntry')
  ->whereNumber('labRequest');

});



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
        | Admin + Staff - View Clinic Patients
        |--------------------------------------------------------------------------
        |
        | Doctors must use the doctor-specific patient APIs.
        |
        */

        Route::middleware('role:admin,staff')->group(function () {

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
    | Staff Only - Register Patients + Check Booking Availability
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:staff')->group(function () {

        Route::post(
            '/patients',
            [PatientController::class, 'store']
        );

        Route::get(
            '/staff/booking/availability',
            [PatientBookingController::class, 'availability']
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
    | Admin + Staff - View Clinic-Wide Queue
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,staff')->group(function () {

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


    /*
    |--------------------------------------------------------------------------
    | Doctor Dashboard and Patients
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:doctor')->group(function () {

        Route::get(
            '/doctor/dashboard',
            [\App\Http\Controllers\DoctorDashboardController::class, 'index']
        );

        Route::get(
            '/doctor/patients',
            [DoctorPatientController::class, 'index']
        );

    });
        /*
        |--------------------------------------------------------------------------
        | Patient Mobile - Medical Records
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:patient')->group(function () {

            Route::get(
                '/patient/medical-records',
                [PatientMedicalRecordsController::class, 'index']
            );

        });
            /*
            |--------------------------------------------------------------------------
            | Patient Mobile - Medication Schedule
            |--------------------------------------------------------------------------
            | Authenticated patients only.
            | Temporary response for the first TDD security test.
            */
            Route::middleware('role:patient')->get(
                '/patient/medications',
                [PatientMedicationController::class, 'index']
            );
});