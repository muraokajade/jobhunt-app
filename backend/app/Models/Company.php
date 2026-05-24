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
        'user_id',
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
        'is_favorite'

    ];

    /**
     * 型変換するカラム一覧。
     * 日付・日時・真偽値をLaravel側で適切な型として扱う。
     *
     * @var array<string, string>
     */
    protected $cats = [
        'is_favorite' => 'boolean',
        'applied_date' => 'date',
        'interview_date' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
