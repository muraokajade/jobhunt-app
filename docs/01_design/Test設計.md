# docs/01_design/Test設計.md

## 更新日

2026/05/24

## 参照元

- CompanyDashboardApiTest / CompanyApiTest: :contentReference[oaicite:0]{index=0}

---

# 1. 概要

Test設計.mdでは、JobHunt Liteで実装しているLaravel Feature Testの目的、対象、確認観点、今後追加すべきテストを整理する。

現在のテストは、主に以下を確認している。

- Company CRUD API
- バリデーション
- 検索・絞り込み
- PUT全体更新
- Dashboard API
- summary集計
- actionLists抽出

現在確認できているテスト数は以下。

- CompanyApiTest：11 tests
- CompanyDashboardApiTest：4 tests
- 合計：15 tests

---

# 2. 目的

Feature Testの目的は、Laravel APIが期待通りに動作することを保証することである。

JobHunt Liteでは、React側からLaravel APIを呼び出して企業情報を登録・更新・削除・検索・集計する。

そのため、API単体で以下を確認する。

- 正しい入力なら登録できる
- 不正な入力なら422になる
- 企業情報を更新できる
- 企業情報を削除できる
- keyword / status / mediaで検索・絞り込みできる
- Dashboard APIがsummaryを返す
- Dashboard APIがactionListsを返す
- PUT全体更新で既存項目が消えない

---

# 3. 現在の重要注意点

現在のroutes/api.phpでは、companies系API、Dashboard API、Favorite APIはauth:sanctum middleware配下にある。

そのため、本来はFeature Testでも認証済みユーザーとしてAPIを叩く必要がある。

現時点で貼られているCompanyApiTest / CompanyDashboardApiTestは、以下のように未認証でAPIを叩いている。

    $this->postJson('/api/companies', ...);
    $this->getJson('/api/companies/dashboard');

このままauth:sanctum配下のAPIに対して実行すると、通常は401になる可能性がある。

したがって、認証導入後の最新版テストでは、以下の対応が必要になる。

- User Factoryを作る
- Sanctum::actingAs($user) を使う
- Company Factoryでuser_idを付ける
- 他ユーザーの企業が混ざらないテストを追加する

つまり、現在の15passはCRUD / Dashboardロジックの土台として有効だが、認証・user_id紐づけ導入後の完全版としては追加修正が必要である。

---

# 4. 使用技術

Feature Testでは以下を使用する。

- PHPUnit
- Laravel Feature Test
- RefreshDatabase
- Factory
- assertStatus
- assertCreated
- assertOk
- assertDatabaseHas
- assertDatabaseMissing
- assertJsonValidationErrors
- assertJsonFragment
- assertJsonMissing
- assertJsonPath
- assertJsonCount

---

# 5. RefreshDatabase

## 5.1 目的

各テスト実行前後でDB状態をリセットするためにRefreshDatabaseを使用する。

    use RefreshDatabase;

これにより、テスト同士がDBデータに影響されにくくなる。

## 5.2 設計意図

テストごとに独立したDB状態を作ることで、以下を防ぐ。

- 前のテストで作成した企業が次のテストに混ざる
- 件数テストが不安定になる
- 検索・絞り込み結果が予想とズレる
- Dashboard summaryの件数がズレる

---

# 6. Factory

## 6.1 目的

Company Factoryは、テスト用の企業データを簡単に作るために使用する。

例。

    Company::factory()->create([
        'status' => '内定',
        'priority' => '5.0',
    ]);

## 6.2 設計意図

Factoryを使うことで、テストごとに必要な状態の企業を作りやすくなる。

Dashboard APIのように、statusやpriorityによって集計結果が変わるテストでは特に重要である。

---

# 7. CompanyApiTest

CompanyApiTestでは、企業管理APIの基本動作を確認する。

対象は以下。

- 登録
- バリデーション
- 更新
- 削除
- 検索
- 絞り込み
- 複合検索
- PUT全体更新

---

# 8. companyPayload

## 8.1 目的

companyPayloadは、企業登録・更新APIへ送る標準リクエストデータを作るprivateメソッドである。

複数のテストで同じ入力データを使い回すために用意する。

## 8.2 基本データ

主な項目は以下。

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

## 8.3 overrides

companyPayloadでは、引数のoverridesで一部項目だけ上書きできる。

例。

    $this->companyPayload([
        'name' => '',
    ]);

これにより、正常系データをベースにしながら、異常系テストや更新テストを簡単に作れる。

---

# 9. CompanyApiTest：テスト一覧

## 9.1 test_can_create_company

### 目的

企業を登録できることを確認する。

### 確認内容

- POST /api/companies に正しいデータを送る
- 201 Created が返る
- companiesテーブルに企業情報が保存される

