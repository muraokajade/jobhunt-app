# JobHunt Lite

JobHunt Lite は、Laravel × React / TypeScript で作成した転職活動管理アプリです。

応募企業、選考状況、志望度、面談予定、次アクション、選考結果、メモを一元管理できます。

単なるCRUDではなく、Laravel API、FormRequest、Resource、Feature Test、Dashboard API、Reactコンポーネント分割まで含めた、実務寄りの学習・ポートフォリオ用アプリです。

---

## 目的

このアプリは、以下を目的として作成しました。

- Laravel × React の実務寄りCRUDを復習する
- Todoアプリより複雑な業務アプリ構成を体験する
- FormRequest / Resource / Feature Test を使ったAPI設計を整理する
- React / TypeScriptでAPI連携・コンポーネント分割を行う
- GitHub公開・README・設計書・教材化を見据えた成果物にする

---

## 使用技術

### Backend

- PHP
- Laravel
- Eloquent ORM
- FormRequest
- JsonResource
- Feature Test

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Database

- MySQL または SQLite

### Test

- Laravel Feature Test
- RefreshDatabase
- Factory
- assertJsonPath
- assertJsonCount

---

## 主な機能

### 企業管理

- 企業登録
- 企業一覧表示
- 企業詳細表示
- 企業詳細編集
- 企業削除

### 検索・絞り込み

- keyword検索
- status絞り込み
- media絞り込み
- keyword + status 複合検索

### 選考管理

- 志望度管理
- 選考状況管理
- 応募日管理
- 面談日管理
- 求人URL管理
- 面談URL管理
- 次アクション管理
- 書類選考結果管理
- 1次面接結果管理
- 2次面接結果管理
- 最終結果管理
- 落選段階管理
- メモ管理

### UX補助

- priority / status インライン更新
- 詳細モーダル編集
- 選考結果に応じた status / 落選段階の自動補助
- 落選企業の赤系ハイライト表示
- 落選企業も操作・詳細確認・メモ追記可能
- 企業一覧は5件まで初期表示し、「もっと見る」で展開
- 登録 / 一覧 の切り替え表示
- ActionListsはアコーディオン表示

### Dashboard

- SummaryCards
- Dashboard API
- ActionLists
- 面談予定リスト
- 確認待ちリスト
- 高優先度リスト

---

## 画面構成

JobHunt Lite は、1画面完結型のSPAとして構成しています。

主な構成は以下です。

- AppHeader
- Hero
- 登録 / 一覧 切り替えボタン
- SummaryCards
- SearchForm
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

Lite版では、React Routerによる複雑な画面遷移は行わず、登録・検索・一覧・詳細編集を1画面で完結させています。

---

## Backend構成

Laravel側では以下を実装しています。

- Company CRUD API
- StoreCompanyRequest
- UpdateCompanyRequest
- CompanyResource
- CompanyFactory
- CompanyApiTest
- CompanyDashboardController
- CompanyDashboardApiTest

---

## API仕様

### Company CRUD API

| Method | Endpoint            | 内容         |
| ------ | ------------------- | ------------ |
| GET    | /api/companies      | 企業一覧取得 |
| POST   | /api/companies      | 企業登録     |
| GET    | /api/companies/{id} | 企業詳細取得 |
| PUT    | /api/companies/{id} | 企業更新     |
| DELETE | /api/companies/{id} | 企業削除     |

### Dashboard API

| Method | Endpoint                 | 内容                                |
| ------ | ------------------------ | ----------------------------------- |
| GET    | /api/companies/dashboard | Dashboard用集計・重要企業リスト取得 |

---

## Dashboard API

Dashboard APIでは、summary と actionLists を返します。

### summary

SummaryCardsで使用する件数情報です。

- total
- interview
- waiting
- offer
- rejected
- highPriority

### actionLists

ActionListsで使用する重要企業リストです。

- interviews
- waiting
- highPriority

### 設計意図

React側で毎回filterするのではなく、Laravel側でDashboard用の集計・抽出を行うことで、以下を実現しています。

- 集計ルールをバックエンドに集約する
- DashboardロジックをFeature Testで検証する
- React側を表示責務に寄せる
- 実務に近いAPI設計にする

