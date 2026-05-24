<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

// 応募企業情報を管理するAPIコントローラー。
// 企業一覧取得、詳細取得、登録、更新、削除、お気に入り切り替えを担当する。
class CompanyController extends Controller
{
    /**
     * 企業一覧を取得するメソッド。
     * ログイン中ユーザー本人の企業だけを取得する。
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // 自分の企業だけを対象にする。
        $query = Company::query()
            ->where('user_id', Auth::id());

        if ($request->filled('keyword')) {
            $keyword = $request->query('keyword');

            // keywordが指定された場合、企業名・メモ・次アクションを部分一致で検索する。
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('memo', 'like', "%{$keyword}%")
                    ->orWhere('next_action', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('media')) {
            $query->where('media', $request->query('media'));
        }

        $companies = $query
            ->orderByRaw('interview_date IS NULL')
            ->orderBy('interview_date')
            ->orderByDesc('created_at')
            ->get();

        return CompanyResource::collection($companies);
    }

    /**
     * 企業を新規登録するメソッド。
     * 登録時にログイン中ユーザーのIDをuser_idへセットする。
     */
    public function store(StoreCompanyRequest $request): CompanyResource
    {
        $data = $request->validated();

        // 登録企業をログイン中ユーザー本人に紐づける。
        $data['user_id'] = Auth::id();

        $company = Company::create($data);

        return new CompanyResource($company);
    }

    /**
     * 企業詳細を取得するメソッド。
     * 他ユーザーの企業は取得できない。
     */
    public function show(Company $company): CompanyResource
    {
        abort_unless($company->user_id === Auth::id(), 403);

        return new CompanyResource($company);
    }

    /**
     * 企業情報を更新するメソッド。
     * 他ユーザーの企業は更新できない。
     */
    public function update(UpdateCompanyRequest $request, Company $company): CompanyResource
    {
        abort_unless($company->user_id === Auth::id(), 403);

        $company->update($request->validated());

        return new CompanyResource($company->fresh());
    }

    /**
     * 企業情報を削除するメソッド。
     * 他ユーザーの企業は削除できない。
     */
    public function destroy(Company $company): JsonResponse
    {
        abort_unless($company->user_id === Auth::id(), 403);

        $company->delete();

        return response()->json([
            'message' => '会社を削除しました。',
        ]);
    }

    /**
     * 企業のお気に入り状態を切り替える。
     * 他ユーザーの企業は操作できない。
     */
    public function toggleFavorite(Company $company): CompanyResource
    {
        abort_unless($company->user_id === Auth::id(), 403);

        $company->is_favorite = ! (bool) $company->is_favorite;
        $company->save();

        return new CompanyResource($company->fresh());
    }
}
