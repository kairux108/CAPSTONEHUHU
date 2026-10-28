
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('prescription_id')
                ->constrained('prescriptions')
                ->restrictOnDelete();

            $table->string('medicine');
            $table->string('strength')->nullable();
            $table->string('dosage')->nullable();
            $table->string('frequency')->nullable();

            // How many days the patient takes the medicine
            $table->unsignedSmallInteger('duration_days')
                ->nullable();

            // Optional duration details (e.g. ongoing)
            $table->string('duration')->nullable();

            $table->text('instructions')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescription_items');
    }
};
