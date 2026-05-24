# docs/01_design/Favorite設計.md

## 更新日

2026/05/24

---

# 1. 概要

JobHunt Liteでは、企業一覧に「いいね」機能を追加している。

この「いいね」は、SNSのように他人の投稿に反応する機能ではない。

自分が登録した応募企業の中で、以下のような企業をマーキングするための機能である。

- 気になる企業
- 本命候補
- 後で重点的に確認したい企業
- 優先的に追いたい企業

そのため、別でlikesテーブルを作るのではなく、companiesテーブルにis_favoriteカラムを持たせる設計にする。

---

# 2. 目的

Favorite機能の目的は、ユーザーが重要な企業を一目で見分けられるようにすることである。

転職活動では、すべての応募企業を同じ温度感で管理するわけではない。

志望度が高い企業、返信待ちで追いたい企業、面談準備が必要な企業などを視覚的に区別するため、いいね機能を用意する。

---

# 3. 完成イメージ

企業一覧でハートボタンを押すと、以下のように状態が切り替わる。

    未いいね
    ↓
    ハートを押す
    ↓
    いいね済み
    ↓
    もう一度押す
    ↓
    未いいねに戻る

画面上では以下のように表示する。

    未いいね企業
    → 白抜きハート

    いいね済み企業
    → 赤いハート
    → 行背景を黄色寄りにする
    → 「注目」バッジを表示する

    落選企業
    → 赤系表示を優先する

---

# 4. なぜlikesテーブルを作らないのか

今回のJobHunt Liteでは、企業データはログインユーザー本人のものである。

構造は以下。

    users
      └ companies
          └ is_favorite

この場合、「いいね」は他人の投稿に対するリアクションではない。

自分の企業データに対して、以下のような目印を付けるだけである。

    この企業は気になる
    この企業は本命
    この企業は後で確認したい

そのため、likesテーブルを作るよりも、companiesテーブルにis_favoriteを持たせる方がシンプルである。

---

# 5. likesテーブルが必要になるケース

likesテーブルが必要になるのは、複数ユーザーが同じ求人データに対して「いいね」するようなケースである。

例。

    users
    jobs
    likes

この場合は、以下のような多対多の関係になる。

    1人のユーザーが複数の求人にいいねできる
    1つの求人に複数のユーザーがいいねできる
    users と jobs が多対多になる

そのため、likesテーブルが必要になる。

しかし、JobHunt Liteは以下の前提である。

    企業データはユーザー本人専用
    他人と共有しない
    多対多ではない

そのため、今回はcompanies.is_favoriteで十分である。

---

# 6. DB設計

## 6.1 追加カラム

対象テーブルはcompaniesである。

| カラム名    | 型      | デフォルト | 用途       |
| ----------- | ------- | ---------- | ---------- |
| is_favorite | boolean | false      | いいね状態 |

migrationでは以下のように追加する。

    $table->boolean('is_favorite')
        ->default(false)
        ->after('rejection_stage');

## 6.2 is_favoriteの状態

DB上では以下のように考える。

    is_favorite = false
    → いいねしていない

    is_favorite = true
    → いいね済み

SQLiteやMySQLでは、見え方として以下のようになることもある。

    0
    → false

    1
    → true

React側ではbooleanとして扱いたいため、Laravel側でbooleanにcastする。

---

# 7. Companyモデル設計

## 7.1 fillable

is_favoriteは保存対象なので、Company.phpのfillableに追加する。

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
        'is_favorite',
    ];

## 7.2 fillableが必要な理由

Laravelでは、create()やupdate()で保存できる項目をfillableで制限する。

例えば、Controllerで以下を書いても、

    $company->update([
        'is_favorite' => true,
    ]);

Company.phpのfillableにis_favoriteが入っていないと、保存されないことがある。

つまり、以下のような状態になる。

    Controllerでは更新しているつもり
    でもDBに反映されない

これは初学者が詰まりやすいポイントである。

---

# 8. casts設計

## 8.1 casts

Company.phpでは、is_favoriteをbooleanとして扱うためにcastsを設定する。

    protected $casts = [
        'is_favorite' => 'boolean',
    ];

実際には、日付カラムも含めて以下のように設定する方針である。

    protected $casts = [
        'is_favorite' => 'boolean',
        'applied_date' => 'date',
        'interview_date' => 'datetime',
    ];

## 8.2 castsが必要な理由

DBではis_favoriteが0 / 1で見えることがある。

しかしReact側では以下のように使いたい。

    company.isFavorite ? "赤ハート" : "白抜きハート";

そのため、Laravel側でbooleanとして扱えるようにする。

castsにより、Laravel上では以下のように扱いやすくなる。

    0 → false
    1 → true

