<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\QueueEntry;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | Authenticated Doctor
        |--------------------------------------------------------------------------
        */

        $doctor = $request->user();

        abort_unless(
            $doctor && $doctor->role === 'doctor',
            403
        );

        $today = Carbon::now(
            'Asia/Manila'
        )->toDateString();

        /*
        |--------------------------------------------------------------------------
        | Doctor's Appointments Today
        |--------------------------------------------------------------------------
        */

        $appointments = Appointment::query()
            ->with([
                'patient:id,patient_number,first_name,middle_name,last_name',
            ])
            ->where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', $today)
            ->orderBy('appointment_time')
            ->get([
                'id',
                'patient_id',
                'doctor_id',
                'appointment_number',
                'appointment_date',
                'appointment_time',
                'appointment_type',
                'reason_for_visit',
                'status',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Doctor's Queue Today
        |--------------------------------------------------------------------------
        */

        $queue = QueueEntry::query()
            ->with([
                'appointment:id,patient_id,appointment_number,appointment_time',
                'appointment.patient:id,patient_number,first_name,middle_name,last_name',
            ])
            ->where('doctor_id', $doctor->id)
            ->whereDate('queue_date', $today)
            ->orderBy('queued_at')
            ->get([
                'id',
                'appointment_id',
                'doctor_id',
                'queue_number',
                'priority',
                'status',
                'estimated_wait_minutes',
                'queued_at',
                'called_at',
                'consultation_started_at',
                'completed_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Dashboard Statistics
        |--------------------------------------------------------------------------
        */

        $summary = [
            'appointments_today' =>
                $appointments->count(),

            'waiting' =>
                $queue->where('status', 'waiting')->count(),

            'called' =>
                $queue->where('status', 'called')->count(),

            'in_consultation' =>
                $queue->where(
                    'status',
                    'in_consultation'
                )->count(),

            'completed' =>
                $queue->where('status', 'completed')->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Current and Next Patients
        |--------------------------------------------------------------------------
        */

        $currentPatient = $queue->firstWhere(
            'status',
            'in_consultation'
        );

        $nextPatient =
            $queue->firstWhere('status', 'called')
            ?? $queue->firstWhere('status', 'waiting');

        /*
        |--------------------------------------------------------------------------
        | Dashboard Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'date' => $today,

            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->name,
            ],

            'summary' => $summary,

            'current_patient' => $currentPatient,

            'next_patient' => $nextPatient,

            'appointments' => $appointments,

            'queue_entries' => $queue,
        ]);
    }
}
