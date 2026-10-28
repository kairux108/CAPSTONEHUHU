<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('queue_entry_id')
                ->unique()
                ->constrained('queue_entries')
                ->restrictOnDelete();

            $table->foreignId('doctor_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('status', 20)->default('draft');

            // SOAP notes
            $table->text('subjective')->nullable();
            $table->text('objective')->nullable();
            $table->text('assessment')->nullable();
            $table->text('plan')->nullable();

            // Care plan
            $table->text('care_instructions')->nullable();
            $table->text('follow_up_instructions')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index(['doctor_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
