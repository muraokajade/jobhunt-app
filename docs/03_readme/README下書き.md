# docs/03_readme/README下書き.md

# JobHunt Lite

JobHunt Liteは、Laravel × React / TypeScriptで作成した転職活動管理アプリです。

自分の応募企業、選考状況、次アクション、面談URL、求人URL、選考結果を一画面で管理できます。

もともとはLaravel復習用のTaskLogから始まり、自分が実際に使っていたExcel転職ログをWebアプリ化する方向で発展しました。

現在は、単なるCRUDアプリではなく、認証、ユーザー別データ管理、Dashboard API、いいね機能、Feature Testまで含めた実務寄りポートフォリオとして整理しています。

---

## 主な機能

- ユーザー登録
- ログイン
- ログアウト
- Bearer Token認証
- ログインユーザー別の企業管理
- 企業登録
- 企業一覧表示
- 企業検索
- status絞り込み
- media絞り込み
- priority更新
- status更新
- 詳細モーダル編集
- 企業削除
- いいね切り替え
- SummaryCards表示
- ActionLists表示
- Dashboard API
- Feature Test 15pass

---

## 使用技術

### Backend

- PHP
- Laravel
- Laravel Sanctum
- Eloquent ORM
- FormRequest
- API Resource
- Feature Test
- PHPUnit

### Frontend

- React
- TypeScript
- Tailwind CSS
- Fetch API
- localStorage

### Database

- MySQL または SQLite
- users
- companies

---

## 画面概要

JobHunt Liteは、1画面完結型のSPAとして構成しています。

ログイン前は、ログイン / ユーザー登録画面を表示します。

ログイン後は、以下の画面要素を表示します。

1. AppHeader
2. Hero / 操作エリア
3. SummaryCards
4. SearchForm
5. ActionLists
6. CompanyRegisterForm または CompanyTable
7. CompanyDetailModal

---

## 企業登録

初回登録では、応募直後に分かる最低限の情報だけを入力します。

- 企業名
- 媒体
- 志望度
- 求人URL
- メモ

登録後は、企業一覧へ自動で戻り、追加された企業をすぐ確認できます。

---

## 詳細モーダル編集

選考が進んだ後の情報は、詳細モーダルで編集します。

- status
- priority
- 応募日
- 面談日
- 求人URL
- 面談URL
- 次アクション
- 書類選考結果
- 1次面接結果
- 2次面接結果
- 最終結果
- 落選段階
- メモ

選考結果で「不通過」を選択した場合は、statusとrejection_stageを自動補助します。

---

## Dashboard API

Dashboard APIでは、SummaryCardsとActionListsで利用する集計データを返します。

Endpoint:

    GET /api/companies/dashboard

返却内容:

- summary
- actionLists

summary:

- total
- interview
- waiting
- offer
- rejected
- highPriority

actionLists:

- interviews
- waiting
- highPriority

集計処理はLaravel側に寄せ、React側は表示責務に集中する構成にしています。

---

## いいね機能

企業一覧では、企業ごとにいいねを切り替えられます。

このいいねはSNS的なリアクションではなく、自分の応募企業を注目企業としてマーキングするための機能です。

そのため、likesテーブルは作らず、companiesテーブルにis_favoriteを持たせています。

流れ:

    ハートを押す
    ↓
    PATCH /api/companies/{company}/favorite
    ↓
    Laravel側でis_favoriteを反転
    ↓
    CompanyResourceでisFavoriteとして返却
    ↓
    React側でハート表示・背景色を更新

---

## 認証設計

JobHunt Liteでは、Laravel SanctumによるBearer Token認証を導入しています。

認証不要API:

- POST /api/register
- POST /api/login

認証必須API:

- GET /api/me
- POST /api/logout
- GET /api/companies
- POST /api/companies
- GET /api/companies/{company}
- PUT /api/companies/{company}
- DELETE /api/companies/{company}
- GET /api/companies/dashboard
- PATCH /api/companies/{company}/favorite

ログイン中ユーザーIDはAuth::id()で取得し、企業データをuser_idで紐づけています。

---

## DB設計

中心テーブルはcompaniesです。

主なカラム:

- id
- user_id
- name
- media
- priority
- status
- applied_date
- interview_date
- job_url
- interview_url
- memo
- next_action
- document_result
- first_interview_result
- second_interview_result
- final_result
- rejection_stage
- is_favorite
- created_at
- updated_at

users 1 : N companies の関係で、ログイン中ユーザー本人の企業だけを操作対象にします。

---

## CompanyResource

Laravel側ではsnake_case、React側ではcamelCaseを使います。

その変換をCompanyResourceで行います。

例:

- applied_date → appliedDate
- interview_date → interviewDate
- job_url → jobUrl
- interview_url → interviewUrl
- next_action → nextAction
- document_result → documentResult
- first_interview_result → firstInterviewResult
- second_interview_result → secondInterviewResult
- final_result → finalResult
- rejection_stage → rejectionStage
- is_favorite → isFavorite

これにより、React側でCompany型として扱いやすくしています。

---

## テスト

現在、Feature Testは15passです。

CompanyApiTest:

- 企業登録
- name必須バリデーション
- 不正URLバリデーション
- 企業更新
- 不正statusバリデーション
- 企業削除
- keyword検索
- status絞り込み
- media絞り込み
- keyword + status複合検索
- PUT全体更新で既存項目が消えないこと

CompanyDashboardApiTest:

- Dashboard summary取得
- 高優先度企業リスト取得
- 面談予定企業リスト取得
- 確認待ち企業リスト取得

---

## 今後の改善予定

- Sanctum認証前提のFeature Test追加
- 他ユーザーの企業を操作できないテスト追加
- Favorite APIテスト追加
- Dashboard APIで他ユーザー企業が混ざらないテスト追加
- AppHeaderへauthUser / logout props連携
- SummaryCardsに高優先度カード追加
- API_BASE_URLの環境変数化
- バリデーションエラー詳細表示
- Googleカレンダー連携
- 通知機能
- AIによる応募状況分析
- JobHunt Proへの拡張

---

## 学習・設計ポイント

このアプリでは、以下を重点的に整理しています。

- Laravel API設計
- FormRequestによるバリデーション分離
- CompanyResourceによるレスポンス整形
- React / TypeScriptの型設計
- 親コンポーネントと子コンポーネントの責務分離
- Bearer Token認証
- user_idによるデータ分離
- Feature Test
- Dashboard API設計
- 実務寄りCRUD設計

---

## 一言まとめ

JobHunt Liteは、転職活動を管理する実用的なLaravel × Reactアプリです。

単なるTodoアプリではなく、認証、ユーザー別データ、Dashboard、いいね、詳細モーダル、Feature Testまで含めることで、実務に近いWebアプリ構成を意識して作成しています。

---

# docs/03_readme/GitHub説明文.md

# GitHub説明文

Laravel × React / TypeScriptで作成した転職活動管理アプリです。

企業CRUD、検索・絞り込み、詳細モーダル編集、Dashboard API、いいね機能、ログイン / ログアウト / 登録、Laravel SanctumによるBearer Token認証、user_idによるユーザー別企業管理、Feature Test 15passまで実装しています。

---

## 短文版

Laravel × React / TypeScriptで作成した転職活動管理アプリ。企業CRUD、検索、Dashboard、いいね、認証、ユーザー別データ管理、Feature Testまで実装。

---

## 技術強調版

Laravel API、React / TypeScript、Laravel Sanctum、FormRequest、CompanyResource、Feature Testを用いた転職活動管理アプリ。企業CRUD、Dashboard API、いいね、認証、user_id紐づけを実装。

---

## ポートフォリオ向け版

実際の転職活動ログをもとに作成した、Laravel × React / TypeScriptの実務寄りポートフォリオです。企業管理、検索、詳細編集、Dashboard、いいね、認証、ユーザー別データ管理、Feature Testを実装しています。

---

# docs/03_readme/ポートフォリオ説明文.md

# ポートフォリオ説明文

## 概要

JobHunt Liteは、Laravel × React / TypeScriptで作成した転職活動管理アプリです。

自分が実際に転職活動で使っていたExcelログをもとに、応募企業、選考状況、次アクション、面談URL、求人URL、選考結果をWebアプリ上で管理できるようにしました。