---

## Resource設計

CompanyResourceでは、Laravel / DB側の snake_case を React側で扱いやすい camelCase に変換しています。

例：

| Laravel / DB   | React         |
| -------------- | ------------- |
| applied_date   | appliedDate   |
| interview_date | interviewDate |
| job_url        | jobUrl        |
| interview_url  | interviewUrl  |
| next_action    | nextAction    |

Dashboard APIのactionListsにもCompanyResourceを通すことで、企業一覧APIとDashboard APIのレスポンス形式を統一しています。

これにより、CompanyTableから詳細モーダルを開いた場合も、ActionListsから詳細モーダルを開いた場合も、同じCompany型として扱えます。

---

## Frontend構成

React側では、以下のようにコンポーネントを分割しています。

- AppHeader
- SearchForm
- SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

また、以下を分離しています。

- types
- constants
- utils

### types

Company / CompanyForm / DashboardResponse などの型定義を管理します。

### constants

statusOptions / priorityOptions / resultOptions などの選択肢を管理します。

### utils

日付変換、初期フォーム生成、PUT全体更新用requestBody生成などを管理します。

---

## Test

Feature Test 15 pass。

### CompanyApiTest：11 tests

- 企業を登録できる
- 企業名なしでは登録できない
- 不正な求人URLでは登録できない
- 企業情報を更新できる
- 不正なstatusでは更新できない
- 企業を削除できる
- keywordで検索できる
- statusで絞り込みできる
- mediaで絞り込みできる
- keyword + statusで複合検索できる
- PUT全体更新で既存項目が消えない

### CompanyDashboardApiTest：4 tests

- Dashboard APIでsummaryを取得できる
- 高優先度企業リストを取得できる
- 面談予定企業リストを取得できる
- 確認待ち企業リストを取得できる

---

## テスト実行

全テスト実行。

    php artisan test

個別実行。

    php artisan test --filter=CompanyApiTest
    php artisan test --filter=CompanyDashboardApiTest

---

## 実装上の工夫

### 1. PUT全体更新

一覧上ではpriorityやstatusだけを変更しているように見えますが、Laravel側ではPUT全体更新として扱っています。

そのため、React側では既存companyをもとにrequestBodyを生成し、変更した項目だけ上書きする設計にしています。

### 2. Dashboard API

SummaryCardsとActionListsは、Laravel Dashboard APIの結果を優先して表示します。

API未取得時はcompanies配列から計算するfallbackも残しています。

### 3. 選考結果の入力補助

書類選考・面接・最終結果で「不通過」を選択した場合、statusとrejection_stageを自動補助します。

ただし、disableはせず、ユーザーが手動修正できるようにしています。

### 4. 落選企業の扱い

落選企業は赤系で表示し、視覚的に区別します。

ただし、削除対象として扱うのではなく、落選原因を分析するため、詳細確認・編集・メモ追記は可能にしています。

### 5. Route順序

/api/companies/dashboard は、Route::apiResource('companies') より先に定義しています。

apiResourceの /companies/{company} に dashboard が吸われて404になるため、固定ルートを先に書く必要があります。

---

## 今後の拡張

JobHunt Proとして、以下を検討しています。

- 認証
- ログイン
- ユーザー別企業管理
- Googleカレンダー連携
- 通知
- Dashboard強化
- 落選企業の表示 / 非表示切り替え
- 選考履歴ログ
- AI求人票構造化
- AI面談準備メモ
- CSV / Excelインポート
- Service層導入
- PATCH API
- SaaS化検討

---

## 学習・教材化メモ

このアプリは、Laravel × Reactの教材原型としても活用できます。

特に以下は、初学者が詰まりやすいポイントとして解説価値があります。

- FormRequestとは何か
- Resourceとは何か
- Factoryとは何か
- Feature Testとは何か
- RefreshDatabaseとは何か
- assertJsonPathとは何か
- assertJsonCountとは何か
- in_arrayとは何か
- Collectionのfilter / where / count / sortBy / take / values
- PUT全体更新とは何か
- Reactのprops
- TypeScriptのPartial
- APIレスポンス形式の統一
- Laravelルート定義順序
