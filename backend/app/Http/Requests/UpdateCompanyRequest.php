<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// 企業情報更新APIで受け取る入力値を検証するFormRequestクラス。
// PUT /api/companies/{id} の更新時に、不正な値がDBへ保存されることを防ぐ。
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
     * 企業情報更新時に適用するバリデーションルールを返すメソッド。
     * 必須項目、nullable項目、文字数、日付形式、URL形式、選択肢の制限をここで定義する。
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'media' => ['nullable', 'string', 'max:100'],

            'priority' => [
                'nullable',
                'string',
                Rule::in([
                    '5.0',
                    '4.5',
                    '4.0',
                    '3.5',
                    '3.0',
                    '2.5',
                    '2.0',
                    '1.5',
                    '1.0',
                ]),
            ],

            'status' => [
                'required',
                'string',
                Rule::in([
                    '応募済み',
                    '書類選考待ち',
                    '書類通過',
                    '面談日程調整中',
                    '面談予定',
                    '面談後返答待ち',
                    '内定',
                    '辞退',
                    '落選',
                ]),
            ],



            'applied_date' => ['nullable', 'date'],
            'interview_date' => ['nullable', 'date'],
            'job_url' => ['nullable', 'url'],
            'interview_url' => ['nullable', 'url'],
            'memo' => ['nullable', 'string'],
            'next_action' => ['nullable', 'string', 'max:255'],

            'document_result' => [
                'nullable',
                'string',
                Rule::in([
                    '未対応',
                    '通過',
                    '不通過',
                    '保留',
                    '辞退',
                ]),
            ],


            'first_interview_result' => [
                'nullable',
                'string',
                Rule::in([
                    '未対応',
                    '通過',
                    '不通過',
                    '保留',
                    '辞退',
                ]),
            ],

            'second_interview_result' => [
                'nullable',
                'string',
                Rule::in([
                    '未対応',
                    '通過',
                    '不通過',
                    '保留',
                    '辞退',
                ]),
            ],

            'final_result' => [
                'nullable',
                'string',
                Rule::in([
                    '未対応',
                    '通過',
                    '不通過',
                    '保留',
                    '辞退',
                ]),
            ],

            'rejection_stage' => [
                'nullable',
                'string',
                Rule::in([
                    '書類落ち',
                    '1次面接落ち',
                    '2次面接落ち',
                    '最終落ち',
                    '条件不一致',
                    '辞退',
                ]),
            ],
        ];
    }
}
