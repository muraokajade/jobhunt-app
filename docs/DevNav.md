# Spring Boot × React 100h ロードマップ・DevNav 再現性確認プラン

## 0. 前提

目的：

- 最近 Java / Spring Boot を触っていないため、実務開始前に感覚を戻す
- Laravel だけでなく Spring Boot も扱えるバックエンド寄りフルスタックとして再確認する
- DevNav+の再現性確認・修正を通じて、Java / Spring Boot × React の実装力を再証明する
- JobHunt が Laravel × React の実務 CRUD アプリなら、DevNav+は Spring Boot × React の技術教材・ナビゲーション型ポートフォリオとして位置づける
- Laravel / Spring Boot の両方を扱えることを職務経歴・面接・ポートフォリオで説明できるようにする

想定稼働：

- Spring Boot × React：100h
- JobHunt 240h とは別軸
- 合計で Laravel / Spring Boot / React / TypeScript の総合復習にする

---

# 1. Spring Boot × React 100h の位置づけ

## 1.1 JobHunt との役割分担

### JobHunt

- Laravel / PHP
- React / TypeScript
- 転職活動 CRM
- 実務寄り CRUD
- FormRequest
- Resource
- Feature Test
- Google カレンダー
- 通知
- 認証
- Udemy 教材原型

### DevNav+

- Java
- Spring Boot
- React / TypeScript
- 技術記事・開発手順ナビ
- React × Spring Boot 統合教材
- API 設計
- JPA
- DTO
- Repository
- Service
- Controller
- 技術記事管理
- 開発手順管理
- 学習導線管理

---

# 2. DevNav+を再確認する理由

## 2.1 最近 Java を触っていない

現状：

- Laravel / React / TypeScript / Next.js の作業が多い
- Spring Boot / Java の手が少し鈍っている
- ただし過去の DevNav+は強いポートフォリオ資産
- DevNav+を放置せず、再現性確認・修正することで Spring Boot の説明力を戻せる

## 2.2 面接・職務経歴で強くなる

JobHunt だけだと、Laravel 寄りに見える。

DevNav+を再確認すると、以下を言える。

- PHP / Laravel でも API 設計・テスト・React 連携ができる
- Java / Spring Boot でも API 設計・JPA・DTO・React 連携ができる
- Laravel と Spring Boot を比較しながら設計できる
- バックエンド寄りフルスタックとして複数技術に対応できる

---

# 3. Spring Boot × React 100h の完成ライン

## 完成ライン

100h で目指すのは、DevNav+を完全新規で作り直すことではない。

目標は以下。

- ローカルで再現できる
- 起動手順が README にまとまっている
- API が動く
- React 画面から API が叩ける
- 主要機能を説明できる
- DB 設計を説明できる
- Controller / Service / Repository / DTO の流れを説明できる
- JPA の使い方を説明できる
- 主要バグを修正する
- スクショを更新する
- README を更新する
- JobHunt との比較説明を用意する

---

# 4. DevNav+ 再現性確認の対象

## 4.1 起動確認

- backend 起動
- frontend 起動
- DB 接続
- API 疎通
- CORS 確認
- 環境変数確認
- README 通りに再現できるか確認

## 4.2 Spring Boot 側

- Entity 確認
- Repository 確認
- Service 確認
- Controller 確認
- DTO 確認
- Request / Response 形式確認
- JPA クエリ確認
- 例外処理確認
- バリデーション確認
- API レスポンス確認

## 4.3 React 側

- API fetch 確認
- 型定義確認
- 一覧表示確認
- 詳細表示確認
- 投稿 / 更新 / 削除確認
- コンポーネント構成確認
- 画面遷移確認
- エラー表示確認

## 4.4 README・設計書

- 起動手順
- 使用技術
- 機能一覧
- API 仕様
- DB 設計
- スクショ
- 今後の改善
- JobHunt との比較

---

# 5. Spring Boot × React 100h ロードマップ

## Phase 1：環境再現・起動確認 15h

目標：

