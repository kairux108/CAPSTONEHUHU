<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_dose_logs', function (Blueprint $table) {
            $table->id();

            // The patient who owns this dose record.
            $table->foreignId('patient_id')
                ->constrained('patients')
                ->restrictOnDelete();

            // The exact medication from an issued prescription.
            $table->foreignId('prescription_item_id')
                ->constrained('prescription_items')
                ->restrictOnDelete();

            // The authenticated account that recorded the dose.
            $table->foreignId('recorded_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            // Actual patient-reported medication time.
            $table->timestampTz('taken_at');

            // Optional prescribed schedule occurrence.
            // Null for PRN or doses without a verified time slot.
            $table->timestampTz('scheduled_for')
                ->nullable();

            // Unique identifier to protect against request retries.
            $table->uuid('request_id')->unique();

            // Server-managed record timestamps.
            $table->timestamps();

            $table->index([
                'patient_id',
                'taken_at',
            ], 'med_dose_patient_taken_idx');

            $table->index([
                'prescription_item_id',
                'taken_at',
            ], 'med_dose_item_taken_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_dose_logs');
    }
};
