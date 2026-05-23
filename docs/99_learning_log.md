# 学習ログ・詰まった基礎技術

## 概要

JobHunt 開発で何度も詰まった基礎技術・設計判断・React / TypeScript 理解を短く残す。

詳細ログをすべて残すと読まなくなるため、このファイルには「今後も効く重要ポイント」だけを残す。

---

## 2026-05-22 / 2026-05-23 重要学習まとめ

---

## 1. Git 操作は必ずプロジェクトルートで行う

### 詰まったこと

`Desktop` で `git remote` や `git push` を実行して、以下のエラーが出た。

```bash
fatal: not a git repository (or any of the parent directories): .git
```

### 原因

`Desktop` は Git 管理フォルダではない。

Git コマンドは、`.git` が存在するプロジェクトルートで実行する必要がある。

今回の正しい場所は以下。

```txt
/Users/muraokakanemichi/Desktop/jobhunt-app
```

### 正しい確認

```bash
pwd
git status
git remote -v
```

### 学び

Git 操作前は必ず現在地を確認する。

`pwd` が `~/Desktop/jobhunt-app` になっていることを確認してから作業する。

---

## 2. GitHub リポジトリ名・ローカルフォルダ名・remote URL は別物

### 詰まったこと

ローカルの `tasklog-app` を `jobhunt-app` に変更しただけでは、GitHub 側のリポジトリ名は変わらなかった。

### 原因

以下の 3 つは別管理だから。

- ローカルフォルダ名
- GitHub リポジトリ名
- remote URL

### 正しい流れ

```bash
cd ~/Desktop
mv tasklog-app jobhunt-app
cd jobhunt-app
git remote set-url origin https://github.com/muraokajade/jobhunt-app.git
git remote -v
git push
```

### 学び

アプリ名を変更したら、以下をセットで確認する。

```bash
pwd
git remote -v
git status
```

---

## 3. README はプロジェクト直下に置く

### 詰まったこと

`backend/README.md` と `frontend/README.md` はあったが、プロジェクト直下の `README.md` がなかった。

### 原因

ルート README と、backend / frontend の README の役割を分けて考えられていなかった。

### 正しい構成

```txt
README.md
backend/README.md
frontend/README.md
```

### 学び

GitHub で最初に表示される README は、基本的にプロジェクト直下の `README.md`。

プロジェクト全体の説明はルート README に書く。

---

## 4. cat コマンドの理解

### 詰まったこと

以下の意味が曖昧だった。

```bash
cat > README.md <<'EOF'
内容
EOF
```

### 原因

`cat` を「表示するだけのコマンド」として理解していた。

### 正しい理解

`cat` は、ファイル内容を表示したり、標準入力からファイルを作成したりできるコマンド。

### 新規作成・上書き

```bash
cat > README.md <<'EOF'
# JobHunt

本文
EOF
```

### 追記

```bash
cat >> README.md <<'EOF'
追記内容
EOF
```

### 学び

`>` は上書き。  
`>>` は追記。

---

## 5. git status の見方

### 状態 1：未追跡ファイル

```bash
Untracked files:
  README.md
```

### 意味

ファイルは存在するが、まだ Git 管理対象になっていない。

### 対応

```bash
git add README.md
git commit -m "docs: add JobHunt project README"
git push
```

### 状態 2：ローカルがリモートより進んでいる

```bash
Your branch is ahead of 'origin/main' by 1 commit.
```

### 意味

ローカルでは commit 済みだが、GitHub にはまだ push されていない。

### 対応

```bash
git push
```

### 学び

`git status` は、次に何をすべきかを見るための最重要コマンド。

---

## 6. push rejected は GitHub 側に未取得 commit がある状態

### 詰まったこと

```bash
! [rejected] main -> main (fetch first)
error: failed to push some refs
```

### 原因

GitHub 側に、ローカルにはない commit があった。

### 対応

```bash
git fetch origin
git log --oneline --graph --decorate --all -5
git pull --rebase origin main
git push
```

### 学び

`push rejected` は基本的に以下の意味。

```txt
GitHub側の方が進んでいるので、先に取り込んでからpushして。
```

---

## 7. rebase 前は作業ツリーをきれいにする

### 詰まったこと

```bash
error: cannot pull with rebase: You have unstaged changes.
error: Please commit or stash them.
```

### 原因

未コミットの変更が残っていた。

### 対応

残す変更なら commit する。

```bash
git add .
git commit -m "docs: update learning log"
git pull --rebase origin main
git push
```

捨てる変更なら restore する。

```bash
git restore ファイル名
```

### 学び

rebase 前は必ず確認する。

```bash
git status
```

