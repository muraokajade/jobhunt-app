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

// 応募企業情報を管理するAPIコントローラー。
// 企業一覧取得、詳細取得、登録、更新、削除を担当する。
class CompanyController extends Controller
{
    /**
     * 企業一覧を取得するメソッド。
     * keyword / status / media のクエリパラメータを受け取り、条件に合う企業一覧を返す。
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Company::query();

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
            // statusが指定された場合、選考状況が一致する企業だけに絞り込む。
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('media')) {
            // mediaが指定された場合、応募媒体が一致する企業だけに絞り込む。
            $query->where('media', $request->query('media'));
        }

        // 面談日が入っている企業を優先し、面談日が近い順、その後は作成日が新しい順で並べる。
        $companies = $query
            ->orderByRaw('interview_date IS NULL')
            ->orderBy('interview_date')
            ->orderByDesc('created_at')
            ->get();

        return CompanyResource::collection($companies);
    }

    /**
     * 企業を新規登録するメソッド。
     * StoreCompanyRequestでバリデーション済みのデータだけを保存する。
     */
    public function store(StoreCompanyRequest $request): CompanyResource
    {
        $company = Company::create($request->validated());

        return new CompanyResource($company);
    }

    /**
     * 企業詳細を取得するメソッド。
     * ルートモデルバインディングで取得した企業情報をResource形式で返す。
     */
    public function show(Company $company): CompanyResource
    {
        return new CompanyResource($company);
    }

    /**
     * 企業情報を更新するメソッド。
     * UpdateCompanyRequestでバリデーション済みのデータを使い、PUT全体更新として保存する。
     */
    public function update(UpdateCompanyRequest $request, Company $company): CompanyResource
    {
        $company->update($request->validated());

        return new CompanyResource($company);
    }

    /**
     * 企業情報を削除するメソッド。
     * 削除後はフロント側でtoast表示しやすいようにmessage付きのJSONを返す。
     */
    public function destroy(Company $company): JsonResponse
    {
        $company->delete();

        return response()->json([
            'message' => '会社を削除しました。',
        ]);
    }
}
