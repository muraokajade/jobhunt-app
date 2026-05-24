# JobHunt Lite 詳細設計書 最新版

## 更新日

2026/05/24

## 参照元

- 現在の詳細設計書下書き: :contentReference[oaicite:0]{index=0}

---

## 今回の差分

今回の更新では、古い設計書に残っていた実装状況とのズレを修正した。

主な差分は以下。

- 「認証はLite版から外す」という古い記述を削除
- 認証、ログイン、ログアウト、登録、Bearer Token、user_id紐づけを完成範囲に追加
- いいね機能を完成範囲、DB設計、CompanyTable仕様、Favorite設計に反映
- companiesテーブルの最新カラムを反映
- Companyモデル設計を追加
- castsの役割を追加
- userリレーション方針を追加
- routes/api.phpを元にAPIルート設計を追加
- auth:sanctum middleware配下のAPIを整理
- /me の役割を追加
- CompanyResource設計を追加
- snake_caseからcamelCaseへの変換方針を明記
- Dashboard APIのactionListsにもCompanyResourceを通す方針を明記
- Pro拡張候補から認証・ログイン・ユーザー別企業管理を削除
- Lite版の完成条件に認証・いいね・user_id紐づけを追加

---

# 1. 概要

JobHunt Liteは、Laravel × React / TypeScriptで作成した転職活動管理アプリである。

もともとはLaravel復習用のTaskLogから始まり、自分のExcel転職ログをWebアプリ化する方向で発展した。

現在は単なるCRUDアプリではなく、以下を含む実務寄りポートフォリオ・Udemy教材原型として整理する。

- Laravel API
- React / TypeScript UI
- 企業CRUD
- 検索・絞り込み
- 詳細モーダル編集
- Dashboard API
- SummaryCards
- ActionLists
- いいね機能
- ログイン / ログアウト / 登録
- user_idによるユーザー別企業管理
- Laravel SanctumによるBearer Token認証
- CompanyResource
- FormRequest
- Feature Test 15pass

---

# 2. 目的

JobHunt Liteの目的は、転職活動中の企業情報、選考状況、次アクションを一画面で管理できるようにすることである。

単なるTodoアプリではなく、実際の転職活動で発生する以下の情報を扱う。

- どの企業に応募したか
- どの媒体から応募したか
- 現在の選考状況は何か
- 次に何をすべきか
- 面談URLや求人URLはどこか
- 書類、一次、二次、最終の結果はどうか
- どの企業を優先的に確認すべきか
- どの企業が落選したか
- どの企業を重要企業として扱うか

また、ポートフォリオとしては、Laravel API、React / TypeScript、認証、DB設計、API設計、テスト、設計書整理まで説明できる状態を目指す。

---

# 3. ゴール

JobHunt Liteのゴールは、以下を満たすことである。

- 企業を登録できる
- 企業一覧を表示できる
- 検索・絞り込みできる
- 詳細モーダルで編集できる
- priority / statusをインライン更新できる
- SummaryCardsで転職活動状況を把握できる
- ActionListsで次に確認すべき企業を把握できる
- Dashboard APIからsummary / actionListsを取得できる
- 企業をいいね登録できる
- ログイン中ユーザーごとに企業データを分離できる
- CompanyResourceでAPIレスポンス形式を統一できる
- Feature Test 15passを維持できる
- README、面接説明、Udemy教材化へ転用できる

---

# 4. 最新の完成範囲

## 4.1 Backend

- Company CRUD API
- StoreCompanyRequest
- UpdateCompanyRequest
- CompanyResource
- CompanyFactory
- CompanyApiTest
- CompanyDashboardController
- CompanyDashboardApiTest
- AuthController
- Laravel Sanctum認証
- Bearer Token認証
- user_idによる企業データ紐づけ
- favorite toggle
- Feature Test 15pass

## 4.2 Frontend