### 主なassert

    $response->assertCreated();

    $this->assertDatabaseHas('companies', [
        'name' => 'テスト株式会社',
        'status' => '応募済み',
        'priority' => '3.0',
    ]);

---

## 9.2 test_cannot_creat_company_without_name

### 目的

企業名なしでは登録できないことを確認する。

### 確認内容

- nameを空にしてPOSTする
- 422 Unprocessable Entity が返る
- nameのバリデーションエラーが返る

### 主なassert

    $response->assertStatus(422);

    $response->assertJsonValidationErrors(['name']);

### 補足

メソッド名は test_cannot_creat_company_without_name になっている。

createのスペルがcreatになっているため、将来的には以下に直すとよい。

    test_cannot_create_company_without_name

---

## 9.3 test_cannot_create_company_with_invalid_job_url

### 目的

不正な求人URLでは企業登録できないことを確認する。

### 確認内容

- job_urlにinvalid-urlを送る
- 422が返る
- job_urlのバリデーションエラーが返る

### 主なassert

    $response->assertStatus(422);

    $response->assertJsonValidationErrors(['job_url']);

---

## 9.4 test_can_update_company

### 目的

企業情報を更新できることを確認する。

### 確認内容

- Factoryで企業を1件作成する
- PUT /api/companies/{id} に更新データを送る
- 200 OK が返る
- DB上のname / status / priorityが更新される

### 主なassert

    $response->assertOk();

    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'name' => '更新株式会社',
        'status' => '面談予定',
        'priority' => '5.0',
    ]);

---

## 9.5 test_cannot_update_company_with_invalid_status

### 目的

許可されていない選考状況では企業情報を更新できないことを確認する。

### 確認内容

- statusに謎ステータスを送る
- 422が返る
- statusのバリデーションエラーが返る

### 主なassert

    $response->assertStatus(422);

    $response->assertJsonValidationErrors(['status']);

### 設計意図

UpdateCompanyRequestのRule::inで許可値を制限していることを保証する。

---

## 9.6 test_can_delete_company

### 目的

企業を削除できることを確認する。

### 確認内容

- Factoryで企業を1件作成する
- DELETE /api/companies/{id} を送る
- 200 OK が返る
- companiesテーブルから対象企業が消える

### 主なassert

    $response->assertOk();

    $this->assertDatabaseMissing('companies', [
        'id' => $company->id,
    ]);

---

## 9.7 test_can_search_companies_by_keyword

### 目的

keywordで企業一覧を検索できることを確認する。

### 確認内容

- Search Target Companyを作成する
- Other Companyを作成する
- keyword=Searchで検索する
- Search Target Companyだけが返る

### 主なassert

    $response->assertJsonFragment([
        'name' => 'Search Target Company',
    ]);

    $response->assertJsonMissing([
        'name' => 'Other Company',
    ]);

---

## 9.8 test_can_filter_companies_by_status

### 目的

statusで企業一覧を絞り込めることを確認する。

### 確認内容

- 面談予定株式会社を作成する
- 応募済み株式会社を作成する
- status=面談予定で絞り込む
- 面談予定株式会社だけが返る

### 主なassert

    $response->assertJsonFragment([
        'name' => '面談予定株式会社',
    ]);

    $response->assertJsonMissing([
        'name' => '応募済み株式会社',
    ]);

---

## 9.9 test_can_filter_companies_by_media

### 目的

mediaで企業一覧を絞り込めることを確認する。

### 確認内容

- Green経由株式会社を作成する
- Type経由株式会社を作成する
- media=Greenで絞り込む
- Green経由株式会社だけが返る

### 主なassert

    $response->assertJsonFragment([
        'name' => 'Green経由株式会社',
    ]);

    $response->assertJsonMissing([
        'name' => 'Type経由株式会社',
    ]);

---

## 9.10 test_can_filter_companies_by_keyword_and_status

### 目的

keywordとstatusを組み合わせて企業一覧を絞り込めることを確認する。

### 確認内容

- Laravel面談予定株式会社を作成する
- Laravel応募済み株式会社を作成する
- React面談予定株式会社を作成する
- keyword=Laravelかつstatus=面談予定で検索する
- Laravel面談予定株式会社だけが返る

### 主なassert

    $response->assertJsonFragment([
        'name' => 'Laravel面談予定株式会社',
    ]);

    $response->assertJsonMissing([
        'name' => 'Laravel応募済み株式会社',
    ]);

    $response->assertJsonMissing([
        'name' => 'React面談予定株式会社',
    ]);

---

## 9.11 test_can_update_company_without_losing_existing_fields

### 目的

PUT全体更新で企業情報を更新しても、送信した既存項目が正しく保持されることを確認する。

### 確認内容

