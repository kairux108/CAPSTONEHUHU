<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Medication Schedule Type
            |--------------------------------------------------------------------------
            |
            | fixed    - Specific administration times
            | interval - Every specified number of hours
            | meal     - Before, with, or after meals
            | custom   - Doctor-defined instructions
            |
            | Nullable for existing prescriptions.
            */

            $table->string('schedule_type', 30)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | As-Needed Medication (PRN)
            |--------------------------------------------------------------------------
            |
            | true  - Take only when needed, as prescribed
            | false - Not designated as PRN
            |
            | Independent of schedule_type.
            | PRN medication must not generate compulsory
            | recurring dose reminders.
            */

            $table->boolean('as_needed')
                ->default(false);

            /*
            |--------------------------------------------------------------------------
            | Fixed Administration Times
            |--------------------------------------------------------------------------
            |
            | Example: ["08:00", "20:00"]
            |
            | Stored as JSON for multiple times.
            */

            $table->json('administration_times')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Hourly Interval
            |--------------------------------------------------------------------------
            |
            | Example: Every 4 hours.
            */

            $table->unsignedSmallInteger('interval_hours')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Interval Context
            |--------------------------------------------------------------------------
            |
            | around_clock - Includes overnight doses
            | while_awake  - Only during waking hours
            */

            $table->string('interval_scope', 30)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Meal-Based Schedule
            |--------------------------------------------------------------------------
            |
            | before - Before meals
            | with   - With meals
            | after  - After meals
            */

            $table->string('meal_relation', 20)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Additional Timing Instructions
            |--------------------------------------------------------------------------
            |
            | Doctor-provided guidance for PRN use,
            | meal details, start times, or custom schedules.
            |
            | No automatic medication timing assumptions.
            */

            $table->text('timing_instructions')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->dropColumn([
                'schedule_type',
                'as_needed',
                'administration_times',
                'interval_hours',
                'interval_scope',
                'meal_relation',
                'timing_instructions',
            ]);
        });
    }
};
