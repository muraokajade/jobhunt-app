# docs/01_design/DB設計.md

## 更新日

2026/05/24

---

# 1. 概要

DB設計.mdでは、JobHunt Liteで使用するDBテーブルとカラム設計を整理する。

JobHunt Liteでは、転職活動の応募企業情報をcompaniesテーブルで管理する。

認証導入後は、companies.user_idによってusersテーブルと紐づけ、ログイン中ユーザー本人の企業データだけを表示・操作する。

---

# 2. 使用テーブル

JobHunt Liteで主に使用するテーブルは以下。

- users
- companies

---

# 3. usersテーブル

usersテーブルはLaravel標準の認証ユーザーテーブルを使用する。

Laravel SanctumによるBearer Token認証を導入し、ログイン中ユーザーを判定する。

companiesテーブルとは1対多の関係になる。

    users 1 : N companies

---

# 4. companiesテーブル

companiesテーブルは、応募企業情報を管理する中心テーブルである。

| カラム名                | 型        | null | デフォルト     | 用途           |
| ----------------------- | --------- | ---: | -------------- | -------------- |
| id                      | bigint    |   NO | auto increment | 企業ID         |
| user_id                 | foreignId |  YES | null           | 所有ユーザーID |
| name                    | string    |   NO | -              | 企業名         |
| media                   | string    |  YES | null           | 応募媒体       |
| priority                | string    |  YES | null           | 志望度・優先度 |
| status                  | string    |   NO | 応募済み       | 選考状況       |
| applied_date            | date      |  YES | null           | 応募日         |
| interview_date          | dateTime  |  YES | null           | 面接日時       |
| job_url                 | text      |  YES | null           | 求人URL        |
| interview_url           | text      |  YES | null           | 面談URL        |
| memo                    | text      |  YES | null           | メモ           |
| next_action             | string    |  YES | null           | 次アクション   |
| document_result         | string    |  YES | null           | 書類選考結果   |
| first_interview_result  | string    |  YES | null           | 1次面接結果    |
| second_interview_result | string    |  YES | null           | 2次面接結果    |
| final_result            | string    |  YES | null           | 最終結果       |
| rejection_stage         | string    |  YES | null           | 落選段階       |
| is_favorite             | boolean   |   NO | false          | いいね状態     |
| created_at              | timestamp |  YES | null           | 作成日時       |
| updated_at              | timestamp |  YES | null           | 更新日時       |

---

# 5. migration構成

companiesテーブルは、以下の流れで拡張されている。

## 5.1 companiesテーブル作成

初期migrationでは、企業名、媒体、選考状況、応募日、面接日時、URL、メモ、選考結果、落選段階などを作成する。

主なカラムは以下。

- name
- media
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
- timestamps

## 5.2 priority追加

後続migrationでpriorityを追加する。

priorityは、志望度・優先度を表すカラムである。

    $table->string('priority')->nullable()->after('media');

## 5.3 user_id / is_favorite追加

認証・いいね機能の追加により、user_idとis_favoriteを追加する。

user_idはusersテーブルとの外部キーである。

is_favoriteは、企業を重要企業として扱うためのbooleanフラグである。

    $table->foreignId('user_id')
        ->nullable()
        ->after('id')
        ->constrained()
        ->cascadeOnDelete();

    $table->boolean('is_favorite')
        ->default(false)
        ->after('rejection_stage');

---

# 6. user_id設計

companiesはusersに紐づく。

    users 1 : N companies

企業登録時に、ログイン中ユーザーのIDをcompanies.user_idに保存する。

    $data['user_id'] = Auth::id();

一覧取得時は、ログイン中ユーザー本人の企業だけ取得する。

    Company::where('user_id', Auth::id())->get();

更新・削除・いいね切り替え時も、ログイン中ユーザー本人の企業だけを対象にする。

---

# 7. user_idをnullableにしている理由

user_idはnullableで定義している。

理由は、認証導入前に作成された既存データとの互換性を考慮しているためである。

新規登録時はAuth::id()を設定する方針とする。

将来的に既存データを整理できた場合は、nullableを外すことも検討できる。

---

# 8. cascadeOnDelete設計

user_idはusersテーブルへの外部キーとして定義する。

    ->constrained()
    ->cascadeOnDelete()

これにより、ユーザーが削除された場合、そのユーザーに紐づくcompaniesも削除される。

ユーザーに紐づかない企業データだけが残ることを防ぐためである。

---

# 9. is_favorite設計

is_favoriteはSNS的ないいねではなく、自分の企業に対する注目フラグである。

