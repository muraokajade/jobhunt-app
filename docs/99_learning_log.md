# 学習ログ・詰まった基礎技術

## 2026-05-22

## 1. Git コマンドを打つ場所

### 詰まったこと

`Desktop` で以下を実行してしまった。

```bash
git remote set-url origin https://github.com/muraokajade/jobhunt-app.git
```

結果、以下のエラーが出た。

```bash
fatal: not a git repository (or any of the parent directories): .git
```

## 原因

`Desktop` は Git 管理フォルダではないため。

Git コマンドは、`.git` が存在するプロジェクトルートで実行する必要がある。

今回の正しい場所は以下。

```txt
/Users/muraokakanemichi/Desktop/jobhunt-app
```

## 正しい操作

```bash
cd ~/Desktop/jobhunt-app
pwd
git status
git remote -v
```

その後に remote を変更する。

```bash
git remote set-url origin https://github.com/muraokajade/jobhunt-app.git
git remote -v
git push
```

## 学び

Git 操作前は必ず現在地を確認する。

```bash
pwd
git status
```

`pwd` がプロジェクトルートになっていない状態で、`git remote` や `git push` を打たない。

---

## 2. ローカルフォルダ名と GitHub リポジトリ名は別物

### 詰まったこと

ローカルの `tasklog-app` を `jobhunt-app` に変更しただけでは、GitHub 側のリポジトリ名は変わらない。

## 正しい理解

以下の 3 つは別管理。

- ローカルフォルダ名：Mac 上のフォルダ名
- GitHub リポジトリ名：GitHub 上のリポジトリ名
- remote URL：ローカル Git が push 先として見ている URL

## 正しい流れ

ローカルフォルダ名を変更する。

```bash
cd ~/Desktop
mv tasklog-app jobhunt-app
cd jobhunt-app
```

GitHub 側でリポジトリ名を変更する。

```txt
GitHub
→ Repository
→ Settings
→ Repository name
→ jobhunt-app に変更
→ Rename
```

その後、ローカルの remote URL を変更する。

```bash
git remote set-url origin https://github.com/muraokajade/jobhunt-app.git
git remote -v
git push
```

## 学び

アプリ名変更では、以下をセットで確認する。

- ローカルフォルダ名
- GitHub リポジトリ名
- remote URL
- README 上の表記
- 画面上のアプリ名

---

## 3. README の場所

### 詰まったこと

`backend/README.md` と `frontend/README.md` はあったが、プロジェクト直下の `README.md` がなかった。

## 正しい理解

GitHub で最初に表示される README は、基本的にプロジェクト直下の `README.md`。

ポートフォリオや公開リポジトリでは、ルート README が重要。

## 今回の対応

以下の構成にした。

```txt
README.md
backend/README.md
frontend/README.md
```

## 学び

プロジェクト全体の説明は、ルート README に書く。

バックエンド固有の説明は `backend/README.md`、フロントエンド固有の説明は `frontend/README.md` に分ける。

---

## 4. cat コマンド

### 詰まったこと

以下の意味が曖昧だった。

```bash
cat > README.md <<'EOF'
内容
EOF
```

## 正しい理解

`cat` は、ファイル内容を表示したり、標準入力からファイルを作成したりできるコマンド。

以下は、`README.md` に複数行の文章を書き込む操作。

```bash
cat > README.md <<'EOF'
# JobHunt

本文
EOF
```

## 注意点

`>` を使うと既存ファイルは上書きされる。

追記したい場合は `>>` を使う。

```bash
cat >> README.md <<'EOF'
追記内容
EOF
```

## 学び

新規作成や上書きには `>`。  
追記には `>>`。

---

## 5. git status の見方

## 状態 1：未追跡ファイル

以下のように表示された。

```bash
Untracked files:
  README.md
```

## 意味

ファイルは存在するが、まだ Git 管理対象になっていない状態。

## 対応

```bash
git add README.md
git commit -m "docs: add JobHunt project README"
git push
```

## 状態 2：ローカルがリモートより進んでいる

以下のように表示された。

```bash
Your branch is ahead of 'origin/main' by 1 commit.
```

## 意味

ローカルでは commit 済みだが、GitHub にはまだ push されていない状態。

## 対応

```bash
git push
```

---

## 6. 今回完了したこと

