<?php

namespace App\Http\Controllers;

use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private array $roles = ['admin', 'staff', 'doctor'];
    private array $statuses = ['active', 'on_leave', 'inactive'];


    /*
    |--------------------------------------------------------------------------
    | GET ALL USERS
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $users = User::with('staffProfile:id,user_id,position')
            ->whereIn('role', $this->roles)
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'role',
                'status',
                'last_active_at',
                'created_at',
                'updated_at',
            ]);

        return response()->json([
            'users' => $users,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE USER
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            'role' => [
                'required',
                Rule::in($this->roles),
            ],

            'status' => [
                'nullable',
                Rule::in($this->statuses),
            ],

            'position' => [
                Rule::requiredIf(
                    fn () => $request->role === 'staff'
                ),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
                'status' => $validated['status'] ?? 'active',
            ]);

            if ($user->role === 'staff') {
                StaffProfile::create([
                    'user_id' => $user->id,
                    'staff_number' => $this->makeStaffNumber($user->id),
                    'position' => $validated['position'],
                    'status' => 'Active',
                ]);
            }

            return $user;
        });

        $user->load('staffProfile:id,user_id,position');

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | GET ONE USER
    |--------------------------------------------------------------------------
    */

    public function show(User $user)
    {
        $this->ensureManageableUser($user);

        $user->load('staffProfile:id,user_id,position');

        return response()->json([
            'user' => $user,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, User $user)
    {
        $this->ensureManageableUser($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'role' => [
                'required',
                Rule::in($this->roles),
            ],

            'status' => [
                'required',
                Rule::in($this->statuses),
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
            ],

            'position' => [
                Rule::requiredIf(
                    fn () => $request->role === 'staff'
                ),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        DB::transaction(function () use ($validated, $user) {
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->role = $validated['role'];
            $user->status = $validated['status'];

            if (!empty($validated['password'])) {
                $user->password = $validated['password'];
            }

            $user->save();

            if ($user->role === 'staff') {
                StaffProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'staff_number' => $this->makeStaffNumber($user->id),
                        'position' => $validated['position'],
                        'status' => $this->staffStatus($user->status),
                    ]
                );
            }
        });

        $user->load('staffProfile:id,user_id,position');

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    public function destroy(User $user)
    {
        $this->ensureManageableUser($user);

        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    private function ensureManageableUser(User $user): void
    {
        abort_unless(
            in_array($user->role, $this->roles, true),
            404
        );
    }

    private function makeStaffNumber(int $userId): string
    {
        return 'ST-' . str_pad(
            (string) $userId,
            4,
            '0',
            STR_PAD_LEFT
        );
    }

    private function staffStatus(string $status): string
    {
        return match ($status) {
            'on_leave' => 'On Leave',
            'inactive' => 'Inactive',
            default => 'Active',
        };
    }
}