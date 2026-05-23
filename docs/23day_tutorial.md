# JobHunt 現在地・Udemy 切り分け・23 日ロードマップ雑メモ整理

## 0. 前提

日付：2026-05-23  
実務開始予定：2026-06-15  
残り日数：約 23 日  
想定稼働：10 時間 / day  
総稼働見込み：約 230 時間  
安全に見積もる場合：約 140 時間以上は確保可能

現在の軸：

- 自分自身の Laravel / React 実務復帰力を上げる
- JobHunt をポートフォリオとして成立させる
- 将来的に Udemy / 教材化で月 5 万円程度の回収を狙う
- ただし Udemy のためだけに作るのではなく、実務準備・ポートフォリオ・教材原型を同時に回収する

---

# 1. JobHunt の現在の位置づけ

JobHunt は、Excel で管理していた転職活動ログを Laravel × React で Web アプリ化するプロダクト。

単なる Todo アプリではなく、以下を管理する転職活動 CRM。

- 応募企業
- 応募媒体
- 選考状況
- 志望度
- 面談予定
- 求人 URL
- 面談 URL
- 次アクション
- 書類選考結果
- 1 次面接結果
- 2 次面接結果
- 最終結果
- 落選段階
- メモ

現時点では SaaS 完成を狙うよりも、以下の位置づけが現実的。

## 現実的な完成定義

JobHunt = Laravel × React の実務寄り転職活動管理アプリ

目的：

- Laravel / PHP の API 設計力を示す
- React / TypeScript で業務画面を組めることを示す
- FormRequest / Resource / Feature Test まで含めて実務寄りにする
- README / 設計書 / API 仕様 / テスト仕様まで整え、第三者に説明できる状態にする
- 将来的な Udemy 教材原型にする

---

# 2. 3 日間で到達した立ち位置

## 2.1 実装フェーズの現在地

当初は 7 日計画だったが、3 日目時点で MVP の土台はかなり進んでいる。

到達済み：

- Laravel API CRUD
- React 企業一覧
- 企業登録
- 検索・絞り込み
- 詳細モーダル編集
- priority インライン更新
- status インライン更新
- toast 表示
- コンポーネント分割
- FormRequest 整理
- Rule::in による選択肢制御
- CompanyResource 整理
- CompanyFactory 導入
- Feature Test 11pass
- テスト専用 DB 設定
- 開発 DB を破壊しないテスト環境

## 2.2 Phase 1 の進捗

当初の Phase 1：

- CompanyDetailModal 分割
- CompanyTable 分割
- CompanyRegisterForm 分割
- SearchForm 分割
- SummaryCards 分割
- types 分離
- constants 分離
- utils 分離

完了済み：

- CompanyDetailModal 分割
- CompanyTable 分割
- CompanyRegisterForm 分割
- SearchForm 分割
- SummaryCards 分割

未完了：

- types 分離
- constants 分離
- utils 分離

ただし、App.tsx はかなり整理されてきている。

現在の構成イメージ：

- App.tsx
  - state 管理
  - API 通信
  - 画面配置
- components
  - 表示
  - 入力
  - 操作
- utils
  - requestBody 変換
  - 日付変換
- types
  - Company
  - CompanyForm
  - Option
- constants
  - statusOptions
  - priorityOptions
  - resultOptions
  - rejectionStageOptions

---

# 3. 現在の機能一覧

## 3.1 企業管理

- 企業一覧表示
- 企業登録
- 企業詳細表示
- 企業詳細編集
- 企業削除
- 応募媒体管理
- 志望度管理
- 選考状況管理
- 応募日管理
- 面談日管理
- 求人 URL 管理
- 面談 URL 管理
- メモ管理
- 次アクション管理
- 書類選考結果管理
- 1 次面接結果管理
- 2 次面接結果管理
- 最終結果管理
- 落選段階管理

## 3.2 検索・絞り込み

- keyword 検索
  - 企業名
  - メモ
  - 次アクション