- ローカルフォルダ名を `tasklog-app` から `jobhunt-app` に変更
- GitHub リポジトリ名を `jobhunt-app` に変更
- remote URL を `jobhunt-app` に変更
- ルート README を作成
- `docs/` ディレクトリを作成
- ミニ設計書用ファイルを作成

---

## 7. 次回からの確認ルール

Git 操作前は、必ず以下を確認する。

```bash
pwd
git status
git remote -v
```

`pwd` がプロジェクトルートになっていることを確認してから、以下を実行する。

```bash
git add
git commit
git push
git remote
```

---

## 8. 今日の学びまとめ

今回のミスは、Git の理解不足というより、**作業場所の確認不足**。

実務では、以下の確認を癖にする。

```bash
pwd
ls
git status
```

特に `fatal: not a git repository` が出たら、まず疑うべきことはこれ。

```txt
今いる場所がプロジェクトルートではない
```

Git 操作は、必ずプロジェクトルートで行う。

### クエリパラメータの理解

以下の URL で検索条件を送る。

```bash
curl "http://127.0.0.1:8000/api/companies?keyword=Laravel"
```

このとき、Laravel 側では以下で取得できる。

```php
$request->query('keyword')
```

`filled('keyword')` は、`keyword` が存在していて空でないかを確認する。

### index メソッドの流れ

```php
$query = Company::query();
```

で Company 検索用のクエリを作る。

その後、`keyword`、`status`、`media` があれば条件を追加する。

```php
$query->where(...);
```

最後に以下で DB から取得する。

```php
$companies = $query->get();
```

### 日本語エスケープについて

curl の結果では、日本語が以下のように表示されることがある。

```json
"\u682a\u5f0f\u4f1a\u793e\u30b5\u30f3\u30d7\u30eb"
```

これは JSON の日本語エスケープであり、エラーではない。

React 側で JSON として受け取れば、通常は日本語として表示される。

### 今回理解できたこと

- `curl` は API 確認用のコマンド
- Laravel サーバーを起動していないと API 確認できない
- `/api/companies?keyword=Laravel` の `keyword` は `$request->query('keyword')` で取得できる
- `filled('keyword')` は値の存在チェック
- 日本語が `\uXXXX` 形式で表示されても問題ない

### 理解が浅い・今後確認すること

- `where(function ($q) use ($keyword) { ... })` のクロージャ構文
- `orderByRaw('interview_date IS NULL')` の意味
- `CompanyResource::collection($companies)` がどのように JSON へ変換しているか

---

# 2026-05-22 追加ログ：何度も止まった基礎ポイント

## 9. API 確認時に Laravel サーバーが起動していなかった

### 詰まったこと

`curl` で POST 確認をしようとしたが、以下のエラーが出た。

```bash
curl: (7) Failed to connect to 127.0.0.1 port 8000 after 0 ms: Couldn't connect to server
```

### 原因

Laravel の開発サーバーを起動していなかった。

API を確認するには、先に以下を実行しておく必要がある。

```bash
php artisan serve
```

### 正しい確認方法

ターミナルを 2 枚使う。

#### ターミナル 1：Laravel サーバー用

```bash
cd ~/Desktop/jobhunt-app/backend
php artisan serve
```

このターミナルは起動したまま放置する。

#### ターミナル 2：API 確認用

```bash
cd ~/Desktop/jobhunt-app/backend
curl "http://127.0.0.1:8000/api/companies"
```

### 学び

API 確認前には、必ずサーバーが起動しているか確認する。

```txt
APIを叩く前に php artisan serve
```

---

## 10. curl で何を確認しているのかが曖昧だった

### 詰まったこと

`curl` を実行するように言われても、どこで何を確認しているのかが曖昧だった。

### 正しい理解

`curl` は、React の `fetch` の代わりに、ターミナルから API を直接叩くコマンド。

React で書く以下の処理と近い。

```ts
fetch("http://127.0.0.1:8000/api/companies");
```

ターミナルでは以下になる。

```bash
curl "http://127.0.0.1:8000/api/companies"
```

### 確認していること

- Laravel のルートが正しいか
- Controller が呼ばれているか
- DB からデータを取得できるか
- JSON レスポンスが返るか
- React に進む前に API 単体で動くか

### 学び

React 接続前に `curl` で API 単体確認をする。

```txt
Laravel API単体で成功
↓
React fetchで接続
```

この順番にすると、問題の切り分けがしやすい。

---

## 11. クエリパラメータの URL 構造が曖昧だった

### 詰まったこと

`keyword` 検索について、URL を以下のように考えそうになった。