---

# 9. CompanyResource設計

## 9.1 目的

CompanyResourceは、Laravel側のデータ形式をReact側で扱いやすい形に整える場所である。

DBではsnake_case、ReactではcamelCaseで扱う。

いいね機能では以下の変換が必要になる。

    is_favorite
    → isFavorite

## 9.2 Resourceで返す値

CompanyResourceでは、以下のように返す。

    'isFavorite' => $this->is_favorite,

または、boolean化を明示する場合は以下。

    'isFavorite' => (bool) $this->is_favorite,

## 9.3 ResourceにisFavoriteがない場合

React側で以下を書いても、

    company.isFavorite;

APIレスポンスにisFavoriteが存在しなければ、値はundefinedになる。

その結果、以下のような問題が発生する。

    ハートを押しているのに赤くならない
    行背景が黄色にならない
    注目バッジが出ない

つまり、ハートボタンの見た目が変わらない原因は、フロントだけではなく、APIレスポンス側にあることもある。

---

# 10. API設計

## 10.1 Endpoint

いいね切り替え用のAPIは以下。

| Method | Endpoint                          | Controller                       | 用途               | 認証 |
| ------ | --------------------------------- | -------------------------------- | ------------------ | ---- |
| PATCH  | /api/companies/{company}/favorite | CompanyController@toggleFavorite | いいね状態切り替え | 必要 |

## 10.2 Route

routes/api.phpでは、auth:sanctum middlewareの中に配置する。

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
        Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
        Route::apiResource('companies', CompanyController::class);
    });

## 10.3 認証が必要な理由

companies系APIはauth:sanctumで守っている。

いいねtoggleも、ログイン中ユーザー本人の企業に対する操作である。

そのため、Bearer Tokenが必要である。

React側ではAPI通信時に以下を付ける。

    Authorization: Bearer {authToken}

---

# 11. ルート順序

## 11.1 固定ルート・特殊ルートはapiResourceより上に書く

Route::apiResource('companies', CompanyController::class) は以下のようなルートを作る。

    GET /companies/{company}
    PUT /companies/{company}
    DELETE /companies/{company}

そのため、固定ルートや特殊ルートはapiResourceより上に書く。

正しい順番は以下。

    Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
    Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
    Route::apiResource('companies', CompanyController::class);

理由は、以下のような特殊ルートをapiResourceの可変ルートに吸われないようにするためである。

    /companies/dashboard
    /companies/{company}/favorite

---

# 12. Backend処理

## 12.1 toggleFavoriteメソッド

CompanyControllerにtoggleFavoriteメソッドを追加する。

    public function toggleFavorite(Company $company): CompanyResource
    {
        abort_unless($company->user_id === Auth::id(), 403);

        $company->is_favorite = ! (bool) $company->is_favorite;
        $company->save();

        return new CompanyResource($company->fresh());
    }

## 12.2 自分の企業か確認する

以下の処理で、対象企業がログイン中ユーザー本人の企業か確認する。

    abort_unless($company->user_id === Auth::id(), 403);

意味は以下。

    この企業のuser_idがログイン中ユーザーIDと一致しなければ、403で止める

これにより、他人の企業をいいねできないようにする。

## 12.3 現在の状態を反転する

以下の処理で、現在のis_favoriteを反転する。

    $company->is_favorite = ! (bool) $company->is_favorite;

意味は以下。

    今 false なら true にする
    今 true なら false にする

具体的には以下。

    false → true
    true → false

## 12.4 保存する

以下の処理で、変更したis_favoriteをDBに保存する。

    $company->save();

## 12.5 最新状態を返す

以下の処理で、DBから最新の会社情報を取り直してReactに返す。

    return new CompanyResource($company->fresh());

fresh()を使うことで、保存後の最新状態を確実に返せる。

---

# 13. なぜupdateではなく代入 + saveにしたのか

最初は以下のように書いていた。

    $company->update([
        'is_favorite' => ! $company->is_favorite,
    ]);

これでも動くことはある。

ただ、今回のように詰まったときは、以下の形の方が分かりやすい。

    $company->is_favorite = ! (bool) $company->is_favorite;
    $company->save();

理由は、以下の流れが見た目に分かりやすいからである。

    現在の値を反転している
    保存している

教材化するなら、こちらの方が説明しやすい。

---

# 14. React側のCompany型

## 14.1 Company型

React側では、Company型にisFavoriteを追加する。

    isFavorite: boolean;

React側では、この値を使ってハートや行背景を切り替える。

    company.isFavorite;

## 14.2 APIと型名を揃える理由

APIではisFavoriteを返しているのに、React側でis_favoriteを見ていると表示は変わらない。

