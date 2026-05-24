<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// 企業情報APIのレスポンス形式を定義するResourceクラス。
// DB・Laravel側のsnake_caseカラムを、React側で扱いやすいcamelCaseに変換する。
class CompanyResource extends JsonResource
{
    /**
     * CompanyモデルをAPIレスポンス用の配列に変換するメソッド。
     * フロントエンドではこの形式をCompany型として受け取り、一覧・詳細・編集に利用する。
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'media' => $this->media,
            'priority' => $this->priority,
            'status' => $this->status,
            'appliedDate' => $this->applied_date,
            'interviewDate' => $this->interview_date,
            'jobUrl' => $this->job_url,
            'interviewUrl' => $this->interview_url,
            'memo' => $this->memo,
            'nextAction' => $this->next_action,
            'documentResult' => $this->document_result,
            'firstInterviewResult' => $this->first_interview_result,
            'secondInterviewResult' => $this->second_interview_result,
            'finalResult' => $this->final_result,
            'rejectionStage' => $this->rejection_stage,
            'isFavorite' => $this->is_favorite,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