そのため、likesテーブルは作らず、companiesテーブルにbooleanカラムとして持たせる。

| 値        | 意味       |
| --------- | ---------- |
| false / 0 | 未いいね   |
| true / 1  | いいね済み |

## 9.1 is_favoriteをcompaniesに持たせる理由

JobHunt Liteでは、いいねは他ユーザーとの関係を表すものではない。

あくまで、自分が重要だと感じる企業に印を付けるためのフラグである。

そのため、中間テーブルやlikesテーブルを作るよりも、companies.is_favoriteで管理する方がシンプルである。

---

# 10. Companyモデルとの関係

Companyモデルでは、companiesテーブルに対応するfillableを定義する。

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

---

# 11. casts設計

Companyモデルでは、以下のcastsを設定する方針とする。

    protected $casts = [
        'is_favorite' => 'boolean',
        'applied_date' => 'date',
        'interview_date' => 'datetime',
    ];

## 11.1 castsの目的

castsは、DBから取得した値をLaravel側で扱いやすい型に変換する設定である。

JobHunt Liteでは、主に以下の目的で使用する。

- is_favoriteをtrue / falseとして扱う
- applied_dateを日付として扱う
- interview_dateを日時として扱う
- DB上の値とアプリ側の型のズレを吸収する
- React側へ返す前のデータ型を安定させる

---

# 12. CompanyResourceとの関係

DBカラムはLaravel側の命名に合わせてsnake_caseで定義する。

一方、React / TypeScript側ではcamelCaseで扱う。

そのため、APIレスポンスではCompanyResourceを通して変換する。

| DB                      | React                 |
| ----------------------- | --------------------- |
| applied_date            | appliedDate           |
| interview_date          | interviewDate         |
| job_url                 | jobUrl                |
| interview_url           | interviewUrl          |
| next_action             | nextAction            |
| document_result         | documentResult        |
| first_interview_result  | firstInterviewResult  |
| second_interview_result | secondInterviewResult |
| final_result            | finalResult           |
| rejection_stage         | rejectionStage        |
| is_favorite             | isFavorite            |

---

# 13. URLカラム設計

job_urlとinterview_urlはtext nullableで定義する。

理由は、URLが長くなる可能性があるためである。

- job_url: 求人票URL
- interview_url: 面談URL

---

# 14. status設計

statusは選考状況を表すカラムである。

デフォルト値は「応募済み」とする。

    $table->string('status')->default('応募済み');

想定値は以下。

- 応募済み
- 書類選考中
- 面談予定
- 返答待ち
- 内定
- 落選

---

# 15. priority設計

priorityは志望度・優先度を表すカラムである。

nullableとする。

想定値は以下。

- 高
- 中
- 低

高優先度企業は、Dashboard APIのsummary.highPriorityやactionLists.highPriorityで利用する。

---

# 16. rejection_stage設計

rejection_stageは、落選した場合の選考段階を表す。

想定値は以下。

- 書類落ち
- 1次面接落ち
- 2次面接落ち
- 最終落ち

CompanyDetailModalでは、選考結果で不通過を選んだ場合、statusとrejection_stageを自動補助する。

---

# 17. 今後の拡張候補

今後の拡張候補として、以下のテーブル追加を検討する。

## 17.1 selection_logs

選考履歴を時系列で管理するテーブル。

例。

- company_id
- status
- memo
- changed_at

## 17.2 calendar_events

Googleカレンダー連携や面談予定を管理するテーブル。

例。

- company_id
- event_title
- start_at
- end_at
- meeting_url

## 17.3 job_descriptions

求人票情報を構造化して管理するテーブル。

例。

- company_id
- title
- salary
- location
- required_skills
- preferred_skills

## 17.4 ai_analysis_results

AI分析結果を保存するテーブル。

例。

- company_id
- analysis_type
- result_json
- created_at

---

# 18. まとめ

JobHunt LiteのDB設計では、companiesテーブルを中心に応募企業情報を管理する。

認証導入後は、companies.user_idによってusersテーブルと紐づけ、ログイン中ユーザー本人の企業データだけを取得・更新・削除する。

いいね機能はSNS的なlikeではなく、自分用の注目フラグであるため、likesテーブルではなくcompanies.is_favoriteで管理する。

DBカラムはLaravel側でsnake_case、React側ではCompanyResourceを通してcamelCaseとして扱う。

今後Pro版へ拡張する場合は、selection_logs、calendar_events、job_descriptions、ai_analysis_resultsなどの追加を検討する。