- status 絞り込み
- media 絞り込み
- keyword + status 複合検索
- keyword + media 複合検索への拡張余地
- status + media 複合検索への拡張余地

## 3.3 React 側

- 企業一覧テーブル
- 企業登録フォーム
- 検索フォーム
- 集計カード
- 会社詳細モーダル
- 詳細モーダル内編集
- priority インライン更新
- status インライン更新
- toast 表示
- ローディング表示
- 空データ表示
- 求人 URL リンク
- 面談 URL リンク

## 3.4 Laravel 側

- Company モデル
- companies テーブル
- priority 追加 migration
- CompanyController
- StoreCompanyRequest
- UpdateCompanyRequest
- CompanyResource
- CompanyFactory
- CompanyApiTest
- .env.testing
- Feature Test 11pass

---

# 4. 現在のテスト一覧

CompanyApiTest で以下を自動検証済み。

## 4.1 登録系

- 企業を登録できる
- 企業名なしでは登録できない
- 不正な求人 URL では登録できない

## 4.2 更新系

- 企業情報を更新できる
- 不正な status では更新できない
- PUT 全体更新で既存項目が消えない

## 4.3 削除系

- 企業を削除できる

## 4.4 検索・絞り込み系

- keyword で検索できる
- status で絞り込みできる
- media で絞り込みできる
- keyword + status で複合検索できる

## 4.5 テストで保証していること

- CRUD API が動く
- FormRequest バリデーションが動く
- Rule::in で不正な選択肢を弾ける
- Resource 形式でレスポンスを返せる
- 検索・絞り込み条件が動く
- PUT 全体更新時に既存データが消えない
- テスト専用 DB で開発 DB を壊さず検証できる

---

# 5. 現在の課題

## 5.1 JobHunt がまだ「助かる！」に届いていない理由

現時点では、企業 CRUD としては成立しているが、まだ以下が弱い。

- 今日何をすればいいかが弱い
- 返答待ちを自動で気づかせる力が弱い
- 面談予定の見通しが弱い
- 次アクションの優先順位が弱い
- Excel より便利な部分がまだ検索・一覧・API・テスト寄り
- 「転職失敗しない Copilot」感はまだ薄い

## 5.2 Excel に勝つ領域

Excel に勝てる可能性が高い領域：

- 検索
- 絞り込み
- URL 管理
- 集計
- Dashboard
- リマインド
- Google カレンダー連携
- 面談予定一覧
- 次アクション一覧
- 返答待ち一覧
- テスト済み API
- データ構造の一貫性

## 5.3 Excel に負ける領域

Excel に負けやすい領域：

- 自由入力
- 雑な編集速度
- 例外ケースの柔軟性
- セル感覚の気軽さ
- 矛盾を許す運用

したがって、JobHunt は Excel 完全代替ではなく、以下を狙う方が現実的。

JobHunt = 転職活動の次アクションを迷わないための CRM / Copilot

---

# 6. 将来的な JobHunt の方向性

## 6.1 JobHunt Lite

Udemy / 教材向け。

目的：

- Laravel × React で実務 CRUD を学ぶ
- FormRequest / Resource / Feature Test まで経験する
- Todo アプリの次の題材にする

機能範囲：

- 企業 CRUD
- 検索・絞り込み
- 詳細モーダル
- インライン更新
- Dashboard 軽め
- Feature Test
- README
- API 仕様

## 6.2 JobHunt Pro

ポートフォリオ / 実用向け。

目的：

- 転職活動で実際に助かる
- 次に何をすればいいか迷わない
- 面談・返答待ち・期限を見落とさない

機能範囲：

- 認証
- ユーザーごとの企業管理
- Dashboard 強化
- 次アクション管理
- 面談予定一覧
- 返答待ち一覧
- Google カレンダー連携
- 通知土台
- 選考履歴ログ
- AI 補助

## 6.3 JobHunt Copilot

将来的な構想。

目的：

