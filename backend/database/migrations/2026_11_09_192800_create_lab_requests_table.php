
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_requests', function (Blueprint $table) {
            $table->id();

            // One consultation may have multiple lab requests.
            $table->foreignId('consultation_id')
                ->constrained('consultations')
                ->restrictOnDelete();

            // Doctor who created the request.
            $table->foreignId('requested_by')
                ->constrained('users')
                ->restrictOnDelete();

            // Draft or issued.
            $table->string('status', 20)
                ->default('draft');

            // Clinical reason for requesting examinations.
            $table->text('clinical_indication')
                ->nullable();

            // Additional doctor instructions.
            $table->text('instructions')
                ->nullable();

            // Doctor who issued the request.
            $table->foreignId('issued_by')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('issued_at')
                ->nullable();

            $table->timestamps();

            $table->index([
                'consultation_id',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_requests');
    }
};
