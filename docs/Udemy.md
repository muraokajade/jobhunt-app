# JobHunt Udemy 講座構想

## 概要

JobHunt を題材に、Laravel × React で実務寄りの Web アプリを作るハンズオン講座を構想する。

Todo アプリではなく、実際の転職活動管理を題材にすることで、CRUD だけで終わらない実務寄りの教材にする。

本体の JobHunt をそのまま公開教材にするのではなく、教材用に機能を整理した `JobHunt Lite` を作る。

---

## 方針

## 本体 JobHunt と教材用 JobHunt Lite は分ける

### 本体 JobHunt

自分のポートフォリオ・実プロダクト・学習記録として扱う。

### 教材用 JobHunt Lite

Udemy 講座用に整理したミニ業務アプリとして扱う。

### 理由

本体を全部見せると、独自の設計判断・改善履歴・転職活動ログ運用ノウハウまで公開することになる。

教材では、Laravel × React の学習に必要な範囲だけを切り出す。

---

## 講座コンセプト

## 講座タイトル案

```txt
Todoアプリより100倍使える
Laravel × Reactで作る実務寄り転職活動管理アプリ
```

または、

```txt
Laravel × Reactで作る JobHunt Lite
転職活動管理アプリを作りながらAPI連携を学ぶ
```

---

## 対象者

## 想定受講者

```txt
Laravelの基礎を学んだが、React連携で止まっている人
Reactの基礎は分かるが、API連携に不安がある人
Todoアプリ以外の題材で学びたい人
実務寄りのCRUDアプリを作りたい人
ポートフォリオの作り方を学びたい人
```

---

## 講座の売り

## 差別化ポイント

```txt
Todoアプリではなく、転職活動管理アプリを作る
Laravel APIとReactを接続する
FormRequestでバリデーションする
ResourceでAPIレスポンスを整形する
検索・絞り込みを実装する
詳細モーダルで編集する
一覧からpriority/statusをインライン更新する
設計判断も説明する
README・設計書・ポートフォリオ化まで扱う
```

---

## 講座で扱う技術

## Backend

```txt
PHP
Laravel
Migration
Model
Controller
FormRequest
Resource
Eloquent
REST API
```

## Frontend

```txt
React
TypeScript
useState
useEffect
props
fetch
map
条件分岐表示
コンポーネント分割
```

## UI

```txt
Tailwind CSS
```

ただし、Tailwind CSS は詳しく解説しない。

---

## Tailwind CSS の扱い

## 方針

Tailwind CSS は GitHub に完成コードを置き、受講者には必要に応じてコピペしてもらう。

## 理由

この講座の主目的は CSS ではない。

Laravel API、React state、TypeScript、API 連携、設計判断を学ぶことが目的。

Tailwind の細かい解説に時間を使うと、講座の意図がブレる。

## 講座内での説明

```txt
この講座ではTailwind CSSの細かい解説は行いません。
見た目のコードはGitHubに置いてあるものを利用し、
主にLaravel APIとReact連携、状態管理、設計判断に集中します。
```

---

## 講座で見せる機能

## 見せる機能

```txt
企業登録
企業一覧
検索・絞り込み
詳細モーダル
priorityインライン更新
statusインライン更新
Laravel API CRUD
FormRequest
Resource
React fetch
コンポーネント分割
README
簡易設計書
```

## 見せない機能

```txt
本体JobHuntの全設計書
深い学習ログ
独自改善履歴
AI分析構想
本格Dashboard
本格Google連携
本格認証
実際の転職活動ログ運用ノウハウ
```

---

## 講座全体構成

## セクション 1：講座概要と完成形

### 内容

```txt
講座の目的
作るアプリの紹介
TodoアプリではなくJobHuntを作る理由
完成画面の確認
学べる技術
```

### 作る機能

```txt
完成形デモ
企業登録
一覧
詳細モーダル
インライン更新
検索
```

---

## セクション 2：環境構築

### 内容

```txt
PHP
Composer
Laravel
Node.js
Vite
React
SQLiteまたはMySQL
VS Code
```

### 作る機能

```txt
Laravel起動
React起動
APIとフロントを別々に動かす
```

---

## セクション 3：PHP / Laravel 最低限

### 内容

```txt
Route
Controller
Model
Migration
Request
Resource
Eloquent
```

### 作る機能

```txt
GET /api/companies
POST /api/companies
```

---

## セクション 4：TypeScript / React 最低限

### 内容

```txt
useState
useEffect
type
props
event
fetch
map
条件分岐表示
```

### 作る機能

```txt
企業一覧表示
loading表示
空データ表示
```

---

## セクション 5：DB 設計

### 内容

```txt
companiesテーブル
status
priority
interview_date
job_url
interview_url
result系
memo
```

### 作る機能

```txt
Migration
Model
fillable
```

---

## セクション 6：Laravel API CRUD

### 内容

```txt
index
store
show
update
destroy
apiResource
```

### 作る機能

```txt
企業一覧取得
企業登録
企業更新
企業削除
```

---

## セクション 7：FormRequest

### 内容