- AppHeader
- Hero
- 登録 / 一覧 切り替え
- SearchForm
- SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal
- login / register画面
- logout
- authToken state
- localStorage token保存
- Dashboard API接続
- いいねハートUI
- 落選企業の視覚的区別
- 5件以上もっと見る
- select自動補完
- types分離
- constants分離
- utils分離

---

# 5. Lite版から外したもの

以下はLite版では深追いしない。

- Googleカレンダー連携
- 通知
- AIによる応募状況分析
- AIによる落選理由分析
- CSV / Excelインポート
- 複雑な権限管理
- SaaS運用
- 決済機能
- 複数ワークスペース管理
- 本格的なService層分離
- 完全なPro版Dashboard

これらはJobHunt Proの拡張候補として扱う。

Lite版では、まず「応募企業を登録し、選考状況を管理し、Dashboardで把握できる」状態を完成ラインとする。

---

# 6. 現在の画面構成

## 6.1 画面順

1. AppHeader
2. Hero
3. 登録 / 一覧 切り替えボタン
4. SummaryCards
5. SearchForm
6. ActionLists
7. CompanyRegisterForm または CompanyTable
8. CompanyDetailModal

## 6.2 設計意図

JobHunt Liteは、1画面完結型のSPAとして設計する。

ユーザーの主操作は以下。

- 企業を登録する
- 企業を検索する
- 一覧で状況を確認する
- 詳細モーダルで編集する
- 選考状況を更新する
- 重要企業をいいねする
- Dashboardで現在の転職活動状況を確認する

ActionListsは補助情報として扱うため、アコーディオン形式にして画面占有を抑える。

---

# 7. DB設計

## 7.1 companiesテーブル

companiesテーブルは、応募企業情報を管理する中心テーブルである。

| カラム名                | 型        | null | デフォルト     | 用途           |
| ----------------------- | --------- | ---: | -------------- | -------------- |
| id                      | bigint    |   NO | auto increment | 企業ID         |
| user_id                 | foreignId |  YES | null           | 登録ユーザーID |
| name                    | string    |   NO | -              | 企業名         |
| media                   | string    |  YES | null           | 応募媒体       |
| priority                | string    |  YES | null           | 志望度・優先度 |
| status                  | string    |   NO | 応募済み       | 選考ステータス |
| applied_date            | date      |  YES | null           | 応募日         |
| interview_date          | dateTime  |  YES | null           | 面接日時       |
| job_url                 | text      |  YES | null           | 求人URL        |
| interview_url           | text      |  YES | null           | 面接URL        |
| memo                    | text      |  YES | null           | メモ           |
| next_action             | string    |  YES | null           | 次アクション   |
| document_result         | string    |  YES | null           | 書類選考結果   |
| first_interview_result  | string    |  YES | null           | 一次面接結果   |
| second_interview_result | string    |  YES | null           | 二次面接結果   |
| final_result            | string    |  YES | null           | 最終面接結果   |
| rejection_stage         | string    |  YES | null           | 落選ステージ   |
| is_favorite             | boolean   |   NO | false          | いいね状態     |
| created_at              | timestamp |  YES | null           | 作成日時       |
| updated_at              | timestamp |  YES | null           | 更新日時       |

## 7.2 DB設計上の補足

companiesテーブルは、転職活動における応募企業情報を管理する中心テーブルである。

認証導入により、各企業データはuser_idによってusersテーブルと紐づく。

一覧取得、詳細取得、更新、削除、いいね切り替えでは、ログイン中ユーザーのuser_idに一致する企業のみを操作対象とする。

なお、user_idは既存データとの互換性を考慮してnullableとしている。

新規登録時はAuth::id()を設定する方針とする。

---

# 8. Companyモデル設計

## 8.1 目的

Companyモデルは、companiesテーブルに対応するEloquentモデルである。

応募企業の基本情報、選考情報、URL情報、選考結果、いいね状態、ユーザー紐づけを扱う。

## 8.2 fillable

Companyモデルでは、一括代入を許可するカラムをfillableで定義する。

対象カラムは以下。

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

## 8.3 casts