- 既存企業をFactoryで作成する
- job_url / memo / next_actionなどの既存値を持たせる
- priorityだけ変更する想定でPUTする
- 既存項目が消えず、priorityだけ更新されることを確認する

### 主なassert

    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'name' => '既存企業株式会社',
        'job_url' => 'https://example.com/original-job',
        'memo' => '既存メモ',
        'next_action' => '既存アクション',
        'priority' => '5.0',
    ]);

### 設計意図

一覧のインライン更新では一部項目だけ変更するUIだが、APIには全体データを送る設計であることを確認する。

---

# 10. CompanyDashboardApiTest

CompanyDashboardApiTestでは、Dashboard APIがsummaryとactionListsを正しく返すことを確認する。

対象APIは以下。

    GET /api/companies/dashboard

---

# 11. CompanyDashboardApiTest：テスト一覧

## 11.1 test_can_get_company_dashboard_summary

### 目的

Dashboard APIでsummary件数を取得できることを確認する。

### テストデータ

- status: 内定 / priority: 5.0
- status: 落選 / priority: 3.0
- status: 面談予定 / priority: 4.0 / interview_dateあり

### 確認内容

- totalが3である
- offerが1である
- rejectedが1である
- interviewが1である
- highPriorityが2である

### 主なassert

    $response->assertJsonPath('summary.total', 3);
    $response->assertJsonPath('summary.offer', 1);
    $response->assertJsonPath('summary.rejected', 1);
    $response->assertJsonPath('summary.interview', 1);
    $response->assertJsonPath('summary.highPriority', 2);

---

## 11.2 test_dashboard_contains_high_priority_companies

### 目的

Dashboard APIで高優先度企業リストを取得できることを確認する。

### テストデータ

- 高優先度株式会社 / priority: 5.0
- 低優先度株式会社 / priority: 2.0

### 確認内容

- actionLists.highPriorityが1件である
- actionLists.highPriority.0.name が 高優先度株式会社 である

### 主なassert

    $response->assertJsonCount(1, 'actionLists.highPriority');

    $response->assertJsonPath(
        'actionLists.highPriority.0.name',
        '高優先度株式会社'
    );

---

## 11.3 test_dashboard_contains_interview_companies

### 目的

Dashboard APIで面談予定企業リストを取得できることを確認する。

### テストデータ

- 面談予定株式会社 / status: 面談予定 / interview_dateあり
- 通常応募株式会社 / status: 応募済み / interview_dateなし

### 確認内容

- actionLists.interviewsが1件である
- actionLists.interviews.0.name が 面談予定株式会社 である

### 主なassert

    $response->assertJsonCount(1, 'actionLists.interviews');

    $response->assertJsonPath(
        'actionLists.interviews.0.name',
        '面談予定株式会社'
    );

---

## 11.4 test_dashboard_contains_waiting_companies

### 目的

Dashboard APIで確認待ち企業リストを取得できることを確認する。

### テストデータ

- 確認待ち株式会社 / status: 応募済み
- 内定済み株式会社 / status: 内定

### 確認内容

- actionLists.waitingが1件である
- actionLists.waiting.0.name が 確認待ち株式会社 である

### 主なassert

    $response->assertJsonCount(1, 'actionLists.waiting');

    $response->assertJsonPath(
        'actionLists.waiting.0.name',
        '確認待ち株式会社'
    );

---

# 12. assert系の使い分け

## 12.1 assertCreated

登録APIで201 Createdが返ることを確認する。

    $response->assertCreated();

## 12.2 assertOk

取得・更新・削除などで200 OKが返ることを確認する。

    $response->assertOk();

## 12.3 assertStatus

422や403など、特定のHTTPステータスを確認する。

    $response->assertStatus(422);

## 12.4 assertDatabaseHas

DBに指定したデータが存在することを確認する。

    $this->assertDatabaseHas('companies', [
        'name' => 'テスト株式会社',
    ]);

## 12.5 assertDatabaseMissing

DBに指定したデータが存在しないことを確認する。

    $this->assertDatabaseMissing('companies', [
        'id' => $company->id,
    ]);

## 12.6 assertJsonValidationErrors

バリデーションエラーが返ることを確認する。

    $response->assertJsonValidationErrors(['name']);

## 12.7 assertJsonFragment

レスポンスJSONのどこかに指定した断片が含まれることを確認する。

    $response->assertJsonFragment([
        'name' => 'Search Target Company',
    ]);

## 12.8 assertJsonMissing

レスポンスJSONのどこにも指定した断片が含まれないことを確認する。

    $response->assertJsonMissing([
        'name' => 'Other Company',
    ]);

## 12.9 assertJsonPath

特定のJSONパスの値を確認する。

    $response->assertJsonPath('summary.total', 3);

## 12.10 assertJsonCount