```txt
StoreCompanyRequest
UpdateCompanyRequest
バリデーション
validated()
```

### 作る機能

```txt
企業名必須
URL形式チェック
status候補チェック
priorityチェック
```

---

## セクション 8：Resource

### 内容

```txt
CompanyResource
snake_case と camelCase
APIレスポンス整形
```

### 作る機能

```txt
applied_date → appliedDate
job_url → jobUrl
next_action → nextAction
```

---

## セクション 9：React で企業一覧を表示

### 内容

```txt
fetch
useEffect
companies state
map
テーブル表示
null表示
```

### 作る機能

```txt
企業一覧テーブル
空データ表示
読み込み表示
```

---

## セクション 10：企業登録フォーム

### 内容

```txt
form state
入力値更新
POST
toast
登録後一覧再取得
```

### 作る機能

```txt
企業名
媒体
志望度
求人URL
メモ
```

### 設計判断

```txt
初回登録では面談日や選考結果を入力させない
statusは応募済み
applied_dateは今日
result系は未対応
```

---

## セクション 11：検索・絞り込み

### 内容

```txt
URLSearchParams
query parameter
Laravel側のfilled / query
where
orWhere
```

### 作る機能

```txt
企業名検索
媒体検索
status絞り込み
```

---

## セクション 12：詳細モーダル

### 内容

```txt
selectedCompany
isDetailOpen
detailForm
モーダル表示
フォーム編集
```

### 作る機能

```txt
詳細ボタン
会社詳細表示
求人URL
面談URL
面談日
次アクション
メモ
選考結果
```

---

## セクション 13：詳細モーダル保存

### 内容

```txt
detailForm → requestBody
PUT
toast
fetchCompanies
closeModal
```

### 作る機能

```txt
詳細情報更新
URL更新
面談日更新
選考結果更新
```

---

## セクション 14：インライン更新

### 内容

```txt
priority select
status select
PUT
requestBody共通化
Partial
overrides
```

### 作る機能

```txt
一覧上で志望度変更
一覧上で状況変更
```

### 重要学習

```txt
部分更新に見えても、APIが全体更新なら全体requestBodyが必要
```

---

## セクション 15：コンポーネント分割

### 内容

```txt
CompanyDetailModal
CompanyTable
CompanyRegisterForm
SearchForm
SummaryCards
props
型定義
```

### 作る機能

```txt
App.tsxの肥大化解消
責務分離
```

---

## セクション 16：Laravel API 設計の改善

### 内容

```txt
PUTとPATCHの違い
全体更新と部分更新
フロントが複雑になる理由
API設計で責務を減らす考え方
```

### 作る機能

```txt
PATCH設計案
priority更新API案
status更新API案
```

### 差別化ポイント

Todo アプリ教材ではあまり扱われない、API 設計の判断まで話す。

---

## セクション 17：簡易 Dashboard

### 内容

```txt
companies配列から集計
status別件数
result別件数
```

### 作る機能

```txt
応募総数
面談予定
返答待ち
内定
落選
書類通過
```

---

## セクション 18：README・ポートフォリオ化

### 内容

```txt
README
スクショ
機能一覧
技術構成
設計判断
今後の改善
```

### 作る機能

```txt
GitHubで見せられる状態にする
```

---

## 10 時間講座としての配分

```txt
Section 1-2：0.8h
Section 3-4：1.2h
Section 5-8：2.0h
Section 9-11：1.5h
Section 12-14：2.0h
Section 15-16：1.2h
Section 17-18：1.3h
```

合計：約 10 時間。

---

## 作成時間 100 時間の配分

```txt
講座用JobHunt Lite実装：35h
章立て・台本作成：20h
録画：20h
編集：15h
資料・GitHub整理：10h
```

---

## Udemy 構想の実現性

## 実現可能性

かなり現実的。

## 理由

```txt
すでにJobHunt本体が進んでいる
詰まったポイントが教材になる
Todoより題材が強い
Laravel × React教材として差別化できる
設計判断まで話せる
```

## 注意点

いきなり録画しない。

先にやるべき順番はこれ。

```txt
1. JobHunt本体を完成に近づける
2. 教材用にJobHunt Liteへ切り出す
3. 章立てを固定する
4. 各セクションの台本メモを作る
5. GitHubに講座用コードを整理する
6. 録画する
```

---

## 最終判断

## JobHunt 本体

```txt
自分のポートフォリオ
実務寄りの開発訓練
バックエンド会社向けの説明材料
```

## JobHunt Lite 教材

```txt
Udemy用
Laravel × React入門〜実務寄りハンズオン
Todoより100倍使える題材
```

## 見せ方

```txt
本体は全部見せない
教材用に整理したLite版だけ見せる
TailwindはGitHubからコピペ
講座ではLaravel API・React state・設計判断を中心に解説する
```

---

## まとめ

JobHunt は、自己学習・ポートフォリオ・教材化の 3 つに使える。

ただし、本体 JobHunt と教材用 JobHunt Lite は分ける。

教材では、すべての機能を見せるのではなく、Laravel × React で実務寄りアプリを作るために必要な機能だけを扱う。