is_favorite、applied_date、interview_dateは、Laravel側で型変換する。

    protected $casts = [
        'is_favorite' => 'boolean',
        'applied_date' => 'date',
        'interview_date' => 'datetime',
    ];

## 8.4 設計意図

- is_favoriteをtrue / falseとして扱う
- applied_dateを日付として扱う
- interview_dateを日時として扱う
- DB上の値とアプリ側の型のズレを吸収する
- React側へ返す前のデータ型を安定させる

## 8.5 userリレーション

CompanyはUserに belongsTo する。

    public function user()
    {
        return $this->belongsTo(User::class);
    }

企業データをログインユーザー単位で管理するため、CompanyとUserの関連を明示する。

---

# 9. APIルート設計

## 9.1 目的

JobHunt Liteでは、認証不要APIと認証必須APIを明確に分ける。

ユーザー登録・ログインは未ログイン状態で利用するため認証不要とし、それ以外のユーザー固有データを扱うAPIはauth:sanctum middleware配下に配置する。

## 9.2 認証不要API

| Method | Endpoint      | Controller              | 用途                       |
| ------ | ------------- | ----------------------- | -------------------------- |
| POST   | /api/register | AuthController@register | 新規ユーザー登録           |
| POST   | /api/login    | AuthController@login    | ログイン・Bearer Token発行 |

## 9.3 認証必須API

| Method    | Endpoint                          | Controller                       | 用途                       |
| --------- | --------------------------------- | -------------------------------- | -------------------------- |
| GET       | /api/me                           | AuthController@me                | ログイン中ユーザー情報取得 |
| POST      | /api/logout                       | AuthController@logout            | ログアウト                 |
| GET       | /api/companies/dashboard          | CompanyDashboardController@index | Dashboard用集計データ取得  |
| PATCH     | /api/companies/{company}/favorite | CompanyController@toggleFavorite | いいね状態切り替え         |
| GET       | /api/companies                    | CompanyController@index          | 企業一覧取得               |
| POST      | /api/companies                    | CompanyController@store          | 企業登録                   |
| GET       | /api/companies/{company}          | CompanyController@show           | 企業詳細取得               |
| PUT/PATCH | /api/companies/{company}          | CompanyController@update         | 企業情報更新               |
| DELETE    | /api/companies/{company}          | CompanyController@destroy        | 企業削除                   |

## 9.4 ルート順序の注意点

/api/companies/dashboard や /api/companies/{company}/favorite は、Route::apiResource('companies', CompanyController::class) より先に定義する。

理由は、apiResourceが /companies/{company} という可変URLを持つためである。

先にapiResourceを書くと、/companies/dashboard が {company} として解釈される可能性がある。

そのため、固定URLや特殊URLはapiResourceより上に書く。

    Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
    Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
    Route::apiResource('companies', CompanyController::class);

## 9.5 設計意図

- 認証不要APIと認証必須APIを分離する
- 企業データはログイン中ユーザー単位で扱う
- Dashboardやfavoriteも本人の企業だけを対象にする
- Laravelのルート評価順による404や誤解釈を防ぐ

---

# 10. 認証設計

## 10.1 目的

JobHunt Liteでは、応募企業データをユーザー本人に紐づけて管理する。

そのため、Laravel SanctumによるBearer Token認証を導入し、ログイン中ユーザーだけが自分の企業データを操作できる構成とする。

## 10.2 認証API

| Method | Endpoint      | 用途                   | 認証 |
| ------ | ------------- | ---------------------- | ---- |
| POST   | /api/register | ユーザー登録           | 不要 |
| POST   | /api/login    | ログイン・Token発行    | 不要 |
| GET    | /api/me       | ログイン中ユーザー取得 | 必要 |
| POST   | /api/logout   | ログアウト・Token削除  | 必要 |

## 10.3 middleware設計

/api/register と /api/login は、未ログインユーザーが利用するため認証不要とする。

一方で、/api/me、/api/logout、companies系API、Dashboard API、favorite APIは、auth:sanctum middleware配下に配置する。

