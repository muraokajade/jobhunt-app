<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'media' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'max:100'],
            'applied_date' => ['nullable', 'date'],
            'interview_date' => ['nullable', 'date'],
            'job_url' => ['nullable', 'url'],
            'interview_url' => ['nullable', 'url'],
            'memo' => ['nullable', 'string'],
            'next_action' => ['nullable', 'string', 'max:255'],
            'document_result' => ['nullable', 'string', 'max:100'],
            'first_interview_result' => ['nullable', 'string', 'max:100'],
            'second_interview_result' => ['nullable', 'string', 'max:100'],
            'final_result' => ['nullable', 'string', 'max:100'],
            'rejection_stage' => ['nullable', 'string', 'max:100'],
        ];
    }
}