単なるCRUDアプリではなく、認証、ユーザー別データ管理、Dashboard API、いいね機能、詳細モーダル、Feature Testまで含めて、実務に近い構成を意識しています。

---

## 作成背景

転職活動では、応募企業数が増えるほど、現在の選考状況や次にやるべきことが分かりづらくなります。

NotionやExcelでも管理できますが、以下のような課題があります。

- 応募企業が増えると一覧性が落ちる
- 次アクションが埋もれる
- 面談URLや求人URLを探すのに時間がかかる
- 選考状況の集計が面倒
- 重要企業を目立たせにくい
- 落選企業の原因を後から追いづらい

そこで、転職活動専用の軽量CRMとしてJobHunt Liteを作成しました。

---

## 工夫した点

## 1. 初回登録と詳細編集を分けた

初回登録では、企業名、媒体、志望度、求人URL、メモだけを入力します。

選考が進んだ後の詳細情報は、詳細モーダルで編集します。

これにより、登録フォームを重くしすぎず、実際の転職活動の流れに合わせた設計にしました。

---

## 2. Dashboard APIをLaravel側に寄せた

SummaryCardsやActionListsで使う集計処理は、React側ではなくLaravel側に寄せました。

これにより、集計ロジックをバックエンドで管理でき、Feature Testで保証しやすい構成にしています。

---

## 3. CompanyResourceでレスポンス形式を統一した

Laravel側はsnake_case、React側はcamelCaseで扱います。

そのため、CompanyResourceでAPIレスポンスをReact向けに整形しています。

この設計により、CompanyTable、CompanyDetailModal、ActionListsで同じCompany型を使えるようにしました。

---

## 4. 認証とuser_id紐づけを導入した

Laravel SanctumによるBearer Token認証を導入し、ログイン中ユーザー本人の企業だけを表示・操作できるようにしました。

一覧取得、更新、削除、いいね、Dashboard集計では、Auth::id()を使ってログイン中ユーザーのデータだけを対象にしています。

---

## 5. Feature Testを作成した

CompanyApiTestとCompanyDashboardApiTestを作成し、現在15passしています。

CRUD、バリデーション、検索・絞り込み、Dashboard summary、actionListsをテストしています。

今後は認証・user_id・Favorite APIのテストも追加予定です。

---

## 使用技術

- Laravel
- PHP
- Laravel Sanctum
- React
- TypeScript
- Tailwind CSS
- MySQL / SQLite
- PHPUnit
- Feature Test

---

## 実装機能

- ユーザー登録
- ログイン
- ログアウト
- 企業登録
- 企業一覧
- 企業検索
- status絞り込み
- media絞り込み
- priority更新
- status更新
- 詳細モーダル編集
- 企業削除
- いいね切り替え
- SummaryCards
- ActionLists
- Dashboard API
- user_idによるユーザー別企業管理
- Feature Test

---

## 今後の展望

JobHunt Liteは、今後JobHunt Proとして以下の機能へ拡張できます。

- Googleカレンダー連携
- 面談リマインド
- 通知機能
- AIによる応募状況分析
- 落選理由分析
- 媒体別成果分析
- 応募ファネル分析
- CSV / Excelインポート
- 選考履歴ログ
- 求人票構造化

---

## 一言説明

Laravel × React / TypeScriptで作成した、転職活動を一画面で管理する実務寄りポートフォリオです。認証、ユーザー別データ管理、Dashboard API、いいね、Feature Testまで実装しています。

---

# docs/02_udemy/Udemyチャプター構成.md

# Udemyチャプター構成

## 講座タイトル案

Todoアプリより実用的なLaravel × React開発  
転職活動管理アプリJobHunt Liteを作りながら学ぶ実務寄りCRUD・認証・API設計

---

## 講座コンセプト

この講座では、Laravel × React / TypeScriptで転職活動管理アプリを作成する。

一般的なTodoアプリではなく、実際に使える転職活動管理アプリを題材にする。

扱う内容は以下。

- Laravel API
- React / TypeScript
- 企業CRUD
- FormRequest
- CompanyResource
- 検索・絞り込み
- 詳細モーダル
- Dashboard API
- いいね機能
- Laravel Sanctum認証
- user_idによるユーザー別データ管理
- Feature Test
- README / 設計書整理

---

## 教材化方針