- DevNav+をローカルで確実に起動できる状態にする
- README 通りに再現できるか確認する

作業：

- GitHub clone
- backend 起動
- frontend 起動
- DB 接続
- 環境変数確認
- CORS 確認
- API 疎通確認
- 起動エラー修正
- README 起動手順更新
- スクショ確認

成果物：

- ローカル起動確認済み
- README 起動手順更新
- 再現性メモ

---

## Phase 2：Spring Boot API 再理解 20h

目標：

- Spring Boot 側の処理の流れを説明できるようにする

作業：

- Entity 確認
- Repository 確認
- Service 確認
- Controller 確認
- DTO 確認
- Request / Response 確認
- JPA の使い方確認
- @Query 確認
- Optional 確認
- 例外処理確認
- バリデーション確認

重点理解：

- Controller はリクエストを受ける
- Service は業務ロジックを持つ
- Repository は DB アクセスを担当する
- Entity は DB テーブルと対応する
- DTO は API 入出力の形を整える
- JPA は Entity を通じて DB を操作する

成果物：

- Spring Boot 処理フローメモ
- Controller / Service / Repository / DTO 説明メモ
- API 仕様メモ

---

## Phase 3：React 連携確認・修正 15h

目標：

- React 側から Spring Boot API を問題なく叩ける状態にする

作業：

- API fetch 確認
- TypeScript 型確認
- 一覧表示確認
- 詳細表示確認
- 登録 / 更新 / 削除確認
- ローディング確認
- エラー表示確認
- CORS 不具合修正
- API レスポンス形式の確認
- camelCase / snake_case / Java 側命名確認

成果物：

- React 画面動作確認
- API 連携メモ
- 型定義整理

---

## Phase 4：主要機能のバグ修正・再現性確認 20h

目標：

- DevNav+の主要機能が説明可能な状態で動くようにする

作業：

- 技術記事一覧
- 技術記事詳細
- 文法記事一覧
- 文法記事詳細
- 開発手順一覧
- 開発手順詳細
- 検索・絞り込み
- 投稿 / 更新 / 削除
- 管理者機能
- Q&A 機能
- 学習進捗機能
- エラー確認
- null 確認
- 表示崩れ確認

成果物：

- 主要機能動作確認済み
- バグ修正コミット
- スクショ更新

---

## Phase 5：Spring Boot テスト・API 検証 10h

目標：

- Spring Boot 側の API を最低限テストできる状態にする

作業候補：

- Controller テスト
- Service テスト
- Repository テスト
- MockMvc 確認
- H2 テスト DB 確認
- Postman / Insomnia 確認
- API レスポンス確認
- バリデーションエラー確認

成果物：

- テスト方針メモ
- 最低限の API テスト
- Insomnia / curl 確認メモ

---

## Phase 6：README・説明資料更新 15h

目標：

- DevNav+を第三者に見せられる状態に戻す

作業：

- README 更新
- 機能一覧更新
- 技術構成更新
- API 仕様更新
- DB 設計更新
- スクショ更新
- 起動手順更新
- 学習教材としての説明追加
- JobHunt との比較追加
- 面接説明文作成

成果物：

- README 完成版
- スクショ
- 面接説明メモ
- ポートフォリオ説明文

---

## Phase 7：Laravel / Spring Boot 比較整理 5h

目標：

- Laravel と Spring Boot の両方を扱えることを説明できるようにする

比較項目：

- Controller
- Request / FormRequest
- Resource / DTO
- Model / Entity
- Eloquent / JPA
- Migration / Flyway または DDL
- Feature Test / MockMvc
- Validation
- Service 層
- Repository 層
- API レスポンス整形

成果物：

- Laravel × Spring Boot 比較メモ
- 面接用説明文
- 職務経歴書追記候補

---

# 6. 100h 内訳

- Phase 1：環境再現・起動確認：15h
- Phase 2：Spring Boot API 再理解：20h
- Phase 3：React 連携確認・修正：15h
- Phase 4：主要機能バグ修正：20h
- Phase 5：Spring Boot テスト・API 検証：10h
- Phase 6：README・説明資料更新：15h
- Phase 7：Laravel / Spring Boot 比較整理：5h

