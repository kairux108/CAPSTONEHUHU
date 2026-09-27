<?php

namespace App\Http\Controllers;

use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    /**
     * Display all staff members.
     */
    public function index()
    {
        $staff = StaffProfile::with('user')
            ->latest()
            ->get();

        return response()->json($staff);
    }

    /**
     * Create a new staff account and profile.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'string',
                'min:8'
            ],

            'position' => [
                'required',
                'string',
                'max:255'
            ],

            'department' => [
                'nullable',
                'string',
                'max:255'
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50'
            ],

            'address' => [
                'nullable',
                'string'
            ],

            'date_hired' => [
                'nullable',
                'date'
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255'
            ],

            'emergency_contact_number' => [
                'nullable',
                'string',
                'max:50'
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'Active',
                    'Inactive',
                    'On Leave'
                ])
            ],
        ]);

        $staff = DB::transaction(function () use ($validated) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(
                    $validated['password']
                ),
                'role' => 'staff',
            ]);

            $staffNumber = 'ST-' . str_pad(
                (string) $user->id,
                4,
                '0',
                STR_PAD_LEFT
            );

            return StaffProfile::create([
                'user_id' => $user->id,
                'staff_number' => $staffNumber,
                'position' => $validated['position'],
                'department' => $validated['department'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'date_hired' => $validated['date_hired'] ?? null,
                'emergency_contact_name' =>
                    $validated['emergency_contact_name'] ?? null,
                'emergency_contact_number' =>
                    $validated['emergency_contact_number'] ?? null,
                'status' => $validated['status'] ?? 'Active',
            ]);
        });

        return response()->json([
            'message' => 'Staff member created successfully.',
            'staff' => $staff->load('user'),
        ], 201);
    }

    /**
     * Display one staff member.
     */
    public function show(StaffProfile $staff)
    {
        return response()->json(
            $staff->load('user')
        );
    }

    /**
     * Update staff account and profile.
     */
    public function update(
        Request $request,
        StaffProfile $staff
    ) {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($staff->user_id)
            ],

            'password' => [
                'nullable',
                'string',
                'min:8'
            ],

            'position' => [
                'sometimes',
                'required',
                'string',
                'max:255'
            ],

            'department' => [
                'nullable',
                'string',
                'max:255'
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50'
            ],

            'address' => [
                'nullable',
                'string'
            ],

            'date_hired' => [
                'nullable',
                'date'
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255'
            ],

            'emergency_contact_number' => [
                'nullable',
                'string',
                'max:50'
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'Active',
                    'Inactive',
                    'On Leave'
                ])
            ],
        ]);

        DB::transaction(function () use (
            $validated,
            $staff
        ) {
            $user = $staff->user;

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            if (!empty($validated['password'])) {
                $user->password = Hash::make(
                    $validated['password']
                );
            }

            $user->save();

            $staff->update([
                'position' =>
                    $validated['position'] ?? $staff->position,

                'department' =>
                    $validated['department']
                    ?? $staff->department,

                'phone' =>
                    $validated['phone']
                    ?? $staff->phone,

                'address' =>
                    $validated['address']
                    ?? $staff->address,

                'date_hired' =>
                    $validated['date_hired']
                    ?? $staff->date_hired,

                'emergency_contact_name' =>
                    $validated['emergency_contact_name']
                    ?? $staff->emergency_contact_name,

                'emergency_contact_number' =>
                    $validated['emergency_contact_number']
                    ?? $staff->emergency_contact_number,

                'status' =>
                    $validated['status']
                    ?? $staff->status,
            ]);
        });

        return response()->json([
            'message' => 'Staff member updated successfully.',
            'staff' => $staff->fresh()->load('user'),
        ]);
    }

    /**
     * Deactivate staff instead of deleting history.
     */
    public function destroy(StaffProfile $staff)
    {
        $staff->update([
            'status' => 'Inactive',
        ]);

        return response()->json([
            'message' => 'Staff member deactivated successfully.',
        ]);
    }
}