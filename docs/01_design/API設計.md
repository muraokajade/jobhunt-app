# API設計

## 更新日

2026/05/24

## 参照元

- JobHunt Lite 詳細設計書 最新版: :contentReference[oaicite:0]{index=0}

---

# 1. 概要

JobHunt Liteでは、Laravel APIを通じて企業情報、Dashboard情報、いいね状態、認証情報を管理する。

APIは大きく以下に分かれる。

- 認証不要API
- 認証必須API
- 企業CRUD API
- Dashboard API
- Favorite API

認証にはLaravel Sanctumを使用し、Bearer Token認証によってログイン中ユーザーを判定する。

企業データはuser_idによってログインユーザーに紐づけ、一覧取得・詳細取得・更新・削除・Dashboard集計・いいね切り替えでは、ログイン中ユーザー本人の企業データのみを扱う。

---

# 2. 目的

API設計の目的は、React / TypeScript側から安全にLaravel APIを利用できるようにすることである。

特にJobHunt Liteでは、転職活動データがユーザーごとに分かれる必要がある。

そのため、未ログイン状態で使えるAPIと、ログイン後のみ使えるAPIを明確に分離する。

---

# 3. API全体方針

## 3.1 認証不要API

ユーザー登録・ログインは、未ログイン状態で利用するため認証不要とする。

対象APIは以下。

- POST /api/register
- POST /api/login

## 3.2 認証必須API

ログイン中ユーザーの情報や企業データを扱うAPIは、すべてauth:sanctum middleware配下に配置する。

対象APIは以下。

- GET /api/me
- POST /api/logout
- GET /api/companies/dashboard
- PATCH /api/companies/{company}/favorite
- GET /api/companies
- POST /api/companies
- GET /api/companies/{company}
- PUT/PATCH /api/companies/{company}
- DELETE /api/companies/{company}

## 3.3 レスポンス形式

企業情報を返すAPIでは、原則としてCompanyResourceを通す。

Laravel / DB側はsnake_case、React / TypeScript側はcamelCaseで扱う。

そのため、APIレスポンスではCompanyResourceによってReact側で扱いやすい形式に変換する。

---

# 4. routes/api.php

JobHunt LiteのAPIルートは以下の構成とする。

    <?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\Api\AuthController;
    use App\Http\Controllers\Api\CompanyController;
    use App\Http\Controllers\Api\CompanyDashboardController;

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
        Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
        Route::apiResource('companies', CompanyController::class);
    });

---

# 5. 認証不要API

## 5.1 POST /api/register

### 用途

新規ユーザーを登録する。

### 認証

不要。

### Controller

AuthController@register

### 主な処理

- ユーザー名、メールアドレス、パスワードを受け取る
- 入力値をバリデーションする
- usersテーブルにユーザーを作成する
- 必要に応じてBearer Tokenを発行する

### 設計意図

ユーザー登録は未ログイン状態で行うため、auth:sanctum middlewareの外に配置する。

---

## 5.2 POST /api/login

### 用途

ログイン処理を行い、Bearer Tokenを発行する。

### 認証

不要。

### Controller

AuthController@login

### 主な処理

- メールアドレス、パスワードを受け取る
- 認証情報を確認する
- 認証成功時にBearer Tokenを発行する
- React側は受け取ったtokenをlocalStorageに保存する

### 設計意図

ログイン前に利用するAPIのため、auth:sanctum middlewareの外に配置する。

---

# 6. 認証必須API

## 6.1 GET /api/me

### 用途

ログイン中ユーザーの情報を取得する。

### 認証

必要。

### Controller

AuthController@me

### 主な処理

- Bearer Tokenからログイン中ユーザーを判定する
- 現在ログイン中のユーザー情報を返す

### React側の利用目的

React側では、localStorageに保存したtokenが有効か確認するために使用する。

画面リロード時、localStorageにtokenが残っていても、そのtokenが現在も有効とは限らない。

そのため、/api/me にBearer Token付きでアクセスし、ユーザー情報が返ればログイン状態として扱う。

### 設計意図

ログイン状態の復元と、現在ログイン中ユーザーの確認に使用する。

---

## 6.2 POST /api/logout

### 用途

ログアウト処理を行う。

### 認証

必要。

### Controller

AuthController@logout

### 主な処理

