<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LabTestCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LabTestCatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_can_view_active_lab_catalog(): void
    {
        $this->seed(LabTestCatalogSeeder::class);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        Sanctum::actingAs($doctor);

        $response = $this->getJson('/api/doctor/lab-tests');

        $response->assertOk()
            ->assertJsonStructure([
                'categories' => [
                    '*' => [
                        'name',
                        'tests' => [
                            '*' => ['id', 'name'],
                        ],
                    ],
                ],
            ]);

        $categories = collect($response->json('categories'));

        $this->assertCount(7, $categories);

        $tests = $categories->flatMap(
            fn ($category) => $category['tests']
        );

        $this->assertCount(67, $tests);

        $this->assertContains(
            'Complete Blood Count (CBC)',
            $tests->pluck('name')->all()
        );
    }

    public function test_inactive_examinations_are_hidden(): void
    {
        $this->seed(LabTestCatalogSeeder::class);

        DB::table('lab_test_catalog')
            ->where('name', 'Complete Blood Count (CBC)')
            ->update(['is_active' => false]);

        $doctor = User::factory()->create([
            'role' => 'doctor',
            'status' => 'active',
        ]);

        Sanctum::actingAs($doctor);

        $response = $this->getJson('/api/doctor/lab-tests');

        $response->assertOk()
            ->assertJsonMissing([
                'name' => 'Complete Blood Count (CBC)',
            ]);

        $tests = collect($response->json('categories'))
            ->flatMap(fn ($category) => $category['tests']);

        $this->assertCount(66, $tests);
    }

    public function test_non_doctor_roles_cannot_view_lab_catalog(): void
    {
        foreach (['patient', 'staff', 'admin'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'status' => 'active',
            ]);

            Sanctum::actingAs($user);

            $this->getJson('/api/doctor/lab-tests')
                ->assertForbidden();
        }
    }

    public function test_unauthenticated_user_cannot_view_lab_catalog(): void
    {
        $this->getJson('/api/doctor/lab-tests')
            ->assertUnauthorized();
    }
}
