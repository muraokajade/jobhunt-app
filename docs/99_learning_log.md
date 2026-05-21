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