---

## 8. Laravel API 確認前はサーバー起動が必要

### 詰まったこと

`curl` で API 確認しようとして接続エラーになった。

```bash
curl: (7) Failed to connect to 127.0.0.1 port 8000
```

### 原因

Laravel サーバーを起動していなかった。

### 対応

Laravel サーバーを起動する。

```bash
cd backend
php artisan serve
```

React とは別ターミナルで起動しておく。

### 学び

API 確認前には必ず Laravel サーバーが起動しているか確認する。

---

## 9. curl は React fetch の代わりに API 単体確認するコマンド

### 詰まったこと

`curl` で何を確認しているのかが曖昧だった。

### 正しい理解

`curl` は、React の `fetch` の代わりに、ターミナルから API を直接叩くコマンド。

```bash
curl "http://127.0.0.1:8000/api/companies"
```

### 目的

- ルートが正しいか確認
- Controller が呼ばれるか確認
- DB からデータを取得できるか確認
- JSON レスポンスが返るか確認
- React 側の問題か Laravel 側の問題か切り分ける

### 学び

順番はこれ。

```txt
Laravel API単体確認
↓
curlでJSON確認
↓
React fetch接続
```

---

## 10. クエリパラメータは `/api/companies?keyword=Laravel`

### 詰まったこと

以下のように考えそうになった。

```txt
/api/companies/keyword?keyword=Laravel
```

### 原因

URL パスとクエリパラメータの役割が混ざっていた。

### 正しい理解

一覧検索は、一覧取得 API にクエリパラメータを付ける。

```txt
/api/companies?keyword=Laravel
/api/companies?keyword=Laravel&status=応募済み&media=type
```

Laravel 側では以下で取得する。

```php
$request->query('keyword')
$request->filled('keyword')
```

### 学び

- `query()` は値を取得する
- `filled()` は値が存在して空でないか確認する

---

## 11. FormRequest と validated の関係

### 詰まったこと

`$request->validated()` がどこでバリデーションしているのか曖昧だった。

### 原因

Controller と FormRequest の役割分担が曖昧だった。

### 正しい理解

Controller で `StoreCompanyRequest` / `UpdateCompanyRequest` を受け取ると、`rules()` が実行される。

```php
public function store(StoreCompanyRequest $request)
{
    $company = Company::create($request->validated());
}
```

`validated()` は、FormRequest のルールを通過した安全な値だけを返す。

### 流れ

```txt
POST /api/companies
↓
StoreCompanyRequest が呼ばれる
↓
rules() でバリデーション
↓
通過した値だけ validated() で取得
↓
Company::create()
```

### 学び

`validated()` は入力値をそのまま取るのではなく、検証済みの値だけを返す。

---

## 12. Resource は Laravel 側のデータを React 向けに整形する場所

### 詰まったこと

`CompanyResource::collection($companies)` の役割が曖昧だった。

### 正しい理解

DB / Laravel 側は snake_case。

```txt
applied_date
interview_date
job_url
next_action
```

React 側は camelCase。

```txt
appliedDate
interviewDate
jobUrl
nextAction
```

この変換は `CompanyResource` で行う。

### 役割

```txt
DB・Laravel側のデータ形式
↓
APIレスポンス用に整形
↓
Reactが使いやすいJSONにする
```

### 学び

Controller に整形処理を書きすぎず、Resource に分ける。

---

## 13. where(function ($q) use ($keyword)) の理解

### 詰まったこと

以下の構文が読みづらかった。

```php
$query->where(function ($q) use ($keyword) {
    $q->where('name', 'like', "%{$keyword}%")
        ->orWhere('memo', 'like', "%{$keyword}%")
        ->orWhere('next_action', 'like', "%{$keyword}%");
});
```

### 正しい理解

複数の `orWhere` 条件を 1 つのグループにまとめる。

SQL イメージ。

```sql
WHERE (
  name LIKE '%Laravel%'
  OR memo LIKE '%Laravel%'
  OR next_action LIKE '%Laravel%'
)
```

### use の意味

外側の `$keyword` を、内側の関数で使うために書く。

### 学び

複数カラムを横断検索するときは、`where(function () { ... })` で条件をグループ化する。

---

## 14. orderByRaw('interview_date IS NULL') の理解

### 詰まったこと

以下の意味がまだ浅い。

```php
->orderByRaw('interview_date IS NULL')
->orderBy('interview_date')
->orderByDesc('created_at')
```

### 現時点の理解

面談日がある企業を優先的に上に出し、面談日が近い順に並べる意図。

### 今後深掘り

