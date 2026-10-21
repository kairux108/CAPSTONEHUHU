
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('doctor_availabilities')) {
            throw new RuntimeException(
                'doctor_availabilities table does not exist.'
            );
        }

        if (
            ! Schema::hasColumn('doctor_availabilities', 'start_at') ||
            ! Schema::hasColumn('doctor_availabilities', 'end_at') ||
            ! Schema::hasColumn('doctor_availabilities', 'is_all_day') ||
            ! Schema::hasColumn('doctor_availabilities', 'reason') ||
            Schema::hasColumn('doctor_availabilities', 'day_of_week')
        ) {
            throw new RuntimeException(
                'Unexpected doctor_availabilities schema. Migration stopped.'
            );
        }

        if (DB::table('doctor_availabilities')->exists()) {
            throw new RuntimeException(
                'Doctor availability table contains data. Migration stopped.'
            );
        }

        Schema::table('doctor_availabilities', function (Blueprint $table) {
            $table->dropIndex(
                'doctor_availabilities_doctor_id_start_at_end_at_index'
            );
        });

        Schema::table('doctor_availabilities', function (Blueprint $table) {
            $table->dropColumn([
                'start_at',
                'end_at',
                'is_all_day',
                'reason',
            ]);

            $table->unsignedTinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');

            $table->unsignedSmallInteger('slot_duration_minutes')
                ->default(30);

            $table->boolean('is_active')
                ->default(true);

            $table->index(
                ['doctor_id', 'day_of_week', 'is_active'],
                'doctor_availability_lookup_idx'
            );
        });
    }

    public function down(): void
    {
        throw new RuntimeException(
            'Automatic rollback is disabled to prevent loss of doctor schedule data.'
        );
    }
};///////////////////////////////mali ni////////////////////x
