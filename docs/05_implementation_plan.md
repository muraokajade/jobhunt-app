# JobHunt 実装計画

## 目的

設計書の内容を、実際の実装タスクに分解する。

このドキュメントでは、DB 設計・API 設計・画面設計をもとに、Laravel 側と React 側で何を作るかを整理する。

---

## 実装順

## Phase 1：companies テーブル作成

### 参照する設計書

- docs/02_db_design.md

### やること

- Company Model 作成
- companies migration 作成
- companies テーブル定義
- migrate 実行
- DB 確認

### 完了条件

- `companies` テーブルが作成されている
- `php artisan migrate` が成功する
- Company モデルが存在する

---

## Phase 2：Company API 作成

### 参照する設計書

- docs/03_api_design.md

### やること

- CompanyController 作成
- StoreCompanyRequest 作成
- UpdateCompanyRequest 作成
- CompanyResource 作成
- API Route 定義
- GET /api/companies
- POST /api/companies
- PUT /api/companies/{company}
- DELETE /api/companies/{company}

### 完了条件

- API で企業一覧を取得できる
- API で企業登録できる
- API で企業更新できる
- API で企業削除できる

---

## Phase 3：summary API 作成

### 参照する設計書

- docs/03_api_design.md

### やること

- GET /api/companies/summary 作成
- 応募総数を返す
- ステータス別件数を返す
- 面談予定数を返す
- 返答待ち件数を返す
- 内定数を返す
- 落選数を返す

### 完了条件

- Dashboard 用の集計 JSON が返る

---

## Phase 4：React CompanyList 作成

### 参照する設計書

- docs/01_screen_design.md

### やること

- Company 型定義
- API 取得処理
- CompanyList 表示
- 検索フォーム
- status フィルター
- media フィルター
- 削除ボタン

### 完了条件

- Laravel API から取得した企業一覧が React で表示される

---

## Phase 5：React CompanyForm 作成

### 参照する設計書

- docs/01_screen_design.md
- docs/03_api_design.md

### やること

- 登録フォーム作成
- 編集フォーム作成
- POST 連携
- PUT 連携
- バリデーションエラー表示

### 完了条件

- React 画面から企業登録・編集ができる

---

## Phase 6：CompanyDetail 作成

### 参照する設計書

- docs/01_screen_design.md
- docs/04_calendar_url_spec.md

### やること

- 企業詳細画面作成
- Google カレンダー登録 URL 生成
- 別タブで Google カレンダーを開く

### 完了条件

- 1 社の詳細情報が見られる
- Google カレンダー追加ボタンが動く

---

## Phase 7：Dashboard 作成

### 参照する設計書

- docs/01_screen_design.md
- docs/03_api_design.md

### やること

- summary API 取得
- 応募総数表示
- 面談予定数表示
- 返答待ち表示
- 内定数表示
- 落選数表示
- 選考ファネル表示
- 次アクション表示

### 完了条件

- 5 秒で現在の転職活動状況がわかる

---

## 今日の優先順位

1. Phase 1：companies テーブル作成
2. Phase 2：Company API 作成
3. Phase 4：React CompanyList 作成

Dashboard や Google カレンダーは後回し。

まずは、DB → API → 一覧表示の縦一本を通す。
