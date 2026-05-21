# JobHunt API 設計

## 概要

JobHunt の MVP では、企業情報を管理する `companies` API を中心に実装する。

Laravel 側では、Controller / FormRequest / Resource を使って API を構成する。

---

## API 一覧

| メソッド | URL                        | 用途                 |
| -------- | -------------------------- | -------------------- |
| GET      | `/api/companies`           | 企業一覧取得         |
| POST     | `/api/companies`           | 企業登録             |
| GET      | `/api/companies/{company}` | 企業詳細取得         |
| PUT      | `/api/companies/{company}` | 企業更新             |
| DELETE   | `/api/companies/{company}` | 企業削除             |
| GET      | `/api/companies/summary`   | Dashboard 用集計取得 |

---

## 1. GET /api/companies

### 目的

企業一覧を取得する。

### クエリパラメータ案

| パラメータ | 内容               |
| ---------- | ------------------ |
| keyword    | 企業名・メモ検索   |
| status     | 選考状況フィルター |
| media      | 媒体フィルター     |

### リクエスト例

```http
GET /api/companies?keyword=Laravel&status=面談予定&media=type
```

### レスポンス例

```json
[
  {
    "id": 1,
    "name": "株式会社サンプル",
    "media": "type",
    "status": "面談予定",
    "appliedDate": "2026-05-17",
    "interviewDate": "2026-05-23 14:00",
    "jobUrl": "https://example.com/job",
    "interviewUrl": "https://example.com/meeting",
    "memo": "Laravel / React案件",
    "nextAction": "面談準備",
    "documentResult": "通過",
    "firstInterviewResult": "未対応",
    "secondInterviewResult": "未対応",
    "finalResult": "未対応",
    "rejectionStage": null
  }
]
```

---

## 2. POST /api/companies

### 目的

企業情報を新規登録する。

### リクエスト例

```json
{
  "name": "株式会社サンプル",
  "media": "type",
  "status": "応募済み",
  "applied_date": "2026-05-17",
  "interview_date": null,
  "job_url": "https://example.com/job",
  "interview_url": null,
  "memo": "PHP / Laravel案件",
  "next_action": "書類選考結果待ち",
  "document_result": "未対応",
  "first_interview_result": "未対応",
  "second_interview_result": "未対応",
  "final_result": "未対応",
  "rejection_stage": null
}
```

### レスポンス例

```json
{
  "id": 1,
  "name": "株式会社サンプル",
  "media": "type",
  "status": "応募済み",
  "appliedDate": "2026-05-17",
  "interviewDate": null,
  "jobUrl": "https://example.com/job",
  "interviewUrl": null,
  "memo": "PHP / Laravel案件",
  "nextAction": "書類選考結果待ち",
  "documentResult": "未対応",
  "firstInterviewResult": "未対応",
  "secondInterviewResult": "未対応",
  "finalResult": "未対応",
  "rejectionStage": null
}
```

---

## 3. GET /api/companies/{company}

### 目的

企業詳細を取得する。

### レスポンス例

```json
{
  "id": 1,
  "name": "株式会社サンプル",
  "media": "type",
  "status": "面談予定",
  "appliedDate": "2026-05-17",
  "interviewDate": "2026-05-23 14:00",
  "jobUrl": "https://example.com/job",
  "interviewUrl": "https://example.com/meeting",
  "memo": "Laravel / React案件。フルリモート可。",
  "nextAction": "面談準備",
  "documentResult": "通過",
  "firstInterviewResult": "未対応",
  "secondInterviewResult": "未対応",
  "finalResult": "未対応",
  "rejectionStage": null
}
```

---

## 4. PUT /api/companies/{company}

### 目的

企業情報を更新する。

### リクエスト例

```json
{
  "name": "株式会社サンプル",
  "media": "type",
  "status": "面談後返答待ち",
  "applied_date": "2026-05-17",
  "interview_date": "2026-05-23 14:00",
  "job_url": "https://example.com/job",
  "interview_url": "https://example.com/meeting",
  "memo": "1次面接完了。返答待ち。",
  "next_action": "結果連絡を待つ",
  "document_result": "通過",
  "first_interview_result": "通過",
  "second_interview_result": "未対応",
  "final_result": "未対応",
  "rejection_stage": null
}
```

---

## 5. DELETE /api/companies/{company}

### 目的

企業情報を削除する。

### レスポンス例

```json
{
  "message": "Company deleted successfully."
}
```

---

## 6. GET /api/companies/summary

### 目的

Dashboard に表示する集計情報を取得する。

### 集計対象

- 応募総数
- 面談予定数
- 返答待ち件数
- 内定数
- 落選数
- ステータス別件数
- 媒体別件数
- 今週の面談
- 次アクション一覧

### レスポンス例

```json
{
  "totalCount": 50,
  "interviewScheduledCount": 3,
  "waitingReplyCount": 5,
  "offerCount": 1,
  "rejectedCount": 31,
  "statusCounts": {
    "応募済み": 7,
    "書類選考待ち": 10,
    "書類通過": 4,
    "面談日程調整中": 2,
    "面談予定": 3,
    "面談後返答待ち": 5,
    "内定": 1,
    "辞退": 0,
    "落選": 31
  },
  "mediaCounts": {
    "type": 20,
    "Green": 15,
    "レバテック": 10,
    "Wantedly": 5
  },
  "upcomingInterviews": [
    {
      "id": 1,
      "name": "株式会社サンプル",
      "interviewDate": "2026-05-23 14:00",
      "status": "面談予定"
    }
  ],
  "nextActions": [
    {
      "id": 2,
      "name": "株式会社テスト",
      "nextAction": "日程調整メール返信"
    }
  ]
}
```

---

## バリデーション方針

StoreCompanyRequest / UpdateCompanyRequest を作成する。

### ルール案

```php
return [
    'name' => ['required', 'string', 'max:255'],
    'media' => ['nullable', 'string', 'max:100'],
    'status' => ['required', 'string', 'max:100'],
    'applied_date' => ['nullable', 'date'],
    'interview_date' => ['nullable', 'date'],
    'job_url' => ['nullable', 'url'],
    'interview_url' => ['nullable', 'url'],
    'memo' => ['nullable', 'string'],
    'next_action' => ['nullable', 'string', 'max:255'],
    'document_result' => ['nullable', 'string', 'max:100'],
    'first_interview_result' => ['nullable', 'string', 'max:100'],
    'second_interview_result' => ['nullable', 'string', 'max:100'],
    'final_result' => ['nullable', 'string', 'max:100'],
    'rejection_stage' => ['nullable', 'string', 'max:100'],
];
```

---

## Laravel 構成案

```txt
app/
  Http/
    Controllers/
      Api/
        CompanyController.php
    Requests/
      StoreCompanyRequest.php
      UpdateCompanyRequest.php
    Resources/
      CompanyResource.php
  Models/
    Company.php
```

---

## MVP での API 方針

まずは以下を優先する。

1. GET /api/companies
2. POST /api/companies
3. PUT /api/companies/{company}
4. DELETE /api/companies/{company}
5. GET /api/companies/summary

詳細 API は必要に応じて追加する。

最初の目標は、React 側で企業一覧を API から取得して表示すること。
