<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();

            // Connected login account
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Staff information
            $table->string('staff_number')->unique();
            $table->string('position');
            $table->string('department')->nullable();

            $table->string('phone')->nullable();
            $table->text('address')->nullable();

            $table->date('date_hired')->nullable();

            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();

            $table->enum('status', [
                'Active',
                'Inactive',
                'On Leave'
            ])->default('Active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_profiles');
    }
};