auth:sanctumはAPIアクセス前の門番として機能し、正しいBearer Tokenを持つユーザーだけを通す。

## 10.4 user_id紐づけ

companiesテーブルにはuser_idを持たせる。

企業登録時には、ログイン中ユーザーのIDをAuth::id()で取得し、companies.user_idに保存する。

一覧取得・詳細取得・更新・削除・いいね切り替えでは、ログイン中ユーザーの企業だけを対象にする。

## 10.5 /me の役割

/api/me は、現在ログイン中のユーザー情報を返すAPIである。

React側では、localStorageに保存したtokenが有効かどうかを確認するために利用する。

リロード後もtokenが残っている場合、/api/me にBearer Token付きでアクセスし、ユーザー情報が取得できればログイン状態として扱う。

## 10.6 設計意図

- 他ユーザーの企業データを閲覧・編集できないようにする
- Dashboard集計もログイン中ユーザーのデータだけを対象にする
- React側はlocalStorageに保存したtokenを使ってAPIへアクセスする
- リロード後もtokenが残っていれば /api/me でログイン状態を確認できる

---

# 11. CompanyResource設計

## 11.1 目的

CompanyResourceは、Laravel側のCompanyモデルをReact / TypeScript側で扱いやすいレスポンス形式に変換するためのクラスである。

Laravel側のDBカラムはsnake_caseで定義しているが、React側ではcamelCaseのCompany型として扱う。

そのため、CompanyResourceでAPIレスポンス形式を統一し、フロントエンド側の型・表示・編集処理を安定させる。

## 11.2 変換対象

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

## 11.3 設計意図

CompanyResourceを通すことで、APIレスポンスの形式をReact側のCompany型に統一する。

これにより、以下のメリットがある。

- React側でsnake_case / camelCaseの混在を防げる
- CompanyTable、CompanyDetailModal、ActionListsで同じCompany型を使える
- APIレスポンス仕様をLaravel側に集約できる
- DBカラム名を変更せず、フロントエンド向けの形式だけ調整できる
- Dashboard APIや詳細モーダル連携時のデータ形式ズレを防げる

## 11.4 注意点

Dashboard APIのactionListsで企業情報を返す場合も、CompanyResourceを通す。

CompanyResourceを通さずにCompanyモデルをそのまま返すと、applied_date / interview_date などのsnake_caseが混在し、React側のCompany型とズレる。

そのため、企業情報をAPIで返す場合は、原則としてCompanyResourceを使う方針とする。

---

# 12. 登録 / 一覧切り替え仕様

## 12.1 目的

企業登録フォームと企業一覧を同時に大きく表示すると、画面密度が高くなりすぎる。

そのため、Hero右側に「登録」「一覧」ボタンを配置し、表示対象を切り替える。

## 12.2 表示仕様

- 登録ボタン押下時：CompanyRegisterFormを表示
- 一覧ボタン押下時：CompanyTableを表示
- 初期表示：一覧

## 12.3 登録成功時

企業登録成功後は、一覧表示へ切り替える。

理由は以下。

- 登録後すぐに追加された企業を確認したいため
- SummaryCardsやActionListsの更新を確認しやすいため

---

# 13. CompanyTable仕様

## 13.1 目的

企業一覧を業務アプリの管理表として表示する。

## 13.2 表示項目

- いいね
- 企業名
- 媒体
- 志望度
- 状況
- 応募日
- 面談日
- 次アクション
- 書類
- 1次
- メモ
- 操作

## 13.3 操作

- いいね切り替え
- priorityインライン更新
- statusインライン更新
- 詳細モーダル表示
- 削除

## 13.4 表示件数

初期表示は5件まで。

5件を超える場合は、下部に「もっと見る」ボタンを表示する。

## 13.5 もっと見る仕様

- 初期表示：5件まで表示
- もっと見る押下：全件表示
- 閉じる押下：5件表示に戻す

## 13.6 落選企業表示

落選企業は赤系で表示する。

