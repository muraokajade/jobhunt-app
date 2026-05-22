<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{


    public function index(Request $request)
    {
        $query = Company::query();

        if ($request->filled('keyword')) {
            $keyword = $request->query('keyword');

            //クエリに条件足していく
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('memo', 'like', "%{$keyword}%")
                    ->orWhere('next_action', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status')); //$query->requestと書いてしまった。
        }

        if ($request->filled('media')) {
            $query->where('media', $request->query('media'));
        }

        //ここの細かいメソッドは未完成理解
        $companies = $query
            // ->orderByRaw('interview') これなんか書いてしまった。....
            ->orderByRaw('interview_date IS NULL')
            ->orderBy('interview_date')
            ->orderByDesc('created_at')
            ->get();

        // ResourceにするとjsonになってるからReactで安全なデータとして受け取れる的な?
        return CompanyResource::collection($companies);
    }

    //一件データ保存っていう意味なんだろうが、$request->validated()、どこでばりしてるんだっけ
    public function store(StoreCompanyRequest $request)
    {
        $company = Company::create($request->validated());

        return new CompanyResource($company);
    }


    public function show(Company $company)
    {
        return new CompanyResource($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {
        //$query = と手が勝手に動いた

        //正解
        $company->update($request->validated());

        return new CompanyResource($company);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json([
            'message' => '会社を削除しました。',
        ]);
    }
}
