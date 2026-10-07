<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });


    /*
    |--------------------------------------------------------------------------
    | Admin Only - User Management
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::apiResource(
            'users',
            UserController::class
        );

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
        Route::get(
    '/appointment-doctors',
    [AppointmentController::class, 'doctors']
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

        /*
        |--------------------------------------------------------------------------
        | Staff Only - Patient Check-In
        |--------------------------------------------------------------------------
        */

        Route::patch(
            '/appointments/{appointment}/check-in',
            [AppointmentController::class, 'checkIn']
        );

    });

});