```txt
/api/companies/keyword?keyword=Laravel
```

### 正しい URL

今回の設計では、検索は一覧取得 API にクエリパラメータを付ける。

```txt
/api/companies?keyword=Laravel
```

複数条件の場合は以下。

```txt
/api/companies?keyword=Laravel&status=面談予定&media=type
```

### Laravel 側の対応

```php
if ($request->filled('keyword')) {
    $keyword = $request->query('keyword');
}
```

### 意味

```txt
/api/companies?keyword=Laravel
```

この URL の場合、

```php
$request->query('keyword')
```

で `Laravel` が取得できる。

### 学び

一覧検索・絞り込みは、基本的に以下の形。

```txt
GET /api/resources?条件名=値
```

今回なら、

```txt
GET /api/companies?keyword=Laravel
```

---

## 12. `$request->query()` と `filled()` の役割

### 詰まったこと

以下の 2 つの役割が曖昧だった。

```php
$request->filled('keyword')
$request->query('keyword')
```

### 正しい理解

#### filled

```php
$request->filled('keyword')
```

これは、`keyword` が存在していて、かつ空ではないかを確認する。

#### query

```php
$request->query('keyword')
```

これは、URL のクエリパラメータから値を取得する。

### 例

URL が以下の場合、

```txt
/api/companies?keyword=Laravel
```

Laravel 側では以下になる。

```php
$request->filled('keyword') // true
$request->query('keyword')  // Laravel
```

### 学び

- `filled()` は存在チェック
- `query()` は値の取得

---

## 13. PHP の文字列展開で `${keyword}` と書いてしまった

### 詰まったこと

Controller 内で以下のように書いた。

```php
$q->where('name', 'like', "%${keyword}%")
```

### 正しい書き方

PHP では以下のように書く方が安全で読みやすい。

```php
$q->where('name', 'like', "%{$keyword}%")
    ->orWhere('memo', 'like', "%{$keyword}%")
    ->orWhere('next_action', 'like', "%{$keyword}%");
```

### 原因

JavaScript / TypeScript のテンプレートリテラル感覚が混ざった。

### 学び

JavaScript では以下。

```ts
`${keyword}`;
```

PHP では以下。

```php
"{$keyword}"
```

言語ごとの文字列展開を混ぜない。

---

## 14. `$request->validated()` がどこでバリデーションしているのか曖昧だった

### 詰まったこと

以下の処理で、どこでバリデーションされているのかが曖昧だった。

```php
$company = Company::create($request->validated());
```

### 正しい理解

Controller の引数で `StoreCompanyRequest` を受け取っている。

```php
public function store(StoreCompanyRequest $request)
```

この時点で、`StoreCompanyRequest` の `rules()` が実行される。

バリデーションを通過した値だけを、以下で取得している。

```php
$request->validated()
```

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

`validated()` は、入力値をそのまま取得しているのではなく、FormRequest のルールを通過した安全な値だけを返す。

---

## 15. Resource の役割が曖昧だった

### 詰まったこと

以下の意味が曖昧だった。

```php
return CompanyResource::collection($companies);
```

### 正しい理解

`CompanyResource` は、Laravel 側のデータを React 側が使いやすい JSON に整える場所。

DB 側では snake_case。

```txt
applied_date
interview_date
job_url
next_action
```

React 側では camelCase。

```txt
appliedDate
interviewDate
jobUrl
nextAction
```

この変換を `CompanyResource` で行う。

### 学び

Resource の役割は以下。

```txt
DB・Laravel側のデータ形式
↓
APIレスポンス用に整形
↓
Reactが使いやすいJSONにする
```

Controller に整形処理を書きすぎず、Resource に分ける。

---

## 16. `orderByRaw('interview_date IS NULL')` の意味が未完成理解

### 詰まったこと

以下の意味がまだ浅い。

```php
->orderByRaw('interview_date IS NULL')
->orderBy('interview_date')
->orderByDesc('created_at')
```

### 現時点の理解

面談日がある企業を優先的に上に出し、面談日が近い順に並べる意図。

```php
orderByRaw('interview_date IS NULL')
```

は、`interview_date` が NULL かどうかで並び順を制御している。

### 今後深掘りすること

- SQL で `IS NULL` が並び順にどう影響するか
- MySQL / SQLite で boolean 的な値がどう並ぶか
- NULL を後ろに回す書き方

### 学び

今は完全理解で止まらず、以下の理解で進める。

