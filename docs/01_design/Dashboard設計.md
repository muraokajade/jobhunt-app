# docs/01_design/Dashboard設計.md

## 更新日

2026/05/24

---

# 1. 概要

Dashboard設計.mdでは、JobHunt LiteのDashboard APIと、フロントエンド側のSummaryCards / ActionListsで使用する集計データの設計を整理する。

Dashboard APIは、ログイン中ユーザーの企業データをもとに、転職活動状況の件数情報と、次に確認すべき企業リストを返す。

React側では、Dashboard APIから取得したsummaryとactionListsを使って、画面上に現在の転職活動状況を表示する。

---

# 2. 目的

Dashboard APIの目的は、転職活動状況を一目で把握できるようにすることである。

企業一覧だけでは、応募総数、面談予定、返答待ち、内定、落選、高優先度企業の数をすぐに把握しづらい。

そのため、Laravel側で集計処理を行い、React側は表示に集中する構成とする。

---

# 3. Endpoint

GET /api/companies/dashboard

---

# 4. 認証

Dashboard APIは認証必須APIである。

auth:sanctum middleware配下に配置し、Bearer Tokenを持つログイン済みユーザーだけがアクセスできる。

Dashboard集計対象は、ログイン中ユーザー本人の企業データのみとする。

未ログイン状態、または無効なBearer Tokenでアクセスした場合は取得できない。

---

# 5. 返却内容

Dashboard APIは以下の2つを返す。

- summary
- actionLists

---

# 6. summary

summaryは、SummaryCardsで使用する件数情報である。

| key          | 内容       |
| ------------ | ---------- |
| total        | 応募総数   |
| interview    | 面談予定数 |
| waiting      | 確認待ち数 |
| offer        | 内定数     |
| rejected     | 落選数     |
| highPriority | 高優先度数 |

## 6.1 summaryレスポンス例

    {
      "summary": {
        "total": 10,
        "interview": 2,
        "waiting": 3,
        "offer": 1,
        "rejected": 2,
        "highPriority": 4
      }
    }

---

# 7. actionLists

actionListsは、ActionListsで使用する企業リストである。

| key          | 内容         |
| ------------ | ------------ |
| interviews   | 面談予定企業 |
| waiting      | 確認待ち企業 |
| highPriority | 高優先度企業 |

## 7.1 actionListsレスポンス例

    {
      "actionLists": {
        "interviews": [],
        "waiting": [],
        "highPriority": []
      }
    }

---

# 8. CompanyResource適用方針

Dashboard APIのactionListsで返す企業情報にも、CompanyResourceを通す。

理由は、CompanyTableから詳細モーダルを開く場合と、ActionListsから詳細モーダルを開く場合で、同じCompany型として扱えるようにするためである。

CompanyResourceを通さない場合、Laravel側のsnake_caseとReact側のcamelCaseが混在する。

例。

    applied_date
    interview_date
    job_url
    interview_url
    next_action

React側では以下のcamelCaseを前提にしている。

    appliedDate
    interviewDate
    jobUrl
    interviewUrl
    nextAction

そのため、Dashboard APIのactionListsでもCompanyResourceを使う。

---

# 9. Dashboard APIの設計方針

Dashboard APIの設計方針は以下。

- 集計ロジックはLaravel側に寄せる
- React側は表示に集中する
- Feature TestでDashboardロジックを保証する
- actionListsにもCompanyResourceを通す
- Dashboard集計対象はログインユーザー本人の企業だけにする
- SummaryCardsとActionListsで同じAPIレスポンスを利用する

---

# 10. SummaryCardsとの関係

SummaryCardsは、Dashboard APIのsummaryを表示するコンポーネントである。

表示項目は以下。

- 応募総数
- 面談予定
- 返答待ち
- 内定
- 落選
- 高優先度

Dashboard APIからsummaryを取得できた場合は、その値を優先して表示する。

API未取得時や一時的な取得失敗時は、companies配列からReact側で計算するfallbackを残す。

---

# 11. ActionListsとの関係

ActionListsは、Dashboard APIのactionListsを表示するコンポーネントである。

表示リストは以下。

- 面談予定
- 確認待ち
- 高優先度

Dashboard APIからactionListsを取得できた場合は、その値を優先して表示する。

API未取得時や一時的な取得失敗時は、companies配列からReact側で計算するfallbackを残す。

ActionLists内の企業カードから詳細ボタンを押すと、CompanyDetailModalを開く。

このとき、actionLists内の企業データもCompanyResource形式で返すことで、CompanyTableから開く場合と同じCompany型として扱える。

---

# 12. Feature Test対象

Dashboard APIでは、以下の観点をFeature Testで確認する。

- Dashboard APIでsummaryを取得できる
- Dashboard APIで高優先度企業リストを取得できる
- Dashboard APIで面談予定企業リストを取得できる
- Dashboard APIで確認待ち企業リストを取得できる

今後追加したい観点は以下。

- 未ログインではDashboard APIにアクセスできない
- ログイン中ユーザー本人の企業だけ集計される
- 他ユーザーの企業がsummaryに混ざらない
- 他ユーザーの企業がactionListsに混ざらない
- actionListsの企業がCompanyResource形式で返る

---

# 13. 重要ポイント

ActionListsから詳細モーダルを開いたときに、CompanyResourceを通していないとsnake_caseとcamelCaseがズレる。

その結果、React側で以下のような問題が起きる可能性がある。

- 日付が表示されない
- URLが表示されない
- 次アクションが表示されない
- 詳細モーダルの初期値が入らない
- 更新処理で想定外の値になる

そのため、Dashboard APIのactionListsでもCompanyResourceを使う。

---

# 14. 今後の拡張候補

Dashboardの今後の拡張候補は以下。

- 媒体別応募数
- 選考フェーズ別ファネル
- 落選ステージ別集計
- 面談予定カレンダー連携
- AIによる次アクション提案
- 応募活動の週次サマリー
- 志望度別の進捗可視化

---