最初から完成形を見せすぎない。

まずはControllerベタ書きに近い最小CRUDを作り、その後でFormRequestやCompanyResourceに分離する。

理由は、初学者が以下で詰まりやすいため。

- いきなりFormRequestが出ると責務が見えづらい
- Resourceの必要性が分かりづらい
- React側の型とLaravel側のDBカラムの対応が混乱しやすい
- 認証を先に入れるとCRUDの理解が重くなる

そのため、講座では以下の順番で進める。

    最小CRUD
    ↓
    バリデーション分離
    ↓
    レスポンス整形
    ↓
    React接続
    ↓
    検索・詳細編集
    ↓
    Dashboard
    ↓
    いいね
    ↓
    認証
    ↓
    Test
    ↓
    README / 設計整理

---

## Chapter 1：講座概要

### 目的

講座で作るアプリの全体像を説明する。

### 内容

- JobHunt Liteとは
- Todoアプリではなく転職活動管理アプリを作る理由
- 完成イメージ
- 使用技術
- 学習できること
- 講座の進め方

---

## Chapter 2：Laravel環境構築

### 目的

Laravel API開発環境を用意する。

### 内容

- Laravelプロジェクト作成
- .env設定
- DB接続
- php artisan serve
- APIルート確認
- CORSの基本確認

---

## Chapter 3：companiesテーブル設計

### 目的

応募企業情報を保存するDBを作る。

### 内容

- companiesテーブルの役割
- migration作成
- name
- media
- priority
- status
- applied_date
- interview_date
- job_url
- interview_url
- memo
- next_action
- document_result
- first_interview_result
- second_interview_result
- final_result
- rejection_stage
- is_favorite
- user_id

---

## Chapter 4：Controllerで最小CRUD

### 目的

まずはLaravelだけで企業CRUD APIを作る。

### 内容

- Companyモデル作成
- CompanyController作成
- index
- store
- show
- update
- destroy
- routes/api.php
- Postman / Insomniaで確認

---

## Chapter 5：FormRequestへ分離

### 目的

バリデーションをControllerから分離する。

### 内容

- StoreCompanyRequest
- UpdateCompanyRequest
- name必須
- URL形式チェック
- status許可値
- priority許可値
- Rule::in
- Controllerを薄くする理由

---

## Chapter 6：Resourceでレスポンス整形

### 目的

Laravel側のsnake_caseをReact側のcamelCaseへ変換する。

### 内容

- CompanyResource作成
- applied_date → appliedDate
- interview_date → interviewDate
- job_url → jobUrl
- next_action → nextAction
- is_favorite → isFavorite
- Resourceがないと何が困るか

---

## Chapter 7：React環境構築

### 目的

React / TypeScript側の開発環境を作る。

### 内容

- Vite React TypeScript
- Tailwind CSS
- ディレクトリ構成
- API_BASE_URL
- 型定義
- Company型
- CompanyForm型

---

## Chapter 8：Reactで企業一覧表示

### 目的

Laravel APIから企業一覧を取得して表示する。

### 内容

- fetchCompanies
- useState
- useEffect
- CompanyTable
- loading表示
- データなし表示
- props設計

---

## Chapter 9：企業登録フォーム

### 目的

Reactから企業登録できるようにする。

### 内容

- CompanyRegisterForm
- form state
- setForm
- onCreate
- POST /api/companies
- 登録成功後に一覧再取得
- 登録後に一覧画面へ戻す

---

## Chapter 10：検索・絞り込み

### 目的

keyword / status / mediaで企業を探せるようにする。

### 内容

- SearchForm
- URLSearchParams
- keyword検索
- status絞り込み
- media絞り込み
- 複合検索
- Laravel側のquery構築

---

## Chapter 11：詳細モーダル

### 目的

一覧に出しきれない詳細情報を編集できるようにする。

### 内容

- CompanyDetailModal
- selectedCompany
- detailForm
- openDetailModal
- closeDetailModal
- PUT /api/companies/{id}
- URL情報
- 選考結果
- メモ
- 日時変換

---

## Chapter 12：インライン更新

### 目的

一覧上でpriority / statusを更新できるようにする。

### 内容

