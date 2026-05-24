<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CompanyDashboardController extends Controller
{
    /**
     * Dashboard表示用の集計データを返す。
     * ログイン中ユーザー本人の企業データだけを集計対象にする。
     */
    public function index(): JsonResponse
    {
        // ログイン中ユーザーのIDを取得する。
        $userId = Auth::id();

        // 自分の企業だけ取得する。
        // Company::all() は他人の企業も混ざるため使わない。
        $companies = Company::where('user_id', $userId)->get();

        // 面談予定として扱う企業一覧。
        $interviewCompanies = $companies->filter(function ($company) {
            return $company->status === '面談予定'
                || $company->interview_date !== null;
        });

        // 確認待ちとして扱う企業一覧。
        $waitingCompanies = $companies->filter(function ($company) {
            return in_array($company->status, [
                '応募済み',
                '書類選考待ち',
                '面談日程調整中',
                '面談後返答待ち',
            ]);
        });

        // 高優先度として扱う企業一覧。
        $highPriorityCompanies = $companies->filter(function ($company) {
            return (float) $company->priority >= 4.0;
        });

        return response()->json([
            'summary' => [
                'total' => $companies->count(),
                'interview' => $interviewCompanies->count(),
                'waiting' => $waitingCompanies->count(),
                'offer' => $companies->where('status', '内定')->count(),
                'rejected' => $companies->where('status', '落選')->count(),
                'highPriority' => $highPriorityCompanies->count(),
            ],
            'actionLists' => [
                'interviews' => CompanyResource::collection(
                    $interviewCompanies
                        ->sortBy('interview_date')
                        ->take(3)
                        ->values()
                )->resolve(),

                'waiting' => CompanyResource::collection(
                    $waitingCompanies
                        ->sortBy('applied_date')
                        ->take(3)
                        ->values()
                )->resolve(),

                'highPriority' => CompanyResource::collection(
                    $highPriorityCompanies
                        ->sortByDesc('priority')
                        ->take(3)
                        ->values()
                )->resolve(),
            ],
        ]);
    }
}