- Bearer Tokenからログイン中ユーザーを判定する
- 現在使用中のTokenを削除する
- React側ではlocalStorageのtokenを削除する

### 設計意図

ログアウトはログイン済みユーザーに対する操作であるため、auth:sanctum middleware配下に配置する。

---

# 7. Companies API

## 7.1 GET /api/companies

### 用途

ログイン中ユーザーの企業一覧を取得する。

### 認証

必要。

### Controller

CompanyController@index

### 主な処理

- ログイン中ユーザーのuser_idに一致する企業のみ取得する
- keyword、status、mediaなどの検索条件があれば絞り込む
- CompanyResource形式で返却する

### Query Parameters

| パラメータ | 用途                                           |
| ---------- | ---------------------------------------------- |
| keyword    | 企業名、メモ、次アクションなどのキーワード検索 |
| status     | 選考ステータス絞り込み                         |
| media      | 応募媒体絞り込み                               |

### 設計意図

企業一覧はユーザー本人の転職活動データであるため、ログイン中ユーザーの企業のみ返す。

---

## 7.2 POST /api/companies

### 用途

企業情報を新規登録する。

### 認証

必要。

### Controller

CompanyController@store

### Request

StoreCompanyRequest

### 主な入力項目

| 項目     | 用途           |
| -------- | -------------- |
| name     | 企業名         |
| media    | 応募媒体       |
| priority | 志望度・優先度 |
| job_url  | 求人URL        |
| memo     | メモ           |

### 主な処理

- StoreCompanyRequestで入力値を検証する
- ログイン中ユーザーのIDをAuth::id()で取得する
- companies.user_idにログイン中ユーザーIDを設定する
- 企業情報を登録する
- CompanyResource形式で返却する

### 設計意図

初回登録では、応募直後に分かる最低限の情報を登録する。

詳細な選考情報は、後から詳細モーダルで更新する。

---

## 7.3 GET /api/companies/{company}

### 用途

企業詳細情報を取得する。

### 認証

必要。

### Controller

CompanyController@show

### 主な処理

- 指定された企業IDのデータを取得する
- ログイン中ユーザーの企業か確認する
- CompanyResource形式で返却する

### 設計意図

他ユーザーの企業情報を閲覧できないようにする。

---

## 7.4 PUT/PATCH /api/companies/{company}

### 用途

企業情報を更新する。

### 認証

必要。

### Controller

CompanyController@update

### Request

UpdateCompanyRequest

### 主な更新項目

| 項目                    | 用途           |
| ----------------------- | -------------- |
| name                    | 企業名         |
| media                   | 応募媒体       |
| priority                | 志望度・優先度 |
| status                  | 選考ステータス |
| applied_date            | 応募日         |
| interview_date          | 面接日時       |
| job_url                 | 求人URL        |
| interview_url           | 面接URL        |
| memo                    | メモ           |
| next_action             | 次アクション   |
| document_result         | 書類選考結果   |
| first_interview_result  | 一次面接結果   |
| second_interview_result | 二次面接結果   |
| final_result            | 最終結果       |
| rejection_stage         | 落選ステージ   |

### 主な処理

- UpdateCompanyRequestで入力値を検証する
- ログイン中ユーザーの企業か確認する
- 企業情報を更新する
- CompanyResource形式で返却する

### 設計意図

選考が進んだ後の詳細情報は、詳細モーダルから更新する。

初回登録と詳細更新を分けることで、登録フォームを重くしすぎない。

---

## 7.5 DELETE /api/companies/{company}

### 用途

企業情報を削除する。

### 認証

必要。

### Controller

CompanyController@destroy

### 主な処理

- 指定された企業がログイン中ユーザーの企業か確認する
- 対象企業を削除する

### 設計意図

他ユーザーの企業を削除できないようにする。

---

# 8. Dashboard API

## 8.1 GET /api/companies/dashboard

### 用途

Dashboard表示用の集計データを取得する。

### 認証

必要。

### Controller

CompanyDashboardController@index

### 主な処理

- ログイン中ユーザーの企業データのみを取得する
- SummaryCards用のsummaryを作成する
- ActionLists用のactionListsを作成する
- React側へJSONで返却する

