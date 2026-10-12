<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->string('appointment_number')->unique();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->restrictOnDelete();

            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->date('appointment_date');
            $table->time('appointment_time');

            $table->string('appointment_type', 30);

            $table->text('reason_for_visit')->nullable();

            $table->string('status', 30)->default('scheduled');

            $table->timestamp('checked_in_at')->nullable();

            $table->timestamps();

            $table->index([
                'appointment_date',
                'status',
            ]);

            $table->index([
                'patient_id',
                'appointment_date',
            ]);

            $table->index([
                'doctor_id',
                'appointment_date',
                'appointment_time',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};