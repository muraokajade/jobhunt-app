# JobHunt Google カレンダー登録 URL 仕様

## 概要

JobHunt では、MVP 段階では Google Calendar API / OAuth は使わない。

代わりに、Google カレンダーの予定作成 URL を生成し、ユーザーが手動で予定を登録できるようにする。

---

## 目的

面談予定を Google カレンダーに素早く登録できるようにする。

ユーザーは企業詳細画面から「Google カレンダーに追加」ボタンを押すことで、予定作成画面を開ける。

---

## MVP でやること

- Google カレンダー登録 URL を生成する
- 別タブで Google カレンダー予定作成画面を開く
- タイトル、日時、説明欄を URL に埋め込む

---

## MVP でやらないこと

- Google OAuth
- Google Calendar API による直接登録
- 登録済み予定との同期
- カレンダー予定の編集
- カレンダー予定の削除
- リマインダー自動設定

---

## URL 基本形式

```txt
https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={details}
```

---

## 使用するパラメータ

| パラメータ | 内容                          |
| ---------- | ----------------------------- |
| action     | `TEMPLATE` 固定               |
| text       | 予定タイトル                  |
| dates      | 開始日時 / 終了日時           |
| details    | 説明欄                        |
| location   | 任意。オンライン面談 URL など |

---

## タイトル仕様

### 形式

```txt
【面談】{企業名}
```

### 例

```txt
【面談】株式会社サンプル
```

---

## 日時仕様

Google カレンダー URL では、日時を以下形式で渡す。

```txt
YYYYMMDDTHHmmss/YYYYMMDDTHHmmss
```

### 例

```txt
20260523T140000/20260523T150000
```

### MVP での方針

面談時間が登録されている場合、開始時刻から 1 時間後を終了時刻とする。

例：

```txt
interview_date = 2026-05-23 14:00
start = 20260523T140000
end = 20260523T150000
```

---

## 説明欄仕様

説明欄には以下を入れる。

- 選考状況
- 面談 URL
- 求人 URL
- 次アクション
- メモ

### 例

```txt
選考状況：1次面接
面談URL：https://example.com/meeting
求人URL：https://example.com/job
次アクション：面談準備
メモ：Laravel / React案件。フルリモート可。
```

---

## 生成例

### 元データ

```json
{
  "name": "株式会社サンプル",
  "status": "面談予定",
  "interviewDate": "2026-05-23 14:00",
  "jobUrl": "https://example.com/job",
  "interviewUrl": "https://example.com/meeting",
  "nextAction": "面談準備",
  "memo": "Laravel / React案件。フルリモート可。"
}
```

### 生成される内容

```txt
タイトル：
【面談】株式会社サンプル

日時：
2026-05-23 14:00〜15:00

説明：
選考状況：面談予定
面談URL：https://example.com/meeting
求人URL：https://example.com/job
次アクション：面談準備
メモ：Laravel / React案件。フルリモート可。
```

---

## React 実装イメージ

```ts
type Company = {
  name: string;
  status: string;
  interviewDate: string | null;
  jobUrl?: string | null;
  interviewUrl?: string | null;
  nextAction?: string | null;
  memo?: string | null;
};

export function buildGoogleCalendarUrl(company: Company): string {
  const title = `【面談】${company.name}`;

  const details = [
    `選考状況：${company.status}`,
    company.interviewUrl ? `面談URL：${company.interviewUrl}` : null,
    company.jobUrl ? `求人URL：${company.jobUrl}` : null,
    company.nextAction ? `次アクション：${company.nextAction}` : null,
    company.memo ? `メモ：${company.memo}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
```

---

## 日時ありの場合の実装方針

MVP では、日時変換は後から実装してもよい。

最初は以下の優先順位で進める。

1. タイトルと説明欄だけ入った Google カレンダー URL を生成する
2. 面談日がある場合、dates パラメータを追加する
3. 終了時刻は開始時刻から 1 時間後にする

---

## ボタン仕様

### 表示場所

CompanyDetail 画面に表示する。

### ボタン文言

```txt
Googleカレンダーに追加
```

### 動作

クリックすると、別タブで Google カレンダー予定作成画面を開く。

```tsx
<a href={calendarUrl} target="_blank" rel="noreferrer">
  Googleカレンダーに追加
</a>
```

---

## 注意点

- URL に入れる値はエンコードする
- 面談日が未登録の場合は、日時なしで予定作成画面を開く
- 面談 URL や求人 URL がない場合は、説明欄から除外する
- OAuth 連携は MVP では行わない

---

## 将来的な拡張

Phase 2 以降で以下を検討する。

- Google OAuth 認証
- Google Calendar API による直接登録
- 登録済み予定との同期
- カレンダー予定 ID の保存
- 予定変更時の同期
- リマインダー設定