合計：100h

---

# 7. DevNav+で再確認したい技術ポイント

## Java

- クラス
- メソッド
- フィールド
- コンストラクタ
- Optional
- List
- Stream
- enum
- null 安全
- 型設計

## Spring Boot

- @RestController
- @RequestMapping
- @GetMapping
- @PostMapping
- @PutMapping
- @DeleteMapping
- @PathVariable
- @RequestParam
- @RequestBody
- @Valid
- Service
- Repository
- Entity
- DTO
- ResponseEntity
- 例外処理

## JPA

- JpaRepository
- findAll
- findById
- save
- delete
- @Query
- JOIN
- N+1 問題
- Entity の関連
- Lazy / Eager
- トランザクション

## React / TypeScript

- 型定義
- API fetch
- useEffect
- useState
- コンポーネント分割
- props
- Optional な値の扱い
- 一覧表示
- 詳細表示
- フォーム
- エラー表示

---

# 8. JobHunt と DevNav+の比較

## JobHunt

- Laravel / PHP
- React / TypeScript
- 転職活動管理 CRM
- 実務 CRUD
- FormRequest
- Resource
- Feature Test
- Google カレンダー連携予定
- 通知予定
- Udemy 教材原型

## DevNav+

- Java
- Spring Boot
- React / TypeScript
- 技術記事・開発手順ナビ
- React × Spring Boot 統合教材
- JPA
- DTO
- Repository
- Service
- Controller
- 技術学習支援アプリ
- 公開済みポートフォリオ

## 説明軸

私は Laravel / PHP と Java / Spring Boot の両方で、API 設計から React 連携まで一通り対応できます。

JobHunt では Laravel を用いて、FormRequest、Resource、Feature Test を含めた実務 CRUD アプリを実装しました。

DevNav+では Spring Boot を用いて、Controller、Service、Repository、DTO、JPA を含む React 連携型の技術学習支援アプリを実装しました。

---

# 9. 面接での説明文

DevNav+は、React × Spring Boot の統合教材をテーマにした技術学習ナビゲーションアプリです。

技術記事、文法記事、開発手順記事を管理し、初学者が React と Spring Boot を組み合わせた開発手順を学べる構成にしています。

バックエンドでは Java / Spring Boot を使用し、Controller、Service、Repository、Entity、DTO を分けて API を実装しました。

フロントエンドでは React / TypeScript を使用し、API から取得した記事や開発手順を一覧・詳細画面で表示しています。

JobHunt では Laravel / PHP を用いた実務 CRUD アプリを作成しており、DevNav+と合わせて、Laravel と Spring Boot の両方でバックエンド API を設計・実装し、React と連携できることを示しています。

---

# 10. Spring Boot × React 100h の優先順位

## 優先度 A

- 起動確認
- API 疎通
- Controller / Service / Repository / DTO 再理解
- React 連携確認
- README 更新
- スクショ更新

## 優先度 B

- 主要バグ修正
- API 仕様整理
- DB 設計整理
- テスト方針整理
- Laravel との比較メモ

## 優先度 C

- 新機能追加
- UI 大幅改善
- 複雑なテスト
- 大規模リファクタリング

---

# 11. 判断まとめ

Spring Boot × React 100h では、DevNav+を新規開発するのではなく、再現性確認・修正・説明力強化に集中する。

JobHunt で Laravel × React を強化し、DevNav+で Spring Boot × React を再確認することで、以下のポジションを作る。

- Laravel / PHP も扱える
- Java / Spring Boot も扱える
- React / TypeScript も扱える
- API 設計ができる
- DB 設計ができる
- テストも意識できる
- README / 設計書で説明できる
- 実務寄りの業務アプリと教材型ポートフォリオの両方を持っている

この 100h は、実務開始前の Java / Spring Boot の勘を戻しつつ、ポートフォリオ全体の説得力を高めるための投資とする。