- onPriorityChange
- onStatusChange
- buildCompanyRequestBody
- PUT全体更新
- 既存項目を消さない工夫
- 更新後の再取得

---

## Chapter 13：Dashboard API

### 目的

応募状況を集計して表示する。

### 内容

- CompanyDashboardController
- GET /api/companies/dashboard
- summary
- actionLists
- SummaryCards
- ActionLists
- Laravel側に集計を寄せる理由
- actionListsにもCompanyResourceを通す理由

---

## Chapter 14：いいね機能

### 目的

注目企業をマーキングできるようにする。

### 内容

- is_favorite
- PATCH /api/companies/{company}/favorite
- toggleFavorite
- CompanyResourceのisFavorite
- Company型のisFavorite
- CompanyTableのハートボタン
- 行背景の切り替え
- 注目バッジ
- likesテーブルを作らない理由

---

## Chapter 15：Login / Sanctum

### 目的

ユーザーごとに企業データを分ける。

### 内容

- Laravel Sanctum
- register
- login
- logout
- /api/me
- Bearer Token
- localStorage
- auth:sanctum middleware
- Auth::id()
- user_id保存
- 自分の企業だけ取得
- Company::all()がダメな理由

---

## Chapter 16：Feature Test

### 目的

APIが期待通り動くことをテストで保証する。

### 内容

- RefreshDatabase
- CompanyFactory
- CompanyApiTest
- CompanyDashboardApiTest
- assertCreated
- assertOk
- assertStatus
- assertDatabaseHas
- assertJsonValidationErrors
- assertJsonPath
- assertJsonCount
- 認証導入後のテスト修正方針

---

## Chapter 17：README / 設計書

### 目的

作ったアプリをポートフォリオとして説明できる状態にする。

### 内容

- README作成
- API設計
- DB設計
- 認証設計
- 画面設計
- Test設計
- 面接説明文
- 今後の拡張候補

---

## Chapter 18：JobHunt Proへの拡張案

### 目的

Lite版から本格プロダクトへ広げる方向性を説明する。

### 内容

- Googleカレンダー連携
- 通知
- AI応募状況分析
- 落選理由分析
- 媒体別成果分析
- 応募ファネル
- CSV / Excelインポート
- 選考履歴ログ
- SaaS化検討

---

# docs/02_udemy/詰まりポイント一覧.md

# 詰まりポイント一覧

## 概要

JobHunt Liteの実装で詰まった箇所を、Udemy教材化・README・設計書・講座台本に転用できるよう整理する。

詰まった箇所は、初学者も同じように詰まりやすい。

そのため、単なるミスとして流さず、教材上の重要な解説ポイントとして扱う。

---

## 1. FormRequest

### 詰まりポイント

Controllerに直接バリデーションを書くのか、FormRequestに分けるのか。

### 解説ポイント

- Controllerを薄くする
- 入力検証の責務を分ける
- StoreCompanyRequestとUpdateCompanyRequestを分ける
- Rule::inで許可値を制限する
- バリデーションエラーは422で返る

---

## 2. CompanyResource

### 詰まりポイント

Laravel側のsnake_caseとReact側のcamelCaseが混ざる。

### 解説ポイント

- DBはsnake_case
- ReactはcamelCase
- CompanyResourceで変換する
- applied_date → appliedDate
- is_favorite → isFavorite
- ResourceがないとReact側の型とズレる
- ActionListsにもCompanyResourceを通す必要がある

---

## 3. Dashboard API

### 詰まりポイント

SummaryCardsやActionListsの集計をReact側でやるのかLaravel側でやるのか。

### 解説ポイント

- 集計ロジックはLaravel側に寄せる
- React側は表示に集中する
- Feature TestでDashboardロジックを保証できる
- actionListsもCompanyResource形式で返す

---

## 4. Route順序

### 詰まりポイント

/api/companies/dashboard が404になる。

### 原因

Route::apiResource('companies') が先にあると、/companies/dashboard が /companies/{company} に吸われる可能性がある。

### 解説ポイント

Laravelのルートは上から順に評価される。

固定ルートや特殊ルートはapiResourceより上に書く。

    Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
    Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
    Route::apiResource('companies', CompanyController::class);

---

## 5. Auth::id()

### 詰まりポイント

$request->user()、auth()->id()、Auth::id() の違いが分かりづらい。

