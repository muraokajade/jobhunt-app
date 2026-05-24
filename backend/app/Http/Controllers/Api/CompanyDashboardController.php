<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Models\Company;

class CompanyDashboardController extends Controller
{
    /**
     * Dashboard表示用の集計データを返すメソッド。
     *
     * このメソッドは、企業の登録・更新・削除は行わない。
     * companiesテーブルに保存されている企業データを読み取り、
     * Dashboardに表示したい件数情報だけをJSONで返す。
     */
    public function index()
    {
        // companiesテーブルの全企業データを取得する。
        // 戻り値はLaravelのCollectionになる。
        // Reactでいう配列のように、count() や where() や filter() が使える。
        $companies = Company::all();


        // 面談予定として扱う企業一覧。
        // statusが「面談予定」、または面談日が登録されている企業を対象にする。
        $interviewCompanies = $companies->filter(function ($company) {
            return $company->status === '面談予定'
                || $company->interview_date !== null;
        });



        // 確認待ちとして扱う企業一覧。
        // 応募済み・書類選考待ち・日程調整中・面談後返答待ちを対象にする。
        $waitingCompanies = $companies->filter(function ($company) {
            return in_array($company->status, [
                '応募済み',
                '書類選考待ち',
                '面談日程調整中',
                '面談後返答待ち',
            ]);
        });

        // 高優先度として扱う企業一覧。
        // priorityが4.0以上の企業を対象にする。
        $highPriorityCompanies = $companies->filter(function ($company) {
            return (float) $company->priority >= 4.0;
        });

        // Dashboard画面で使う集計結果をJSON形式で返す。
        // response()->json() は、配列をJSONレスポンスに変換して返すLaravelの関数。
        return response()->json([
            'summary' => [
                // 登録されている企業の総数。
                'total' => $companies->count(),

                // 面談予定企業数。
                // statusが「面談予定」、または面談日が登録されている企業を数える。
                'interview' => $interviewCompanies->count(),

                // 確認待ち企業数。
                // 応募済み・書類選考待ち・日程調整中・面談後返答待ちを対象にする。
                'waiting' => $waitingCompanies->count(),
                // 内定企業数。
                'offer' => $companies->where('status', '内定')->count(),

                // 落選企業数。
                'rejected' => $companies->where('status', '落選')->count(),

                // 高優先度企業数。
                // priorityが4.0以上の企業を数える。
                // 高優先度企業数。
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