特定のJSON配列の件数を確認する。

    $response->assertJsonCount(1, 'actionLists.highPriority');

---

# 13. 詰まりポイント

## 13.1 assertJsonMissingは強すぎる場合がある

assertJsonMissingはレスポンス全体を対象にする。

そのため、特定配列内に存在しないことを確認したい場合には強すぎる場合がある。

Dashboard APIのactionLists.highPriorityの中身だけ確認したい場合は、以下の組み合わせが適している。

- assertJsonCount
- assertJsonPath

## 13.2 JSONパスで対象を絞る

Dashboard APIのようにsummaryとactionListsを返す場合、レスポンス全体を雑に見るよりも、JSONパスを指定した方が安全である。

例。

    $response->assertJsonPath('actionLists.highPriority.0.name', '高優先度株式会社');

## 13.3 PUT全体更新の注意点

React側のインライン更新では、一部項目だけ変更しているように見える。

しかしAPI側ではPUT全体更新を使う場合、既存項目を含めて送らないと項目が消える可能性がある。

そのため、test_can_update_company_without_losing_existing_fieldsで既存項目が保持されることを確認している。

---

# 14. 認証導入後に必要な修正

## 14.1 現在の課題

現在のテストコードでは、auth:sanctum middlewareを通る前提の処理がまだ十分に反映されていない可能性がある。

認証導入後は、companies系API、Dashboard API、Favorite APIへアクセスする前に認証済みユーザーを用意する必要がある。

## 14.2 Sanctum::actingAs

認証済みユーザーとしてテストする場合は、Sanctum::actingAsを使う。

    use App\Models\User;
    use Laravel\Sanctum\Sanctum;

    $user = User::factory()->create();

    Sanctum::actingAs($user);

## 14.3 Factory作成時のuser_id

企業データを作成するときは、ログイン中ユーザーのIDを付ける。

    Company::factory()->create([
        'user_id' => $user->id,
    ]);

## 14.4 一覧取得テストの修正方針

認証導入後の一覧取得テストでは、以下を確認する。

    自分の企業は返る
    他人の企業は返らない

## 14.5 Dashboardテストの修正方針

認証導入後のDashboardテストでは、以下を確認する。

    自分の企業だけsummaryに含まれる
    他人の企業はsummaryに含まれない
    自分の企業だけactionListsに含まれる
    他人の企業はactionListsに含まれない

---

# 15. 今後追加したいテスト

認証・user_id紐づけ・Favorite機能まで含めると、今後追加したいテストは以下。

## 15.1 認証系

- ユーザー登録できる
- ログインできる
- ログアウトできる
- /api/meでログイン中ユーザーを取得できる
- 未ログインではcompanies APIにアクセスできない
- 未ログインではDashboard APIにアクセスできない

## 15.2 user_id紐づけ

- 企業登録時にuser_idが保存される
- 一覧取得で自分の企業だけ返る
- 他ユーザーの企業は一覧に出ない
- 他ユーザーの企業詳細は取得できない
- 他ユーザーの企業は更新できない
- 他ユーザーの企業は削除できない

## 15.3 Favorite

- いいねをtrueに切り替えられる
- いいねをfalseに戻せる
- 他ユーザーの企業はいいねできない
- いいね更新後にCompanyResourceでisFavoriteが返る

## 15.4 Dashboard

- Dashboard集計に他ユーザーの企業が混ざらない
- actionListsに他ユーザーの企業が混ざらない
- actionListsの企業がCompanyResource形式で返る
- summary.highPriorityが正しく計算される

---

# 16. 現時点の評価

現在の15passは、JobHunt LiteのCRUD / 検索 / Dashboardロジックの土台として有効である。

ただし、認証・user_id・Favoriteが追加された現在の最新版としては、以下の追加対応が必要である。

- テスト内で認証済みユーザーを用意する
- Factoryにuser_idを付ける
- 自分の企業だけ取得できることを確認する
- 他ユーザーの企業を操作できないことを確認する
- Favorite APIのテストを追加する
- Dashboard APIで他ユーザーの企業が混ざらないことを確認する

---

# 17. 一言まとめ

JobHunt LiteのFeature Testでは、現在CompanyApiTestでCRUD・検索・バリデーション・PUT全体更新を確認し、CompanyDashboardApiTestでsummaryとactionListsを確認している。

現在の15passは土台として有効だが、認証導入後はSanctum::actingAsとuser_id付きFactoryを使い、ログイン中ユーザー本人の企業だけを扱うテストへ更新する必要がある。

最終的には、以下を保証できるテスト構成にする。

    CRUDが動く
    バリデーションが効く
    検索・絞り込みできる
    Dashboardが集計できる
    いいねが切り替わる
    自分の企業だけ見える
    他人の企業は操作できない