ただし、操作は可能。

理由は以下。

- 落選企業は削除対象ではなく、分析対象であるため
- 詳細モーダルやメモで落選原因を追えるようにするため
- 後から選考状況を修正できるようにするため

## 13.7 将来拡張

- 落選企業の表示 / 非表示切り替え
- 落選理由のカテゴリ化
- 落選ステージ別集計
- 改善メモの追加

---

# 14. CompanyDetailModal仕様

## 14.1 目的

一覧に常時表示しない詳細情報を確認・編集する。

初回登録では、応募直後に分かる情報だけを入力する。

詳細モーダルでは、選考が進んだ後の情報を編集する。

## 14.2 初回登録で扱う情報

- 企業名
- 媒体
- 志望度
- 求人URL
- メモ

## 14.3 詳細モーダルで扱う情報

- status
- priority
- job_url
- interview_url
- interview_date
- next_action
- document_result
- first_interview_result
- second_interview_result
- final_result
- rejection_stage
- memo

## 14.4 セクション構成

1. 基本情報
   - 企業名
   - 媒体
   - 応募日

2. 選考情報
   - 志望度
   - 状況
   - 面談日
   - 次アクション

3. URL情報
   - 求人URL
   - 面談URL

4. 選考結果
   - 書類選考
   - 1次面接
   - 2次面接
   - 最終結果
   - 落選段階

5. メモ
   - メモ

6. 操作
   - キャンセル
   - 保存

## 14.5 自動補助仕様

選考結果で「不通過」を選択した場合、statusとrejection_stageを自動補助する。

- 書類選考：不通過 → status: 落選 / rejection_stage: 書類落ち
- 1次面接：不通過 → status: 落選 / rejection_stage: 1次面接落ち
- 2次面接：不通過 → status: 落選 / rejection_stage: 2次面接落ち
- 最終結果：不通過 → status: 落選 / rejection_stage: 最終落ち
- 最終結果：通過 → status: 内定 / rejection_stage: 空

## 14.6 disabledにしない理由

statusやrejection_stageはdisabledにしない。

理由は以下。

- ユーザーが入力ミスを修正できるようにするため
- 例外的な選考状況に対応するため
- 自動反映は入力制限ではなく入力補助として扱うため

---

# 15. ActionLists仕様

## 15.1 目的

次に確認すべき企業を補助的に表示する。

## 15.2 表示形式

ActionListsはアコーディオン形式とする。

初期状態では閉じておき、必要に応じて開く。

## 15.3 表示リスト

- 面談予定
- 確認待ち
- 高優先度

## 15.4 データ取得

Laravel Dashboard APIのactionListsを優先して使用する。

API未取得時は、companiesからReact側で計算するfallbackを残す。

## 15.5 詳細モーダル連携

各企業カードの詳細ボタンから、CompanyDetailModalを開く。

ActionListsから詳細モーダルを開く場合も、CompanyResource形式のCompany型を使う。

これにより、CompanyTableから開いた場合とActionListsから開いた場合でデータ形式がズレる問題を防ぐ。

---

# 16. SummaryCards仕様

## 16.1 目的

転職活動状況の件数を一目で表示する。

## 16.2 表示項目

- 応募総数
- 面談予定
- 返答待ち
- 内定
- 落選
- 高優先度

## 16.3 データ取得

Laravel Dashboard APIのsummaryを優先して使用する。

API未取得時は、companiesからReact側で計算するfallbackを残す。

---

# 17. Dashboard API仕様

## 17.1 Endpoint

GET /api/companies/dashboard

## 17.2 認証

必要。

auth:sanctum middleware配下に配置する。

Dashboard APIはログイン中ユーザーの企業データのみを集計対象とする。

## 17.3 返却内容

- summary
- actionLists

## 17.4 summary

件数カード用の情報を返す。

- total
- interview
- waiting
- offer
- rejected
- highPriority

## 17.5 actionLists

重要企業リストを返す。

- interviews
- waiting
- highPriority