### レスポンス構造

    {
        "summary": {
            "total": 0,
            "interview": 0,
            "waiting": 0,
            "offer": 0,
            "rejected": 0,
            "highPriority": 0
        },
        "actionLists": {
            "interviews": [],
            "waiting": [],
            "highPriority": []
        }
    }

## 8.2 summary

SummaryCards表示用の件数情報を返す。

| 項目         | 用途           |
| ------------ | -------------- |
| total        | 応募総数       |
| interview    | 面談予定数     |
| waiting      | 返答待ち数     |
| offer        | 内定数         |
| rejected     | 落選数         |
| highPriority | 高優先度企業数 |

## 8.3 actionLists

ActionLists表示用の企業リストを返す。

| 項目         | 用途         |
| ------------ | ------------ |
| interviews   | 面談予定企業 |
| waiting      | 確認待ち企業 |
| highPriority | 高優先度企業 |

## 8.4 設計意図

Dashboard用の集計・抽出処理はLaravel側に寄せる。

理由は以下。

- 集計ルールをバックエンドに集約する
- Feature TestでDashboardロジックを検証する
- React側を表示責務に寄せる
- ログイン中ユーザーの企業だけを集計する
- 実務に近い構成にする

---

# 9. Favorite API

## 9.1 PATCH /api/companies/{company}/favorite

### 用途

企業のいいね状態を切り替える。

### 認証

必要。

### Controller

CompanyController@toggleFavorite

### 主な処理

- 指定された企業がログイン中ユーザーの企業か確認する
- is_favoriteを反転する
- trueの場合はfalseへ変更する
- falseの場合はtrueへ変更する
- 更新後の企業情報をCompanyResource形式で返却する

### DB

companiesテーブルのis_favoriteを使用する。

| カラム名    | 型      | デフォルト | 用途       |
| ----------- | ------- | ---------- | ---------- |
| is_favorite | boolean | false      | いいね状態 |

### React側の利用

React側ではCompany型にisFavoriteを持たせる。

CompanyTableにいいねボタンを表示し、クリック時にFavorite APIを呼び出す。

API成功後、対象企業のisFavoriteを更新する。

### 設計意図

priorityとは別軸で、ユーザーが主観的に重要と感じる企業を管理するために使用する。

---

# 10. CompanyResource設計

## 10.1 目的

CompanyResourceは、Laravel側のCompanyモデルをReact / TypeScript側で扱いやすいレスポンス形式に変換するためのクラスである。

Laravel側のDBカラムはsnake_caseで定義している。

一方で、React側ではcamelCaseのCompany型として扱う。

そのため、CompanyResourceでAPIレスポンス形式を統一する。

---

## 10.2 変換対象

| Laravel / DB            | React / TypeScript    | 用途           |
| ----------------------- | --------------------- | -------------- |
| id                      | id                    | 企業ID         |
| name                    | name                  | 企業名         |
| media                   | media                 | 応募媒体       |
| priority                | priority              | 志望度・優先度 |
| status                  | status                | 選考ステータス |
| applied_date            | appliedDate           | 応募日         |
| interview_date          | interviewDate         | 面接日時       |
| job_url                 | jobUrl                | 求人URL        |
| interview_url           | interviewUrl          | 面接URL        |
| memo                    | memo                  | メモ           |
| next_action             | nextAction            | 次アクション   |
| document_result         | documentResult        | 書類選考結果   |
| first_interview_result  | firstInterviewResult  | 一次面接結果   |
| second_interview_result | secondInterviewResult | 二次面接結果   |
| final_result            | finalResult           | 最終結果       |
| rejection_stage         | rejectionStage        | 落選段階       |
| is_favorite             | isFavorite            | いいね状態     |
| created_at              | createdAt             | 作成日時       |
| updated_at              | updatedAt             | 更新日時       |

---

## 10.3 設計意図

CompanyResourceを通すことで、APIレスポンスの形式をReact側のCompany型に統一する。

これにより、以下のメリットがある。

- React側でsnake_case / camelCaseの混在を防げる
- CompanyTable、CompanyDetailModal、ActionListsで同じCompany型を使える
- APIレスポンス仕様をLaravel側に集約できる
- DBカラム名を変更せず、フロントエンド向けの形式だけ調整できる
- Dashboard APIや詳細モーダル連携時のデータ形式ズレを防げる

---

# 11. ルート順序の注意点

## 11.1 問題