### 解説ポイント

- $request->user() はログイン中ユーザーを取得する
- auth()->id() はログイン中ユーザーIDを取得する
- Auth::id() もログイン中ユーザーIDを取得する
- JobHunt LiteではAuth::id()に統一する
- Auth::id()->get() は間違い
- Company::where(...)->get() のgetとは役割が違う

---

## 6. Company::all()問題

### 詰まりポイント

認証導入後もCompany::all()を使ってしまう。

### なぜダメか

Company::all()はcompaniesテーブルの全件を取得する。

つまり、他ユーザーの企業も混ざる。

### 正しい方針

    Company::where('user_id', Auth::id())->get();

自分の企業だけ取得する。

---

## 7. user_id紐づけ

### 詰まりポイント

企業登録時にuser_idを保存しないと、誰の企業か分からなくなる。

### 解説ポイント

- companies.user_idを持たせる
- 登録時にAuth::id()を入れる
- 一覧取得時にAuth::id()で絞る
- 更新・削除・いいねでは所有者確認する

---

## 8. いいね機能

### 詰まりポイント

ハートを押しても色が変わらない。

### 原因候補

- DBにis_favoriteがない
- fillableにis_favoriteがない
- castsにis_favoriteがない
- CompanyResourceでisFavoriteを返していない
- Company型にisFavoriteがない
- onToggleFavoriteを渡していない
- Bearer Tokenが付いていない
- PATCH後に一覧再取得していない

### 解説ポイント

いいね機能はUIだけではない。

    DB
    ↓
    Model
    ↓
    Controller
    ↓
    Route
    ↓
    Resource
    ↓
    TypeScript
    ↓
    App.tsx
    ↓
    CompanyTable
    ↓
    UI

この流れが全部つながる必要がある。

---

## 9. likesテーブルを作るか問題

### 詰まりポイント

いいね機能ならlikesテーブルが必要なのではないか。

### 解説ポイント

JobHunt LiteのいいねはSNS的ないいねではない。

自分の企業データに対する注目フラグ。

そのため、companies.is_favoriteで十分。

likesテーブルが必要になるのは、複数ユーザーが共通の求人データにいいねする場合。

---

## 10. casts

### 詰まりポイント

is_favoriteが0 / 1で見える。

### 解説ポイント

DBではbooleanが0 / 1に見えることがある。

Reactではtrue / falseで扱いたい。

Laravel側でcastsを設定する。

    protected $casts = [
        'is_favorite' => 'boolean',
    ];

---

## 11. PUT全体更新

### 詰まりポイント

一部だけ更新したつもりで、他の値が消える可能性がある。

### 解説ポイント

PUTは全体更新として扱う。

React側でインライン更新する場合も、既存項目を含めて送る必要がある。

buildCompanyRequestBodyで既存項目を保持する。

---

## 12. Partial<CompanyForm>

### 詰まりポイント

詳細モーダルで一部項目だけ更新したい。

### 解説ポイント

Partial<CompanyForm>を使うと、CompanyFormの一部だけを受け取れる。

    function updateDetailForm(values: Partial<CompanyForm>) {
      setDetailForm((prev) => ({
        ...prev,
        ...values,
      }));
    }

---

## 13. props

### 詰まりポイント

親から子へ関数を渡す流れが分かりづらい。

### 解説ポイント

App.tsxがAPI通信を持つ。

CompanyTableはボタンを表示する。

ボタン押下時にonToggleFavorite(company)を呼ぶ。

実際のAPI通信はApp.tsxのtoggleCompanyFavoriteで行う。

---

## 14. ActionLists fallback

### 詰まりポイント

getInterviewCompaniesの条件が広すぎる。

### 問題の条件

    company.status === "面談予定" || company.status !== null

この条件だと、statusがnullでない企業がほぼ入る。

### 修正候補

    company.status === "面談予定" || company.interviewDate !== null

---

## 15. assertJsonMissing

### 詰まりポイント

assertJsonMissingが思ったより強い。

### 解説ポイント

assertJsonMissingはレスポンス全体を対象にする。

特定配列の中身を確認したい場合は、assertJsonCountとassertJsonPathを使う方が安全。

---