- 転職活動を失敗しないための行動支援
- 応募先選定
- 面談準備
- 返答待ち管理
- 条件確認
- 辞退・内定判断の補助

機能候補：

- 求人票 AI 構造化
- 求人とスキルのマッチ度分析
- 面談準備メモ生成
- 逆質問生成
- 次アクション提案
- 応募優先度提案
- 落選理由の傾向整理

---

# 7. Udemy での切り分け方

## 7.1 JobHunt をそのまま Udemy 化しない

JobHunt 本体を全部 Udemy に入れると重すぎる。

入れすぎると受講者が消化できない要素：

- 認証
- Google カレンダー
- 通知
- AI
- Dashboard
- 複雑な状態制御
- テスト
- README
- 設計書

したがって、Udemy では JobHunt をそのまま全部出すのではなく、JobHunt Lite として切る。

---

## 7.2 最初の Udemy 講座案

### タイトル案

Laravel × React で作る実務 CRUD アプリ  
転職活動管理アプリ JobHunt Lite で学ぶ API 設計・バリデーション・テスト

### 対象

- Laravel 基礎を終えた人
- React 基礎を終えた人
- Todo アプリの次に何を作ればいいかわからない人
- Laravel API と React をつなげたい人
- 実務寄りの CRUD を作りたい人
- FormRequest / Resource / Feature Test を実践したい人

### 講座の完成物

- Laravel API
- React 画面
- 企業 CRUD
- 検索・絞り込み
- 詳細モーダル
- インライン更新
- FormRequest
- Resource
- Feature Test
- README

### 講座時間

目安：8〜10 時間

---

# 8. Udemy 講座構成案

## Chapter 1：講座概要・完成物紹介

- JobHunt Lite とは何か
- なぜ Todo アプリではなく転職活動管理アプリなのか
- 完成画面紹介
- 学べること
- 対象者
- この講座でやらないこと

## Chapter 2：Laravel API 環境構築

- Laravel プロジェクト作成
- API ルート確認
- DB 接続
- CORS 確認
- React と接続する前提整理

## Chapter 3：DB 設計

- companies テーブル設計
- カラム設計
- nullable の考え方
- status / priority / result 系の設計
- migration 作成

## Chapter 4：Company モデルと CRUD API

- Company モデル作成
- fillable 設定
- CompanyController 作成
- index
- store
- show
- update
- destroy
- Route 設定

## Chapter 5：FormRequest

- StoreCompanyRequest
- UpdateCompanyRequest
- required / nullable
- date / url
- Rule::in
- TypeScript の Union 型との対応
- バリデーションエラー確認

## Chapter 6：CompanyResource

- Resource の役割
- snake_case と camelCase
- Laravel 側と React 側の責務分離
- API レスポンス整形

## Chapter 7：React 一覧表示

- Company 型定義
- API fetch
- 企業一覧表示
- loading
- 空データ表示

## Chapter 8：企業登録フォーム

- CompanyForm 型
- 登録フォーム
- POST API
- 登録後の一覧再取得
- toast 表示

## Chapter 9：検索・絞り込み

- keyword 検索
- status 絞り込み
- media 絞り込み
- URLSearchParams
- Laravel 側の where 条件
- 複合検索

## Chapter 10：詳細モーダル編集

- selectedCompany
- detailForm
- camelCase から snake_case への詰め替え
- PUT 全体更新
- 求人 URL / 面談 URL リンク

## Chapter 11：インライン更新

- priority 更新
- status 更新
- buildCompanyRequestBody
- PUT 全体更新と一部更新 UI
- PATCH を検討する理由

## Chapter 12：コンポーネント分割

- CompanyTable
- CompanyDetailModal
- CompanyRegisterForm
- SearchForm
- SummaryCards
- App.tsx の責務整理

## Chapter 13：Feature Test

- .env.testing
- RefreshDatabase
- CompanyFactory
- companyPayload
- postJson
- putJson
- deleteJson
- assertCreated
- assertOk
- assertStatus
- assertJsonValidationErrors
- assertDatabaseHas
- assertDatabaseMissing

