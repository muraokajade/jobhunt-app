# JobHunt DB 設計

## 概要

JobHunt では、MVP 段階では `companies` テーブルを中心に構成する。

まずは 1 テーブルで応募企業・選考状況・面談日・次アクションを管理する。

将来的に面談ログやユーザー管理を追加する場合は、別テーブルへ分離する。

---

## companies テーブル

### 目的

応募企業ごとの選考状況を管理する。

### カラム一覧

| カラム名                | 型        | NULL | 説明           |
| ----------------------- | --------- | ---- | -------------- |
| id                      | bigint    | 不可 | 主キー         |
| name                    | string    | 不可 | 企業名         |
| media                   | string    | 可   | 応募媒体       |
| status                  | string    | 不可 | 現在の選考状況 |
| applied_date            | date      | 可   | 応募日         |
| interview_date          | datetime  | 可   | 面談日         |
| job_url                 | text      | 可   | 求人 URL       |
| interview_url           | text      | 可   | 面談 URL       |
| memo                    | text      | 可   | メモ           |
| next_action             | string    | 可   | 次アクション   |
| document_result         | string    | 可   | 書類選考結果   |
| first_interview_result  | string    | 可   | 1 次面接結果   |
| second_interview_result | string    | 可   | 2 次面接結果   |
| final_result            | string    | 可   | 最終結果       |
| rejection_stage         | string    | 可   | 落選段階       |
| created_at              | timestamp | 可   | 作成日時       |
| updated_at              | timestamp | 可   | 更新日時       |

---

## status 候補

現在の選考状況を表す。

```txt
応募済み
書類選考待ち
面談日程調整中
面談予定
面談後返答待ち
内定
辞退
落選
```

### 補足

`status` は現在の状態を表すメイン項目。

Dashboard や一覧の集計では、この値を中心に利用する。

---

## result 候補

書類選考、1 次面接、2 次面接、最終結果で共通利用する。

```txt
未対応
通過
不通過
保留
辞退
```

対象カラムは以下。

- document_result
- first_interview_result
- second_interview_result
- final_result

---

## rejection_stage 候補

落選した段階を表す。

```txt
書類落ち
1次面接落ち
2次面接落ち
最終落ち
条件不一致
辞退
```

### 補足

`status = 落選` の場合に入力する。

辞退も広義の終了理由として扱う。

---

## Laravel Migration 案

```php
Schema::create('companies', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('media')->nullable();
    $table->string('status')->default('応募済み');
    $table->date('applied_date')->nullable();
    $table->dateTime('interview_date')->nullable();
    $table->text('job_url')->nullable();
    $table->text('interview_url')->nullable();
    $table->text('memo')->nullable();
    $table->string('next_action')->nullable();
    $table->string('document_result')->nullable();
    $table->string('first_interview_result')->nullable();
    $table->string('second_interview_result')->nullable();
    $table->string('final_result')->nullable();
    $table->string('rejection_stage')->nullable();
    $table->timestamps();
});
```

---

## 将来的に追加する可能性があるテーブル

### interview_logs

面談ごとの履歴を管理する。

```txt
id
company_id
interview_date
stage
memo
created_at
updated_at
```

### users

ログイン機能を追加する場合に利用する。

```txt
id
name
email
password
created_at
updated_at
```

### company_scores

企業ごとの志望度や条件スコアを管理する場合に利用する。

```txt
id
company_id
interest_score
salary_score
remote_score
culture_score
memo
created_at
updated_at
```

---

## MVP での方針

MVP では `companies` 1 テーブルで進める。

理由は以下。

- 実装速度を優先する
- Laravel CRUD 復習に集中する
- React 一覧表示・検索・絞り込みに早く進む
- 複雑なリレーション設計で止まらないようにする

まずは 1 テーブルで完成させ、必要になったら面談ログやユーザー管理を分離する。