## 16. Sanctum認証後のFeature Test

### 詰まりポイント

auth:sanctum配下のAPIを未認証でテストしてしまう。

### 解説ポイント

認証導入後はSanctum::actingAs($user)を使う。

    use Laravel\Sanctum\Sanctum;

    $user = User::factory()->create();

    Sanctum::actingAs($user);

Factoryで企業を作るときはuser_idを付ける。

---

## 17. localStorage token

### 詰まりポイント

リロード後にログイン状態を復元する流れ。

### 解説ポイント

ログイン成功時にtokenをlocalStorageへ保存する。

リロード時にtokenがあれば/api/meで確認する。

無効ならtokenを削除してログイン画面へ戻す。

---

## 18. createHeaders

### 詰まりポイント

Bearer Tokenを付け忘れる。

### 解説ポイント

headers作成をcreateHeadersに集約する。

    Authorization: Bearer {authToken}

これがないと、Laravel側は未ログイン扱いになる。

---

## 19. HTMLコメント混入

### 詰まりポイント

routes/api.phpにHTMLコメントが混ざり、Unexpected token '<' が出る。

### 解説ポイント

React側はJSONを期待してresponse.json()する。

しかしHTMLが返るとJSONとして読めない。

PHPファイルにHTMLコメントを混ぜない。

---

## 20. まとめ

JobHunt Liteで詰まったポイントは、どれも実務でも起きやすい。

特に重要なのは以下。

- FormRequest
- CompanyResource
- Auth::id()
- user_id紐づけ
- Company::all()禁止
- Favorite機能の一連の流れ
- Route順序
- PUT全体更新
- props
- Partial<CompanyForm>
- Feature Test
- Sanctum認証後のテスト

これらはUdemy教材化するときに、初学者がつまずきやすい重要解説ポイントとして扱う。

---

# docs/02_udemy/教材化方針.md

# 教材化方針

## 概要

JobHunt Liteは、Laravel × React / TypeScriptを使った実務寄りの学習教材として整理する。

一般的なTodoアプリではなく、実際に使える転職活動管理アプリを題材にする。

---

## 方針

教材では、JobHunt本体をそのまま全て見せるのではなく、学習しやすいJobHunt Tutorialとして再構成する。

最初から完成コードを一気に提示せず、段階的に育てる。

---

## 重視すること

- CRUDの流れを理解する
- LaravelのRoute / Controller / Model / Migrationを理解する
- FormRequestの必要性を理解する
- CompanyResourceの必要性を理解する
- Reactのstate管理を理解する
- TypeScriptの型を理解する
- propsの受け渡しを理解する
- Laravel APIとReactを接続する流れを理解する
- 認証導入後のuser_id分離を理解する
- Feature Testの意味を理解する

---

## 教材で深追いしないこと

- Tailwind CSSの細かいデザイン解説
- SaaS運用
- 決済
- 複雑な権限管理
- Googleカレンダー連携
- AI分析
- 通知
- 本格的なデプロイ運用

Tailwind CSSは完成コードをベースに扱い、講座ではLaravel API、React state、TypeScript、FormRequest、Resource、設計判断を中心に解説する。

---

## 教材の進め方

最初からFormRequestやResourceを出しすぎない。

まずはControllerで最小CRUDを作り、後から整理する。

流れ:

    ControllerでCRUD
    ↓
    FormRequestへ分離
    ↓
    Resourceで整形
    ↓
    Reactで表示
    ↓
    登録フォーム
    ↓
    検索
    ↓
    詳細モーダル
    ↓
    Dashboard
    ↓
    いいね
    ↓
    認証
    ↓
    Test

---

## 一言まとめ

JobHunt Tutorialは、Todoアプリより実用的で、Laravel × Reactの実務的な流れを学べる教材として整理する。

---

# docs/02_udemy/Laravel解説ポイント.md

# Laravel解説ポイント

## 1. Route

- routes/api.php
- Route::apiResource
- 固定ルートをapiResourceより上に書く
- auth:sanctum middleware

---

## 2. Controller

- index
- store
- show
- update
- destroy
- toggleFavorite
- Controllerを薄くする意識

---

## 3. Migration

- companiesテーブル
- user_id
- is_favorite
- nullable
- default
- cascadeOnDelete