## Chapter 14：README・設計判断・拡張案

- README の書き方
- API 仕様
- DB 設計
- テスト一覧
- 今後の拡張
- 認証
- Google カレンダー
- 通知
- Dashboard
- AI

---

# 9. Udemy で切り出すべき範囲

## 講座に入れる

- Laravel API CRUD
- React CRUD
- 検索・絞り込み
- 詳細モーダル
- インライン更新
- FormRequest
- Resource
- Feature Test
- README
- 拡張案

## 講座に入れない

- 認証
- Google カレンダー
- 通知
- AI
- 本番 SaaS 運用
- 決済
- 複雑な権限管理
- 複雑な Dashboard
- 過剰な UI デザイン

## 別講座に切る候補

### 講座 2：Laravel API 設計・Feature Test 編

- FormRequest
- Resource
- Factory
- Feature Test
- RefreshDatabase
- .env.testing
- API テスト設計

### 講座 3：Laravel × React Dashboard 編

- 集計 API
- Dashboard カード
- status 別件数
- media 別件数
- priority 別件数
- 面談予定一覧
- 次アクション一覧

### 講座 4：Google Calendar API 連携編

- OAuth
- Google Calendar API
- 面談予定登録
- 面談 URL 保存
- イベント ID 保存
- 更新・削除

---

# 10. AI についての現時点の考え

## 10.1 FITRA で AI が思ったより働かなかった理由

考えられる理由：

- AI に判断させる範囲が広かった
- 入力が曖昧だった
- 出力が行動に直結しなかった
- AI 結果を DB や UI 価値に変換しきれなかった
- ユーザーが自分で入力した方が早い部分まで AI 化しようとした
- AI が出した結果の正解判定が難しかった
- 「分析」はできても「次に何をするか」まで落ちにくかった

## 10.2 JobHunt で AI を入れるなら

JobHunt で AI を成功させるなら、AI チャットではなく、以下に限定する。

AI = 入力補助・構造化・次アクション生成

## 10.3 AI が働きやすい機能

### 求人票構造化

ユーザーが求人票本文を貼る。

AI が抽出する項目：

- 企業名
- 職種
- 必須スキル
- 歓迎スキル
- 使用技術
- 勤務地
- リモート可否
- 単価
- 契約形態
- 面談回数
- 懸念点

### 面談準備メモ生成

企業情報と求人情報から、面談準備メモを生成する。

生成内容：

- 聞くべき質問
- 技術面で話すポイント
- 自分の経験とつなげるポイント
- 条件確認
- 懸念点
- 逆質問

### 次アクション生成

現在の status や面談日から、次にやるべきことを提案する。

例：

- 面談予定 → 面談準備メモを作成
- 面談後返答待ち → 3 日後に確認
- 書類選考待ち → 5 日経過で確認
- 内定 → 条件確認
- 辞退 → 辞退理由をメモ

### 応募文面下書き

企業情報と自分のスキルから、応募文面を下書きする。

用途：

- スカウト返信
- エージェント返信
- 応募メッセージ
- 面談前自己紹介

## 10.4 AI でやらない方がいいこと

- 何でも相談できる AI チャット
- status を AI が勝手に決める
- priority を AI が完全自動決定する
- 落選理由を AI が断定する
- DB 保存まで AI に自動でやらせる
- 入力がない状態で分析させる

## 10.5 AI の成功条件

- 入力形式を決める
- 出力形式を JSON などで固定する
- DB 保存前にユーザー確認を入れる
- AI 結果は提案として扱う
- ユーザーが編集できるようにする
- AI が失敗しても CRUD 本体が壊れない
- 次アクションに落とし込む
- 求人情報・希望条件・スキル情報など判断材料を明示する

---

# 11. 23 日ロードマップ

## 全体方針

残り 23 日は、JobHunt を SaaS として完成させるのではなく、以下 3 つを同時回収する。

