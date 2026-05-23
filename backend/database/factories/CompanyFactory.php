<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Companyモデルの初期テストデータを定義するメソッド。
     * API登録・更新・検索・削除テストで使う標準的な企業情報を返す。
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'テスト株式会社',
            'media' => 'Green',
            'priority' => '3.0',
            'status' => '応募済み',
            'applied_date' => now()->toDateString(),
            'interview_date' => null,
            'job_url' => 'https://example.com/jobs/1',
            'interview_url' => null,
            'memo' => 'テスト用メモ',
            'next_action' => '書類選考結果待ち',
            'document_result' => '未対応',
            'first_interview_result' => '未対応',
            'second_interview_result' => '未対応',
            'final_result' => '未対応',
            'rejection_stage' => null,
        ];
    }
}
