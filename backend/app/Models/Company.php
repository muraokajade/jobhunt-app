<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * 応募企業情報を表すEloquentモデル。
 * 企業名、媒体、選考状況、面談URL、選考結果、落選段階などを管理する。
 */
class Company extends Model
{

    use HasFactory;

    /**
     * 一括代入を許可するカラム一覧。
     * Controllerのcreate/updateで受け取った検証済みデータを保存するために使う。
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'media',
        'priority',
        'status',
        'applied_date',
        'interview_date',
        'job_url',
        'interview_url',
        'memo',
        'next_action',
        'document_result',
        'first_interview_result',
        'second_interview_result',
        'final_result',
        'rejection_stage',

    ];
}
