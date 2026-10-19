<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->registerPatient(
            $request->validated()
        );

        $user = $result['user'];
        $patient = $result['patient'];

        return response()->json([
            'message' => 'Account created successfully.',

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],

            'patient' => [
                'id' => $patient->id,
                'patient_number' => $patient->patient_number,
                'first_name' => $patient->first_name,
                'middle_name' => $patient->middle_name,
                'last_name' => $patient->last_name,
                'birth_date' => $patient->birth_date,
                'sex' => $patient->sex,
                'phone_number' => $patient->phone_number,
            ],
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = $this->authService->attemptLogin(
            $validated['email'],
            $validated['password']
        );

        if (!$user) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status === 'inactive') {
            return response()->json([
                'message' =>
                    'This account is inactive. Please contact the administrator.',
            ], 403);
        }

        $user->last_active_at = now();
        $user->save();

        $user->tokens()->delete();

        $token = $user
            ->createToken('cura-web')
            ->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'last_active_at' => $user->last_active_at,
            ],
        ]);
    }
}