```txt
面談日がある企業を上に出すための並び順調整
```

---

## 17. `where(function ($q) use ($keyword) { ... })` の理解が浅い

### 詰まったこと

以下の構文の理解が浅い。

```php
$query->where(function ($q) use ($keyword) {
    $q->where('name', 'like', "%{$keyword}%")
        ->orWhere('memo', 'like', "%{$keyword}%")
        ->orWhere('next_action', 'like', "%{$keyword}%");
});
```

### 現時点の理解

複数の `orWhere` 条件を 1 つのグループにまとめるために使っている。

意味としては以下。

```sql
WHERE (
  name LIKE '%Laravel%'
  OR memo LIKE '%Laravel%'
  OR next_action LIKE '%Laravel%'
)
```

### `use ($keyword)` の意味

クロージャの外側にある `$keyword` を、内側の関数で使うために書く。

### 学び

複数カラムを横断検索するときは、`where(function () { ... })` でグループ化する。

---

## 18. GitHub 側とローカル側の履歴が分岐した

### 詰まったこと

`git push` したときに以下のエラーが出た。

```bash
! [rejected] main -> main (fetch first)
error: failed to push some refs to 'https://github.com/muraokajade/jobhunt-app.git'
```

### 原因

GitHub 側に、ローカルにはない commit があった。

今回の場合、GitHub 上で設計書を更新し、ローカルでは API 実装を commit していたため、履歴が分岐した。

### 状態確認

```bash
git fetch origin
git log --oneline --graph --decorate --all -5
```

この結果、以下のように分岐していた。

```txt
ローカル：feat: add company API CRUD
GitHub側：Update 02_db_design.md / Update 03_api_design.md
```

### 正しい対応

GitHub 側の変更を取り込んでから push する。

```bash
git pull --rebase origin main
git push
```

### 学び

`push rejected` は、基本的に以下の意味。

```txt
GitHub側の方が進んでいるので、先に取り込んでからpushして
```

---

## 19. rebase 前に未コミット変更があって止まった

### 詰まったこと

`git pull --rebase origin main` を実行したら、以下のエラーが出た。

```bash
error: cannot pull with rebase: You have unstaged changes.
error: Please commit or stash them.
```

### 原因

`docs/99_learning_log.md` に未コミットの変更が残っていた。

### 確認

```bash
git status
git diff --stat
```

結果、以下が表示された。

```txt
modified: docs/99_learning_log.md
```

### 対応

残すべき変更だったため、先に commit した。

```bash
git add docs/99_learning_log.md
git commit -m "docs: add company API learning log"
```

その後、再度 rebase した。

```bash
git pull --rebase origin main
git push
```

### 学び

rebase 前は、作業ツリーをきれいにする。

```bash
git status
```

で以下の状態にしてから rebase する。

```txt
working tree clean
```

---

## 20. 今回の重要ポイントまとめ

今日、何度も止まったポイントは以下。

- Git コマンドを打つ場所
- ローカルフォルダ名と GitHub リポジトリ名の違い
- remote URL の意味
- README の場所
- `cat` コマンド
- `curl` の役割
- Laravel サーバー起動の必要性
- クエリパラメータの URL 構造
- `$request->query()` と `filled()` の違い
- FormRequest と `$request->validated()` の関係
- Resource の役割
- `where(function () use () {})` の意味
- `orderByRaw()` の意味
- GitHub 側とローカル側の履歴分岐
- rebase 前の未コミット変更

### 次回以降の基本確認セット

#### Git 操作前

```bash
pwd
git status
git remote -v
```

#### API 確認前

```bash
php artisan serve
php artisan route:list --path=api
```

#### curl 確認

```bash
curl "http://127.0.0.1:8000/api/companies"
```

#### push 前

```bash
git status
git log --oneline --graph --decorate --all -5
```

---

## 21. 今日の SE 力メモ

今日の目的は、単に CRUD を作ることではない。

設計書を見て、以下の流れを自分の頭でつなぐこと。

```txt
DB設計
↓
Migration
↓
Model
↓
FormRequest
↓
Resource
↓
Controller
↓
Route
↓
curl確認
↓
React連携
```

ここがつながると、設計を実装に落とし込める。

逆に、実装中に詰まったところを設計書や学習ログに戻すことで、実装から設計へ逆流する力も鍛えられる。

今回の進め方は、上流・PM を目指すための基礎訓練としてかなり良い。
