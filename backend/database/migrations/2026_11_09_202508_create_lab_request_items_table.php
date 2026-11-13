
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_request_items', function (Blueprint $table) {
            $table->id();

            // Connect each examination to its laboratory request.
            $table->foreignId('lab_request_id')
                ->constrained('lab_requests')
                ->restrictOnDelete();

            // Selected examination from the catalog.
            // Null when the doctor selects Other (Specify).
            $table->foreignId('lab_test_catalog_id')
                ->nullable()
                ->constrained('lab_test_catalog')
                ->restrictOnDelete();

            // Store the examination name at the time of request.
            // Also stores custom examination names.
            $table->string('test_name');

            // Category snapshot for display and printing.
            $table->string('category', 100)
                ->nullable();

            // True if the doctor manually entered the examination.
            $table->boolean('is_custom')
                ->default(false);

            // Optional examination-specific instructions.
            $table->text('notes')
                ->nullable();

            $table->timestamps();

            // Improve lookup by laboratory request.
            $table->index('lab_request_id');

            // Prevent duplicate catalog examinations
            // within the same laboratory request.
            $table->unique(
                ['lab_request_id', 'lab_test_catalog_id'],
                'lab_items_request_catalog_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_request_items');
    }
};