/api/companies/dashboard が404になる問題が発生した。

## 11.2 原因

Route::apiResource('companies') が先に定義されていた場合、/companies/dashboard が /companies/{company} に吸われる可能性がある。

## 11.3 修正

固定ルートや特殊ルートをapiResourceより先に定義する。

    Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
    Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
    Route::apiResource('companies', CompanyController::class);

## 11.4 学習ポイント

Laravelでは、ルートは上から順に評価される。

そのため、固定URLは可変URLより先に書く。

---

# 12. 認可方針

## 12.1 目的

ログイン中ユーザーが、自分以外の企業データを操作できないようにする。

## 12.2 対象

以下のAPIでは、user_idによる絞り込みまたは所有者確認を行う。

- GET /api/companies
- POST /api/companies
- GET /api/companies/{company}
- PUT/PATCH /api/companies/{company}
- DELETE /api/companies/{company}
- GET /api/companies/dashboard
- PATCH /api/companies/{company}/favorite

## 12.3 方針

一覧取得時は、ログイン中ユーザーのuser_idに一致する企業のみ取得する。

登録時は、Auth::id()をuser_idとして保存する。

詳細取得・更新・削除・いいね切り替えでは、対象企業のuser_idがログイン中ユーザーのIDと一致することを確認する。

## 12.4 設計意図

- 他ユーザーの企業データを閲覧できないようにする
- 他ユーザーの企業データを更新できないようにする
- 他ユーザーの企業データを削除できないようにする
- Dashboard集計に他ユーザーの企業データが混ざらないようにする

---

# 13. エラーハンドリング方針

## 13.1 認証エラー

Bearer Tokenがない、または無効な場合は、認証必須APIへアクセスできない。

React側では、認証エラー時にログイン画面へ戻す方針とする。

## 13.2 バリデーションエラー

登録・更新時の入力値エラーは、StoreCompanyRequest / UpdateCompanyRequestで検証する。

例。

- 企業名が空
- URL形式が不正
- statusが許可されていない値
- priorityが許可されていない値

## 13.3 存在しない企業ID

存在しない企業IDにアクセスした場合は、404として扱う。

## 13.4 他ユーザーの企業ID

他ユーザーの企業IDにアクセスした場合は、取得・更新・削除・いいね切り替えを許可しない。

---

# 14. Feature Test対象

API設計上、以下の観点をFeature Testで確認する。

## 14.1 CompanyApiTest

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

## 14.2 CompanyDashboardApiTest

- Dashboard APIでsummaryを取得できる
- Dashboard APIで高優先度企業リストを取得できる
- Dashboard APIで面談予定企業リストを取得できる
- Dashboard APIで確認待ち企業リストを取得できる

## 14.3 今後追加したいテスト

- 未ログインではcompanies APIにアクセスできない
- ログイン中ユーザーの企業だけ一覧取得できる
- 他ユーザーの企業は更新できない
- 他ユーザーの企業は削除できない
- いいね切り替えができる
- 他ユーザーの企業をいいねできない
- /api/meでログイン中ユーザーを取得できる
- /api/logoutでTokenを削除できる

---

# 15. 今後の改善候補

## 15.1 PATCH API整理

現在はapiResourceによりPUT/PATCHの更新ルートを利用できる。

今後、インライン更新や部分更新が増える場合は、PATCH専用の責務整理を行う。

## 15.2 Service層導入

現時点ではLite版のため、Controller中心で実装している。

今後、Dashboard集計や通知、AI分析などのロジックが増えた場合は、Service層に分離する。

## 15.3 Policy導入

現在はController側でuser_id確認を行う方針。

今後、認可ルールが増える場合は、CompanyPolicyの導入を検討する。

---

# 16. まとめ

JobHunt LiteのAPI設計では、認証不要APIと認証必須APIを分離し、ログイン中ユーザーの企業データのみを扱う構成とする。

企業情報はCompanyResourceを通してReact向けのcamelCase形式に変換する。

Dashboard APIではsummaryとactionListsを返し、React側は表示責務に集中する。

Favorite APIではis_favoriteを切り替え、重要企業を視覚的に管理できるようにする。

ルート定義では、/companies/dashboard や /companies/{company}/favorite のような特殊ルートをapiResourceより先に書くことで、Laravelのルート評価順による誤解釈を防ぐ。
