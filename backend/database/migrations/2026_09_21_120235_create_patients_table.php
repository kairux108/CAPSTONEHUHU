<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();

            // Optional CURA login account
            $table->foreignId('user_id')
                ->nullable()
                ->unique()
                ->constrained('users')
                ->nullOnDelete();

            // CURA Patient ID
            $table->string('patient_number')->unique();

            // Personal Information
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();

            $table->date('birth_date');
            $table->string('sex', 20);

            // Contact Information
            $table->string('phone_number', 30)->nullable();
            $table->string('email')->nullable();

            // Address
            $table->string('street_address')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city')->default('Tagum City');
            $table->string('province')->default('Davao del Norte');

            // Basic Medical Information
            $table->string('blood_type', 10)->nullable();

            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->string('emergency_contact_phone', 30)->nullable();

            // Record Status
            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};