- SQL で `IS NULL` が並び順にどう影響するか
- MySQL / SQLite で boolean 的な値がどう並ぶか
- NULL を後ろに回す書き方

### 学び

現時点では以下の理解で進める。

```txt
面談日がある企業を上に出すための並び順調整。
```

---

# JobHunt UX / 設計判断

## 15. 初回登録フォームは DB カラムを全部並べない

### 詰まったこと

DB カラムをそのままフォームに並べそうになった。

### 原因

DB 設計と画面 UX を同じ粒度で考えていた。

### 重要判断

初回登録フォームは、応募直後に分かる情報だけに絞る。

### 表示する項目

```txt
企業名
媒体
志望度
求人URL
メモ
```

### 自動セットする項目

```txt
status = 応募済み
applied_date = 今日
interview_date = null
interview_url = null
next_action = null
document_result = 未対応
first_interview_result = 未対応
second_interview_result = 未対応
final_result = 未対応
rejection_stage = null
```

### 学び

DB カラムをそのままフォームに出すと、実際の業務フローとズレる。

初回登録と選考更新は分ける。

---

## 16. priority は 1.0〜5.0 の 0.5 刻みで管理する

### 判断

S / A / B+ より、数値の方が並び替え・集計・フィルターに使いやすい。

```txt
5.0 = 本命
4.0 = 高い
3.0 = 普通
2.0 = 低い
1.0 = とりあえず応募
```

### 学び

志望度は主観で変わるため、一覧上で即変更できると Excel より便利。

---

## 17. 会社詳細モーダルの役割

### 目的

初回登録では扱わない情報を、後から会社ごとに正確に更新する。

### 扱う項目

```txt
priority
status
job_url
interview_url
interview_date
next_action
document_result
first_interview_result
second_interview_result
final_result
rejection_stage
memo
```

### 学び

初回登録は速度重視。  
詳細モーダルは正確な更新重視。

---

## 18. 一覧インライン更新の役割

### 目的

詳細モーダルを開かずに、一覧上で頻繁に変わる項目を即更新する。

### 対象

```txt
priority
status
```

### 学び

priority と status は変化頻度が高い。

一覧から直接変更できると、Excel より操作が速い。

---

# React / TypeScript 理解

## 19. selectedCompany と detailForm は分ける

### 詰まったこと

モーダルで表示するデータと、編集中のデータの違いが曖昧だった。

### 正しい理解

```txt
selectedCompany = 一覧から選んだ元データ
detailForm = モーダル内で編集中のデータ
```

### 学び

保存前に `selectedCompany` を直接変更しない。

---

## 20. company → detailForm と detailForm → requestBody は別

### モーダルを開くとき

```txt
company
↓
detailForm
```

React 画面表示用の camelCase を、フォーム用の snake_case に詰め替える。

### 保存するとき

```txt
detailForm
↓
requestBody
↓
PUT /api/companies/{id}
```

Laravel API に送る形に変換する。

### 学び

同じ「詰め替え」でも、方向が違う。

```txt
表示準備：company → detailForm
保存準備：detailForm → requestBody
```

---

## 21. PUT では会社データ全体を送る必要がある

### 詰まったこと

一覧で priority だけ変更したいのに、なぜ他の項目も送るのか分からなかった。

### 原因

今の Laravel の `PUT /api/companies/{id}` は、会社データ全体を更新する API だから。

### 正しい理解

見た目は priority だけ更新でも、requestBody には既存の会社データ一式が必要。

```txt
companyの既存値
+
priorityだけ新しい値
```

### 学び

部分更新に見えても、API 仕様が全体更新なら、requestBody は全体を送る。

---

## 22. buildCompanyRequestBody の役割

### 目的

priority 更新、status 更新、詳細更新で、毎回 requestBody を手書きしないようにする。

### 考え方

```txt
companyの既存値をベースにする
overridesに入っている値だけ上書きする
Laravelが受け取れるsnake_case形式に変換する
```

### 学び

重複コードを減らすと、更新漏れやバリデーションエラーのリスクが下がる。

---

## 23. Partial<T> は「一部だけ渡して OK」にする型

### 詰まったこと

以下が分からなかった。

```ts
overrides: Partial<CompanyForm> = {};
```

### 正しい理解

`CompanyForm` は全部入りの型。

でもインライン更新では、priority だけ、status だけを渡したい。

```ts
Partial<CompanyForm>;
```

にすると、以下のように一部だけ渡せる。

```ts
{
  priority: "5.0";
}
{
  status: "面談予定";
}
```

### 学び

`Partial<T>` は、T のプロパティをすべて任意にする型。

---

## 24. overrides は「上書きしたい値」

### 詰まったこと

以下の意味が曖昧だった。

