<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('doctor_unavailabilities')) {
            return;
        }

        if (Schema::hasTable('doctor_availabilities')) {
            throw new RuntimeException(
                'Cannot rename doctor_unavailabilities because doctor_availabilities already exists.'
            );
        }

        Schema::rename('doctor_unavailabilities', 'doctor_availabilities');

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement(
                'ALTER TABLE doctor_availabilities RENAME CONSTRAINT doctor_unavailabilities_pkey TO doctor_availabilities_pkey'
            );

            Schema::table('doctor_availabilities', function (Blueprint $table): void {
                $table->renameIndex(
                    'doctor_unavailabilities_doctor_id_start_at_end_at_index',
                    'doctor_availabilities_doctor_id_start_at_end_at_index'
                );
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('doctor_availabilities')) {
            return;
        }

        if (Schema::hasTable('doctor_unavailabilities')) {
            throw new RuntimeException(
                'Cannot restore doctor_unavailabilities because that table already exists.'
            );
        }

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement(
                'ALTER TABLE doctor_availabilities RENAME CONSTRAINT doctor_availabilities_pkey TO doctor_unavailabilities_pkey'
            );

            Schema::table('doctor_availabilities', function (Blueprint $table): void {
                $table->renameIndex(
                    'doctor_availabilities_doctor_id_start_at_end_at_index',
                    'doctor_unavailabilities_doctor_id_start_at_end_at_index'
                );
            });
        }

        Schema::rename('doctor_availabilities', 'doctor_unavailabilities');
    }
};
//mali ni/////////////////////////////////////////////////////////////////////////////////////////