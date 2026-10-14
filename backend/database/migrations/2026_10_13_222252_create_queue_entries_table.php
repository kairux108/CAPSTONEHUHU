<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_entries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('appointment_id')
                ->unique()
                ->constrained('appointments')
                ->restrictOnDelete();

            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('queue_number')->unique();

            $table->date('queue_date');

            $table->string('priority')
                ->default('normal');

            $table->string('priority_reason')
                ->nullable();

            $table->string('status')
                ->default('waiting');

            $table->timestamp('doctor_available_at')
                ->nullable();

            $table->unsignedSmallInteger('estimated_wait_minutes')
                ->nullable();

            $table->timestamp('queued_at');
            $table->timestamp('called_at')->nullable();
            $table->timestamp('consultation_started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index([
                'queue_date',
                'status',
            ]);

            $table->index([
                'doctor_id',
                'queue_date',
                'status',
            ]);

            $table->index([
                'queue_date',
                'priority',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_entries');
    }
};