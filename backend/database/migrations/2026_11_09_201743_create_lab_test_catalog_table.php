
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_test_catalog', function (Blueprint $table) {
            $table->id();

            // Laboratory category, such as Hematology or Imaging.
            $table->string('category', 100);

            // Examination name, such as Complete Blood Count (CBC).
            $table->string('name');

            // Allow the clinic to enable or disable an examination.
            $table->boolean('is_active')->default(true);

            // Controls the order displayed in the doctor's checklist.
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            // Prevent duplicate examination names in the same category.
            $table->unique(['category', 'name']);

            // Optimize searching active examinations by category.
            $table->index(['is_active', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_test_catalog');
    }
};