```ts
buildCompanyRequestBody(company, { priority });
```

### 正しい理解

これは以下の意味。

```txt
companyの既存値をベースにする
priorityだけ新しい値で上書きする
```

`{ priority }` は以下の省略形。

```ts
{
  priority: priority;
}
```

### 学び

`overrides` は「上書きしたい値」を入れるオブジェクト。

---

## 25. オブジェクト更新は `{ ...detailForm, key: value }`

### 詰まったこと

`[]` と書きそうになった。

### 原因

配列とオブジェクトの更新が混ざっていた。

### 正しい理解

`detailForm` はオブジェクト。

```ts
{
  name: "",
  media: "",
  next_action: ""
}
```

そのため更新は `{}` で行う。

```ts
setDetailForm({
  ...detailForm,
  next_action: e.target.value,
});
```

### 学び

`...detailForm` は今の値を全部コピー。  
後ろの `next_action` だけ上書きする。

---

## 26. table では tr 直下に select を置かない

### 詰まったこと

一覧の列がズレた。

### 原因

`<tr>` の直下に `<select>` を置いていた。

### 間違い

```tsx
<tr>
  <td>{company.name}</td>
  <select>...</select>
</tr>
```

### 正しい形

```tsx
<tr>
  <td>企業名</td>
  <td>媒体</td>
  <td>
    <select>志望度</select>
  </td>
  <td>
    <select>状況</select>
  </td>
</tr>
```

### 学び

`tr` の直下は基本的に `td` / `th`。

---

## 27. onChange では e.target.value を渡す

### 詰まったこと

第二引数に何を渡すか迷った。

### 正しい理解

select の変更後の値は `e.target.value`。

```tsx
onChange={(e) => updateCompanyPriority(company, e.target.value)}
```

### 意味

```txt
この会社の志望度を、選択された新しい値に更新する。
```

### 学び

`onChange` では、変更後の値が必要なので `e.target.value` を使う。

---

## 28. id だけで足りる処理と company 全体が必要な処理

### id だけで OK

```txt
削除
```

理由。

```txt
DELETE /api/companies/{id}
```

### company 全体が必要

```txt
詳細表示
インライン更新
PUT更新
```

理由。

```txt
表示する情報やrequestBody作成に、会社データ一式が必要だから。
```

### 学び

削除は id だけでよい。  
表示・編集・更新は company 全体が必要になりやすい。

---

# 設計書 / 個人開発メモ

## 29. 個人開発でも設計書を書くメリット

### 学び

設計書を書くメリットは、実装中の判断ブレを減らすこと。

特に以下が決まっていると手が止まりにくい。

```txt
何を初回登録で扱うか
何を詳細モーダルで扱うか
何を一覧で直接更新するか
nullをどう表示するか
PUTで何を送るか
```

### 個人開発での役割

設計書は、重い資料ではなく以下。

```txt
自分用の実装地図
第三者に説明できる資料
未来の自分が迷わないための判断ログ
```

---

## 30. 設計書は画面スクショ + 操作順 + 処理メモが分かりやすい

### 学び

No を細かく分けすぎるより、画面ができている場合は以下の構成が分かりやすい。

```txt
左：画面スクショ
右：操作順
下：state / API / null表示 / 補足
```

### 理由

実装に直結しやすい。

```txt
このボタンを押す
↓
どのstateが変わる
↓
どのAPIを呼ぶ
↓
画面がどう変わる
```

が見えるから。

---

# 現在できたこと

## 31. 実装済み

```txt
Laravel API CRUD
companies テーブル
priority カラム追加
React 企業一覧表示
初回登録フォーム
企業削除
toast表示
検索・絞り込み
登録時の status = 応募済み
登録時の applied_date = 今日
登録時の result系 = 未対応
初回登録フォームの簡略化
詳細モーダル表示
URLリンク表示
priority / status / next_action の詳細モーダル保存
一覧のpriorityインライン更新
一覧のstatusインライン更新
```

---

# 今後の重要課題

## 32. TypeScript 理解 docs に切り出す

以下は `99_learning_log.md` ではなく、別 docs に蓄積する。

```txt
Partial<T>
typeof
オブジェクトのスプレッド構文
{ priority } の省略記法
e.target.value
Company型とCompanyForm型の違い
camelCase / snake_case変換
```

候補ファイル。

```txt
docs/98_typescript_learning.md
```

---

## 33. 次にやること

```txt
1. App.tsxの共通化後の動作確認
2. priority / status インライン更新確認
3. 詳細モーダル保存確認
4. th / tdズレ確認
5. commit
6. docs/98_typescript_learning.md 作成
```