## 17.6 設計意図

Dashboard用の集計・抽出処理をLaravel側に寄せる。

目的は以下。

- 集計ルールをバックエンドに集約する
- Feature TestでDashboardロジックを検証する
- React側を表示責務に寄せる
- 実務に近い構成にする
- ログイン中ユーザーの企業だけを集計する

---

# 18. Favorite設計

## 18.1 目的

重要な企業をユーザーがすぐ見分けられるようにする。

転職活動では、すべての企業を同じ温度感で管理するわけではない。

志望度が高い企業、返信待ちで追いたい企業、面談準備が必要な企業を視覚的に区別するため、いいね機能を用意する。

## 18.2 DB

companiesテーブルにis_favoriteを持たせる。

| カラム名    | 型      | デフォルト | 用途       |
| ----------- | ------- | ---------- | ---------- |
| is_favorite | boolean | false      | いいね状態 |

## 18.3 API

| Method | Endpoint                          | 用途               | 認証 |
| ------ | --------------------------------- | ------------------ | ---- |
| PATCH  | /api/companies/{company}/favorite | いいね状態切り替え | 必要 |

## 18.4 Backend処理

対象企業のis_favoriteを反転する。

trueの場合はfalseへ、falseの場合はtrueへ切り替える。

ログイン中ユーザーの企業だけを対象にする。

## 18.5 Frontend処理

Company型にisFavoriteを持たせる。

CompanyTableにいいねボタンを表示する。

いいね済みの場合は視覚的に区別する。

## 18.6 設計意図

- 重要企業を素早く見分ける
- DashboardやActionListsの将来拡張に使える
- 志望度priorityとは別軸で管理できる
- ユーザーの主観的な重要度を表現できる

---

# 19. 検索・絞り込み仕様

## 19.1 目的

登録企業数が増えても、必要な企業を素早く見つけられるようにする。

## 19.2 検索条件

- keyword
- status
- media

## 19.3 keyword検索対象

- 企業名
- メモ
- 次アクション

## 19.4 絞り込み対象

- status
- media

## 19.5 複合検索

keyword + status の複合検索に対応する。

## 19.6 設計意図

検索・絞り込みはReact側だけで完結させず、Laravel API側でも対応する。

これにより、将来的に件数が増えた場合でもAPI側で絞り込める構成にできる。

---

# 20. FormRequest設計

## 20.1 目的

登録・更新時のバリデーションをControllerから分離する。

Controllerに直接バリデーションを書くと、処理の見通しが悪くなる。

そのため、StoreCompanyRequestとUpdateCompanyRequestを用意し、入力検証責務を分離する。

## 20.2 StoreCompanyRequest

企業登録時に使用する。

主な検証対象は以下。

- name
- media
- priority
- job_url
- memo

## 20.3 UpdateCompanyRequest

企業更新時に使用する。

主な検証対象は以下。

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

## 20.4 設計意図

- Controllerを薄く保つ
- バリデーションルールを再利用しやすくする
- テストしやすくする
- Laravelらしい責務分離にする

---

# 21. Feature Test仕様

## 21.1 現在の状態

Feature Test 15pass。

## 21.2 CompanyApiTest：11 tests

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

## 21.3 CompanyDashboardApiTest：4 tests

- Dashboard APIでsummaryを取得できる
- Dashboard APIで高優先度企業リストを取得できる
- Dashboard APIで面談予定企業リストを取得できる
- Dashboard APIで確認待ち企業リストを取得できる

## 21.4 テスト設計意図

- CRUDの基本動作を保証する
- バリデーションが効くことを保証する
- 検索・絞り込みが意図通り動くことを保証する
- Dashboard APIの集計・抽出結果を保証する
- 実務寄りのAPI品質を説明できる状態にする

---

# 22. テスト仕様の詰まりポイント

## 22.1 assertJsonMissing

assertJsonMissingはレスポンス全体を対象にする。

そのため、特定配列内に存在しないことを確認したい場合には強すぎる場合がある。