1. 実務開始前の Laravel / React 復習
2. ポートフォリオ強化
3. Udemy 教材原型作成

---

## Week 1：JobHunt MVP 完成・Dashboard 強化

### Day 1

完了済み：

- React 主要機能実装
- CompanyDetailModal
- CompanyTable
- CompanyRegisterForm
- SearchForm
- SummaryCards

### Day 2

完了済み / 着手済み：

- Laravel API 整理
- StoreCompanyRequest
- UpdateCompanyRequest
- Rule::in
- CompanyResource
- Feature Test 11pass
- .env.testing

### Day 3

現在地：

- テスト理解
- Factory 理解
- Feature Test 追加
- API 整理
- Udemy 切り分け検討

### Day 4

予定：

- types 分離
- constants 分離
- utils 分離
- App.tsx 整理完了
- Dashboard 集計 API 設計
- Dashboard 表示強化

### Day 5

予定：

- Dashboard 集計完成
- 応募総数
- status 別件数
- media 別件数
- priority 別件数
- 面談予定一覧
- 返答待ち一覧
- 次アクション一覧

### Day 6

予定：

- UX 調整
- 詳細モーダル整理
- エラー表示
- 保存中表示
- URL 表示
- 空データ表示
- 一覧行の見やすさ改善

### Day 7

予定：

- README 初稿
- スクショ撮影
- API 仕様整理
- DB 設計整理
- テスト仕様整理
- GitHub 説明文整理
- 1 回目の完成 push

---

## Week 2：JobHunt Pro 拡張・実務準備

### Day 8

- 認証方針決定
- Laravel Sanctum / Breeze / Firebase Auth の比較
- 認証を入れるか、設計だけに留めるか判断

### Day 9

- 認証実装または設計書化
- user_id 追加設計
- companies と users の紐付け
- ゲストモード検討

### Day 10

- 次アクション管理強化
- due_date 追加検討
- 今日やること一覧
- 今週やること一覧
- 返答待ち一覧

### Day 11

- 通知機能の土台
- 通知テーブル設計
- Laravel Scheduler 調査
- 面談前日通知設計
- 返答待ち通知設計

### Day 12

- Google カレンダー連携調査
- OAuth の流れ整理
- Calendar Event 登録仕様
- 面談 URL / 求人 URL の保存仕様

### Day 13

- Google カレンダー連携の最小実装または設計書化
- 面談予定をカレンダー登録
- event_id 保存
- 更新・削除方針整理

### Day 14

- Week 2 まとめ
- README 更新
- 拡張設計メモ
- 認証 / 通知 / Google カレンダーの今後方針を書く

---

## Week 3：Udemy 原型・ポートフォリオ化・実務復習

### Day 15

- Udemy 講座構成確定
- JobHunt Lite の範囲確定
- 章立て作成
- 講座タイトル仮決定

### Day 16

- 撮影用ブランチ整理
- 初期状態ブランチ
- 完成状態ブランチ
- Chapter ごとの差分整理

### Day 17

- Chapter 1〜4 の台本メモ
- 講座概要
- 環境構築
- DB 設計
- Laravel CRUD API

### Day 18

- Chapter 5〜8 の台本メモ
- FormRequest
- Resource
- React 一覧
- 登録フォーム

### Day 19

- Chapter 9〜13 の台本メモ
- 検索
- 詳細モーダル
- インライン更新
- コンポーネント分割
- Feature Test

### Day 20

- README 最終化
- スクショ差し込み
- API 仕様整理
- DB 設計整理
- テスト仕様整理

### Day 21

- ポートフォリオ説明文作成
- 職務経歴書への追記文作成
- 面接説明用メモ
- GitHub トップ説明文

### Day 22

- Laravel 復習
- Feature Test 復習
- 認証復習
- React TypeScript 復習
- 実務開始前の弱点洗い出し

### Day 23