逆に、APIがis_favoriteを返しているのに、ReactでisFavoriteを見ていても表示は変わらない。

名前を揃えることが重要である。

---

# 15. App.tsx設計

## 15.1 toggleCompanyFavorite

App.tsxにいいねtoggle用の関数を用意する。

    async function toggleCompanyFavorite(company: Company) {
      if (!authToken) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/companies/${company.id}/favorite`,
        {
          method: "PATCH",
          headers: createHeaders(authToken),
        },
      );

      if (!response.ok) {
        showToast("お気に入りの更新に失敗しました。");
        return;
      }

      showToast("お気に入りを更新しました。");
      await fetchCompanies();
      await fetchDashboard();
    }

## 15.2 処理の流れ

    ハートボタンを押す
    ↓
    toggleCompanyFavorite(company) が呼ばれる
    ↓
    PATCH /api/companies/{id}/favorite を叩く
    ↓
    Laravel側でis_favoriteを反転する
    ↓
    保存する
    ↓
    一覧とDashboardを再取得する
    ↓
    画面に赤ハート・黄色背景が反映される

## 15.3 Bearer Token

いいねtoggleでもBearer Tokenが必要である。

    headers: createHeaders(authToken);

createHeadersの中では以下を付ける。

    Authorization: Bearer {authToken}

これがないと、Laravel側は未ログイン扱いになる。

---

# 16. App.tsxからCompanyTableへ渡す

App.tsxでは、CompanyTableにonToggleFavoriteとして渡す。

    <CompanyTable
      companies={companies}
      loading={loading}
      priorityOptions={priorityOptions}
      statusOptions={statusOptions}
      onPriorityChange={updateCompanyPriority}
      onStatusChange={updateCompanyStatus}
      onOpenDetail={openDetailModal}
      onDelete={deleteCompany}
      onToggleFavorite={toggleCompanyFavorite}
    />

これを渡さないと、CompanyTable側でハートボタンを押しても処理が呼べない。

---

# 17. CompanyTable.tsx設計

## 17.1 props

CompanyTableのprops型にonToggleFavoriteを追加する。

    type CompanyTableProps = {
      companies: Company[];
      loading: boolean;
      priorityOptions: Option[];
      statusOptions: string[];
      onPriorityChange: (company: Company, priority: string) => void;
      onStatusChange: (company: Company, status: string) => void;
      onOpenDetail: (company: Company) => void;
      onDelete: (id: number) => void;
      onToggleFavorite: (company: Company) => void;
    };

分割代入でも受け取る。

    function CompanyTable({
      companies,
      loading,
      priorityOptions,
      statusOptions,
      onPriorityChange,
      onStatusChange,
      onOpenDetail,
      onDelete,
      onToggleFavorite,
    }: CompanyTableProps) {

## 17.2 ハートボタン

企業名セルにハートボタンを置く。

    <button
      type="button"
      onClick={() => onToggleFavorite(company)}
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
        company.isFavorite
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-slate-300 bg-white text-slate-400 hover:bg-slate-50",
      ].join(" ")}
      aria-label="お気に入り切り替え"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={company.isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>

---

# 18. ハートSVGの仕組み

重要なのは以下。

    fill={company.isFavorite ? "currentColor" : "none"}

意味は以下。

    company.isFavorite が true
    → fill="currentColor"
    → 赤く塗りつぶされたハート

    company.isFavorite が false
    → fill="none"
    → 白抜きハート

色はclassName側で指定している。

    company.isFavorite
      ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
      : "border-slate-300 bg-white text-slate-400 hover:bg-slate-50";

text-red-500がcurrentColorとしてSVGに使われる。

---

# 19. 行背景の色分け

CompanyTableでは、行のclassを条件で切り替える。

    const isRejected = company.status === "落選";

    const rowClass = isRejected
      ? "bg-red-50 text-red-800/70 hover:bg-red-100"
      : company.isFavorite
        ? "bg-amber-50 text-slate-800 hover:bg-amber-100"
        : "bg-white text-slate-700 hover:bg-slate-50";

意味は以下。

    落選企業
    → 赤系表示

    いいね済み企業
    → 黄色系表示

    通常企業
    → 白背景

---

# 20. 表示優先度

今回の表示優先度は以下。

    1. 落選
    2. いいね
    3. 通常

理由は以下。

    落選は選考終了状態として強く区別したい
    いいねは注目企業として目立たせたい
    通常企業は白背景でよい

そのため、落選企業がいいね済みでも、赤系表示を優先する。

---

# 21. 注目バッジ

いいね済み企業には「注目」バッジを出す。

    {
      company.isFavorite && !isRejected && (
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
          注目
        </span>
      );
    }

!isRejectedを付けている理由は、落選企業では「落選」バッジを優先したいためである。

---

# 22. 落選バッジ

落選企業には「落選」バッジを出す。

    {
      isRejected && (
        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
          落選
        </span>
      );
    }

---

# 23. 今回詰まった原因

いいね機能が最初うまく動かなかった原因は、1つではなく複数あった。

主な原因は以下。

- DBにはis_favoriteがあるが、ResourceでisFavoriteを返していなかった可能性
- Company型にisFavoriteが不足していた可能性
- App.tsxからCompanyTableへonToggleFavoriteを渡していなかった可能性
- CompanyTable側のprops受け取りが不足していた可能性
- PATCH後にfetchDashboardが失敗してfetchCompaniesまで行かなかった可能性
- routes/api.phpのルート重複で正しいルートに当たっていなかった可能性
- routes/api.phpにHTMLコメントが混ざってJSONパースエラーになっていた
- Sanctum導入後にBearer Tokenが付いていないAPI通信があった

---

# 24. 切り分け方法

## 24.1 ボタンが押されているか確認する

toggleCompanyFavoriteの先頭にログを入れる。

    console.log("favorite clicked", company);

これが出れば、クリック処理は通っている。

## 24.2 PATCH APIが成功しているか見る

ブラウザのDevToolsのNetworkで確認する。

    PATCH /api/companies/{id}/favorite

ステータスが200なら、API自体は成功している。

## 24.3 PATCHレスポンスを見る

レスポンスに以下があるか確認する。

    {
      "isFavorite": true
    }

または、Resourceの形によってはdataの中を見る。

    {
      "data": {
        "isFavorite": true
      }
    }

## 24.4 一覧APIを確認する

GET /api/companies のレスポンスに以下があるか確認する。

    {
      "isFavorite": true
    }

ここでisFavoriteがないなら、Resourceが不足している。

ここでisFavorite: falseのままなら、DB更新ができていない。

## 24.5 CompanyTableの表示条件を見る

CompanyTable側で以下を使っているか確認する。

    company.isFavorite;

APIではisFavoriteなのに、Reactでis_favoriteを見ていると表示は変わらない。

逆に、APIがis_favoriteを返しているのに、ReactでisFavoriteを見ていても表示は変わらない。

名前を揃えることが重要である。

---

# 25. BackendからFrontendまでの流れ

いいね機能は、以下が全部つながって初めて動く。

    DB
    companies.is_favorite
    ↓
    Model
    Company.php の fillable / casts
    ↓
    Controller
    toggleFavorite()
    ↓
    Route
    PATCH /api/companies/{company}/favorite
    ↓
    Resource
    is_favorite → isFavorite
    ↓
    API Response
    isFavorite: true / false
    ↓
    TypeScript
    Company.isFavorite
    ↓
    App.tsx
    toggleCompanyFavorite()
    ↓
    CompanyTable.tsx
    onToggleFavorite
    ↓
    UI
    赤ハート / 白抜きハート / 黄色背景

---

# 26. 初学者向け説明ポイント

「いいね機能」と聞くと、フロント側でハートボタンを作れば終わりに見える。

しかし、実際には以下が必要である。

- DBに保存する場所
- Laravelで更新するAPI
- ReactでAPIを叩く処理
- APIレスポンスの形式
- TypeScriptの型
- 表示条件

どこか1つでも抜けると、以下のような状態になる。

    ボタンは押せる
    でも色が変わらない
    リロードすると戻る
    DBに保存されていない

---

# 27. 最終理解

いいね機能は、単なるUIではない。

以下の一連の流れを作る機能である。

    ハートを押す
    ↓
    ReactがPATCH APIを叩く
    ↓
    Laravelがログインユーザー本人の企業か確認する
    ↓
    is_favoriteを反転する
    ↓
    DBに保存する
    ↓
    ResourceでisFavoriteとして返す
    ↓
    Reactが一覧を再取得する
    ↓
    CompanyTableがisFavoriteを見て表示を変える

---

# 28. 一言まとめ

JobHunt Liteのいいね機能は、companies.is_favoriteを使って、自分の応募企業を「注目企業」としてマーキングする機能である。

実装では、Backendのis_favoriteとFrontendのisFavoriteをCompanyResourceでつなぎ、PATCH /api/companies/{company}/favorite でtrue / falseを反転させる。

最終的に重要なのは以下。

    companies.is_favorite
    → CompanyResource の isFavorite
    → TypeScript の Company.isFavorite
    → App.tsx の toggleCompanyFavorite
    → CompanyTable.tsx のハート表示

この流れが一本につながると、ハートのトグル、DB保存、UI反映が正しく動く。