今回のようにactionLists.highPriorityの中身だけ確認したい場合は、以下の組み合わせが適している。

- assertJsonCount
- assertJsonPath

## 22.2 assertJsonCount

特定のJSON配列の件数を確認する。

例。

actionLists.highPriorityが1件であることを確認する。

## 22.3 assertJsonPath

特定のJSONパスの値を確認する。

例。

actionLists.highPriority.0.name が 高優先度株式会社 であることを確認する。

---

# 23. Route設計メモ

## 23.1 問題

/api/companies/dashboard が404になる問題が発生した。

## 23.2 原因

Route::apiResource('companies') が先に定義されていたため、/companies/dashboard が /companies/{company} に吸われた。

## 23.3 修正

固定ルートをapiResourceより先に定義する。

    Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
    Route::patch('/companies/{company}/favorite', [CompanyController::class, 'toggleFavorite']);
    Route::apiResource('companies', CompanyController::class);

## 23.4 学習ポイント

Laravelでは、ルートは上から順に評価される。

固定URLは可変URLより先に書く。

---

# 24. Pro拡張候補

JobHunt Proで検討する内容。

- Googleカレンダー連携
- 通知
- 面談リマインド
- 次アクション提案
- AIによる応募状況分析
- AIによる落選理由分析
- 媒体別成果分析
- 応募ファネル分析
- 条件比較
- 企業ごとの温度感管理
- 書類・面談メモ管理
- 落選企業の表示 / 非表示切り替え
- 選考履歴ログ
- AI求人票構造化
- AI面談準備メモ
- CSV / Excelインポート
- Service層導入
- PATCH API整理
- SaaS化検討

---

# 25. Udemy教材化方針

JobHunt本体をそのまますべて見せるのではなく、教材用にJobHunt Lite / JobHunt Tutorialとして整理する。

講座の方向性は以下。

Todoアプリより実用的な、Laravel × Reactで作る実務寄り転職活動管理アプリ。

Tailwind CSSは深掘りしない。

Tailwindは完成コードをベースに扱い、講座ではLaravel API、React state、TypeScript、FormRequest、Resource、設計判断を中心に解説する。

## 25.1 教材化で重視すること

- なぜこのDB設計にしたか
- なぜ初回登録と詳細更新を分けたか
- なぜFormRequestを使うか
- なぜCompanyResourceを使うか
- なぜDashboard集計をLaravel側に寄せるか
- なぜauth:sanctum middleware配下にcompanies系APIを置くか
- なぜuser_idで企業データを分離するか
- なぜFeature Testを書くか

---

# 26. 最新の完了条件

JobHunt Liteは以下を満たしたら完成扱いとする。

- 企業登録できる
- 企業一覧を表示できる
- 検索・絞り込みできる
- 詳細モーダルで編集できる
- priority / statusをインライン更新できる
- SummaryCardsがDashboard API優先で表示される
- ActionListsがDashboard API優先で表示される
- ActionListsから詳細モーダルを開ける
- Dashboard APIがsummary / actionListsを返す
- CompanyResourceでAPIレスポンス形式が統一されている
- いいね機能が動作する
- ログイン / ログアウト / 登録が動作する
- Bearer Token認証が動作する
- ログイン中ユーザーの企業だけ表示・操作できる
- 落選企業が赤系で視覚的に区別される
- 企業一覧は5件まで初期表示し、もっと見るで展開できる
- Feature Test 15pass
- READMEが整っている
- GitHubにpushされている

---

# 27. 次に整理するファイル

この詳細設計書を親ドキュメントとして、次に以下のファイルへ分配する。

- docs/01_design/API設計.md
- docs/01_design/DB設計.md
- docs/01_design/認証設計.md
- docs/01_design/Favorite設計.md
- docs/01_design/Dashboard設計.md
- docs/01_design/Test設計.md
- docs/02_udemy/Udemyチャプター構成.md
- docs/02_udemy/詰まりポイント一覧.md
- docs/03_readme/README下書き.md

---