- 最終 push
- README 確認
- 動作確認
- スクショ確認
- Udemy 構想メモ整理
- 6/15 以降の実務準備計画作成

---

# 12. 10 時間 / day の時間割例

## 通常日

- 1h：前日の整理・今日の作業確認
- 3h：実装
- 1h：テスト
- 2h：実装
- 1h：README / 設計メモ
- 1h：復習・理解整理
- 1h：commit / push / 明日の準備

## 実装重視日

- 1h：設計確認
- 4h：実装
- 1h：テスト
- 2h：実装
- 1h：バグ修正
- 1h：記録・push

## 教材化重視日

- 1h：章立て
- 2h：台本メモ
- 2h：コード整理
- 2h：README / 図解
- 1h：サンプル動画構成
- 1h：GitHub 整理
- 1h：振り返り

---

# 13. 月 5 万円バックの現実的プラン

## 13.1 Udemy だけで月 5 万円は読みにくい

Udemy 単体で月 5 万円は可能性はあるが、最初から安定して狙うのは難しい。

理由：

- 集客が必要
- レビューが必要
- 初速が読めない
- 競合が多い
- セール価格で単価が下がる

## 13.2 現実的な回収ルート

月 5 万円相当を狙うなら、複数ルートで考える。

- Udemy：1〜3 万円
- Zenn / Qiita / note 導線：0〜1 万円
- 個別相談 / メンタリング：1〜3 万円
- ポートフォリオ強化による案件単価アップ：実質的な回収
- GitHub / X / ブログから信用獲得

## 13.3 最初に作るべきもの

いきなり 10 時間動画を全部撮るより、まず以下を作る。

- 講座タイトル案
- 講座 LP 文
- 章立て
- 完成物 README
- GitHub
- サンプル動画 1 本
- Zenn 記事 1 本

## 13.4 最初のサンプル動画候補

- FormRequest と Rule::in で不正な status を弾く
- CompanyResource で snake_case を camelCase に変換する
- Feature Test で登録 API を検証する
- React から Laravel API を叩いて一覧表示する

このあたりは教育コンテンツとして強い。

---

# 14. 今後の優先順位

## 優先度 A

- Dashboard / 集計強化
- 次アクション一覧
- 面談予定一覧
- 返答待ち一覧
- README
- スクショ
- API 仕様
- DB 設計
- テスト仕様

## 優先度 B

- 認証
- user_id 設計
- 通知土台
- Google カレンダー連携
- 選考履歴ログ

## 優先度 C

- AI 求人票構造化
- AI 面談準備メモ
- AI 応募文面生成
- CSV / Excel インポート
- ファイル管理
- SaaS 化
- 決済

---

# 15. 直近の次アクション

## 今日残り

- CompanyController 整理
- CompanyResource 整理
- README 用メモ作成
- Feature Test 11pass 結果メモ
- commit / push

## 明日

- types 分離
- constants 分離
- utils 分離
- Dashboard 集計 API
- Dashboard 表示強化

## 明後日

- 次アクション一覧
- 面談予定一覧
- 返答待ち一覧
- README 初稿
- スクショ撮影

---

# 16. 判断まとめ

JobHunt は 3 日で MVP 土台まで到達した。

今後は、単なる CRUD を増やすよりも、以下に進むべき。

- 次に何をすればいいか分かる
- 面談予定を忘れない
- 返答待ちを放置しない
- 高優先度企業を見落とさない
- Dashboard で状況を把握できる

Udemy では JobHunt 本体を全部出すのではなく、JobHunt Lite として切り出す。

JobHunt 本体は、転職活動を迷わず進める Copilot 型 CRM へ育てる。

現時点の最適方針：

- JobHunt Lite = Udemy / 教材用
- JobHunt Pro = ポートフォリオ / 実用用
- JobHunt Copilot = 将来的な AI / 通知 / カレンダー連携構想

この切り方なら、自分の実務準備、ポートフォリオ強化、教材化、将来的な月 5 万円回収のすべてに繋がる。