---

## 4. Model

- Company
- fillable
- casts
- belongsTo User

---

## 5. FormRequest

- StoreCompanyRequest
- UpdateCompanyRequest
- rules
- Rule::in
- URL validation
- 422 response

---

## 6. Resource

- CompanyResource
- snake_case → camelCase
- APIレスポンス整形
- React型との接続

---

## 7. Auth

- Laravel Sanctum
- register
- login
- logout
- /api/me
- Bearer Token
- Auth::id()
- Company::all()禁止

---

## 8. Feature Test

- RefreshDatabase
- Factory
- assertCreated
- assertOk
- assertStatus
- assertDatabaseHas
- assertJsonValidationErrors
- assertJsonPath
- assertJsonCount

---

# docs/02_udemy/React_TypeScript解説ポイント.md

# React TypeScript解説ポイント

## 1. useState

- companies
- form
- detailForm
- selectedCompany
- authToken
- authUser
- dashboard
- toastMessage

---

## 2. useEffect

- authToken変更時にfetchMe / fetchCompanies / fetchDashboardを実行
- logout時にcompanies / dashboardをクリア

---

## 3. 型定義

- Company
- CompanyForm
- Option
- DashboardResponse
- DashboardSummary
- DashboardActionLists

---

## 4. props

- App.tsxから子コンポーネントへ値と関数を渡す
- CompanyTable
- CompanyRegisterForm
- SearchForm
- SummaryCards
- ActionLists
- CompanyDetailModal

---

## 5. API通信

- fetch
- createHeaders
- Bearer Token
- URLSearchParams
- response.ok
- response.json

---

## 6. フォーム

- 登録フォーム
- 詳細モーダル
- setForm
- setDetailForm
- Partial<CompanyForm>

---

## 7. 条件表示

- authTokenがない場合はログイン画面
- authModeでログイン / 登録切り替え
- mainPanelで登録 / 一覧切り替え
- isActionListsOpenでActionLists開閉
- isDetailOpenでモーダル表示

---

## 8. UI状態

- loading
- toastMessage
- isExpanded
- isFavorite
- isRejected

---

## 9. 注意点

- APIレスポンス名とTypeScript型名を揃える
- is_favoriteではなくisFavoriteを見る
- applied_dateではなくappliedDateを見る
- API通信はApp.tsxに集約する

---

# docs/02_udemy/講座台本メモ.md

# 講座台本メモ

## 冒頭

この講座では、Laravel × React / TypeScriptで転職活動管理アプリを作ります。

Todoアプリではなく、実際に使える転職活動管理アプリを題材にします。

応募企業、選考状況、次アクション、面談URL、求人URL、選考結果を一画面で管理できるアプリを作ります。

---

## なぜこの題材か

Todoアプリは学習には便利ですが、実務感が薄くなりやすいです。

JobHunt Liteでは、実際の転職活動で必要になる情報を扱うため、より実務に近いCRUD、検索、詳細編集、認証、Dashboard、テストを学べます。

---

## Laravelパート導入

まずはLaravel側でAPIを作ります。

Route、Controller、Model、Migrationの流れを確認しながら、企業情報を登録・取得・更新・削除できるAPIを作ります。

最初はシンプルに作り、その後でFormRequestとResourceに分離します。

---

## Reactパート導入

次にReact / TypeScriptで画面を作ります。

Laravel APIから企業一覧を取得し、テーブルに表示します。

その後、登録フォーム、検索フォーム、詳細モーダル、Dashboard、いいね機能を追加していきます。

---

## 認証パート導入

最後にLaravel Sanctumでログイン機能を追加します。

ログイン後は、Bearer Tokenを使ってAPIへアクセスします。

企業データはuser_idでログインユーザーに紐づけ、自分の企業だけを表示・操作できるようにします。

---

## テストパート導入

Laravel Feature Testで、APIが期待通り動くことを確認します。

登録、更新、削除、検索、Dashboard集計をテストし、アプリの品質を保証します。

---

## 締め

この講座を通して、Laravel APIとReact / TypeScriptを組み合わせた実務寄りのWebアプリ開発を一通り体験できます。

完成後は、READMEや設計書も整理し、ポートフォリオとして説明できる状態を目指します。
