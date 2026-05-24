# JobHunt Lite 詳細設計書

## 0. ドキュメント概要

### ドキュメント名

JobHunt Lite 詳細設計書

### 対象アプリ

JobHunt Lite

### 作成目的

JobHunt Liteの設計・実装・テスト・README化・GitHub公開・Udemy教材化に向けて、現時点の仕様と作業方針を整理する。

この設計書は、完璧な事前設計書ではなく、実装と並行して更新する実践型の詳細設計書である。

目的は以下。

- JobHunt Liteの完成範囲を固定する
- Pro拡張とLite範囲を分離する
- 実装中に方向性がブレないようにする
- READMEやUdemy教材説明へ転用できる情報を整理する
- Laravel × Reactの実務寄りCRUD教材として説明できる状態にする
- 実装後にExcel設計書へ反映しやすくする

---

## 1. JobHunt Liteの位置づけ

### 1-1. JobHunt Liteとは

JobHunt Liteは、Laravel × React / TypeScriptで作成する転職活動管理アプリである。

応募企業、選考状況、面談予定、求人URL、次アクション、メモなどを一元管理する。

ただし、JobHunt Liteは本格SaaSではない。

主な位置づけは以下。

- Laravel × Reactの実務寄りCRUD教材
- GitHub公開用ポートフォリオ
- Udemy講座化の原型
- JobHunt Proへ拡張するための土台
- Laravel / React / TypeScript / Feature Testの復習材料

---

### 1-2. JobHunt Liteで狙う価値

JobHunt Liteの価値は、機能数の多さではなく、以下にある。

- Todoアプリより実務寄りの題材である
- Laravel APIとReactを接続する流れを学べる
- FormRequestでバリデーションを分離できる
- ResourceでAPIレスポンスを整形できる
- React TypeScriptで型を定義できる
- コンポーネント分割を学べる
- Feature TestでAPIの動作を保証できる
- READMEや設計書に落とし込める
- Udemy教材として説明しやすい

---

### 1-3. JobHunt LiteとJobHunt Proの切り分け

#### JobHunt Lite

教材・GitHub公開・短期完成を目的とする。

対象機能：

- 企業登録
- 企業一覧表示
- 検索・絞り込み
- 詳細モーダル表示
- 詳細モーダル編集
- priority / status インライン更新
- SummaryCards
- ActionLists
- TodayStrategyPanel
- Laravel API CRUD
- FormRequest
- Resource
- Feature Test
- types / constants / utils分離
- README
- スクショ
- GitHub公開
- Udemy導線

#### JobHunt Pro

単価アップ・ポートフォリオ強化・将来拡張を目的とする。

対象候補：

- 認証
- ログイン
- ユーザー別企業管理
- Dashboard API
- Googleカレンダー連携
- 通知機能
- 選考履歴ログ
- Service層
- AI求人票構造化
- AI面談準備メモ
- CSV / Excelインポート
- SaaS運用

---

## 2. 今日・明日の作業方針

### 2-1. 今日の方針

今日の目的は、JobHunt Liteの見た目・機能・設計書の土台を固めることである。

今日の主な作業は以下。

1. JobHunt Lite基準に設計書を修正する
2. UIを清楚系エレガントに調整する
3. ActionListsから詳細モーダルを開けるようにする
4. CompanyDetailModalを見やすく整理する
5. CompanyTableを見やすく整理する
6. Feature Test 11passを維持する
7. README下書きを作成する
8. Excel設計書へ最低限反映する
9. commit / pushする

---

### 2-2. 明日の方針

明日は、JobHunt LiteをGitHub公開・Udemy導線に乗せる日とする。

明日の主な作業は以下。

1. READMEを完成させる
2. スクショを撮影する
3. GitHub新規リポジトリを作成する
4. JobHunt Liteとしてpushする
5. Udemy講座構成を整理する
6. サンプル講座説明文を作成する
7. Pro拡張計画をREADME末尾に追記する
8. Excel設計書を整える
9. 最終動作確認を行う

---

### 2-3. 作業サイクル

今後は以下のサイクルで進める。

1. 設計 30〜45分
2. 実装 30〜45分
3. 動作確認 10分
4. 設計書へ差分追記 10分

設計書を完璧にしてから実装するのではなく、実装と設計を短いサイクルで回す。

---

## 3. JobHunt Liteの完成範囲

### 3-1. Liteに含める機能

JobHunt Liteに含める機能は以下。

#### 企業管理

- 企業登録
- 企業一覧表示
- 企業詳細表示
- 企業詳細編集
- 企業削除

#### 検索・絞り込み

- 企業名・メモ検索
- status絞り込み
- media絞り込み

#### 選考管理

- 志望度管理
- 選考状況管理
- 応募日管理
- 面談日管理
- 求人URL管理
- 面談URL管理
- 次アクション管理
- 書類選考結果管理
- 1次面接結果管理
- 2次面接結果管理
- 最終結果管理
- 落選段階管理
- メモ管理

#### Dashboard風表示

- SummaryCards
- ActionLists
- TodayStrategyPanel

#### Laravel

- Companyモデル
- Migration
- CompanyController
- StoreCompanyRequest
- UpdateCompanyRequest
- CompanyResource
- CompanyFactory
- Feature Test

#### React

- AppHeader
- Hero
- SearchForm
- SummaryCards
- ActionLists
- TodayStrategyPanel
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal
- types分離
- constants分離
- utils分離

---

### 3-2. Liteに含めない機能

JobHunt Liteでは以下を含めない。

- 認証
- ログイン
- ユーザー登録
- ユーザー別管理
- Googleカレンダー連携
- 通知
- AI
- 決済
- SaaS運用
- 高度な権限管理
- 複雑なDashboard API
- Service層の本格導入
- React Routerによる複雑な画面遷移

---

## 4. UI/UX設計

### 4-1. UIコンセプト

JobHunt LiteのUIは、清楚系エレガントな業務アプリUIを目指す。

方向性は以下。

- 派手すぎない
- 情報が見やすい
- 教材スクショとして見栄えが良い
- 余白が整っている
- カードが柔らかい
- 操作に迷わない
- 初学者が「これを作ってみたい」と思える

---

### 4-2. カラー方針

背景：

- slate-50
- slate-100

メイン：

- slate-900

カード：

- white

枠線：

- slate-200

補足テキスト：

- slate-500
- slate-600

危険操作：

- red-600

アクセント：

- slate-900を中心にする
- 色数を増やしすぎない

---

### 4-3. 角丸・余白・影

角丸：

- 大カード：rounded-2xl
- 入力欄：rounded-xl
- ボタン：rounded-xl
- バッジ：rounded-full

余白：

- セクション間：mb-6〜mb-8
- カード内：p-5〜p-6
- 入力欄高さ：h-11

影：

- shadow-sm中心
- 濃いshadowは使いすぎない

---

### 4-4. 視線誘導

画面上部から以下の順に見えるようにする。

1. AppHeader
2. Hero
3. TodayStrategyPanel
4. SearchForm
5. SummaryCards
6. ActionLists
7. CompanyRegisterForm
8. CompanyTable
9. CompanyDetailModal

目的は、ユーザーが開いた瞬間に以下を理解できること。

- これは転職活動CRMである
- 次に確認すべき企業がある
- 検索できる
- 登録できる
- 一覧から詳細確認できる

---

## 5. 画面構成

### 5-1. AppHeader

#### 目的

ログイン後の業務アプリ感を出す。

#### 表示内容

- JobHuntロゴ
- 応募管理
- Dashboard
- 検討リスト
- 設定
- ユーザー名
- ログアウトボタン

#### Liteでの扱い

認証は実装しないため、ユーザー名はmockで表示する。

例：

- 村岡 兼通さん
- ログイン中
- ログアウト

#### Pro拡張

- 実ログインユーザー名を表示
- ログアウト処理
- Dashboardページ遷移
- 設定ページ遷移

---

### 5-2. Hero

#### 目的

アプリの目的を一目で伝える。

#### 表示内容

- ユーザー名
- 転職活動ダッシュボード
- 次に確認すべき企業を整理しましょう
- 応募管理
- 面談予定
- 次アクション
- 優先企業

#### UI方針

- 黒系カード
- 角丸大きめ
- 余白多め
- タグは小さく控えめ

---

### 5-3. TodayStrategyPanel

#### 目的

今日確認すべき行動を表示する。

#### 表示内容

- 面談予定を確認
- 返答待ちを確認
- 優先企業を整理
- 仮スコア

#### Liteでの扱い

最初はmockでよい。

ただし、可能であればcompaniesデータから生成する。

#### Pro拡張

- Dashboard APIから取得
- 通知と連携
- Googleカレンダーと連携
- 次アクション期限と連携

---

### 5-4. SearchForm

#### 目的

企業一覧を検索・絞り込みできるようにする。

#### 表示項目

- keyword
- status
- media
- 検索ボタン

#### 処理

SearchFormは入力UIのみ担当する。

実際の検索処理はApp.tsxで実行する。

---

### 5-5. SummaryCards

#### 目的

転職活動状況の件数を一目で表示する。

#### 表示項目

- 応募総数
- 面談予定
- 返答待ち
- 内定
- 落選

#### Liteでの扱い

companies配列をフロント側で集計する。

#### Pro拡張

Dashboard APIから取得する。

---

### 5-6. ActionLists

#### 目的

次に確認すべき企業を表示する。

#### 表示リスト

- 面談予定
- 返答待ち
- 高優先度

#### 表示条件

面談予定：

- interviewDateが存在する
- またはstatusが面談予定

返答待ち：

- 応募済み
- 書類選考待ち
- 面談日程調整中
- 面談後返答待ち

高優先度：

- priorityが4.0以上

#### 今日の改善対象

- 枠線を薄くする
- 最大3件に制限する
- 詳細ボタンを追加する
- CompanyDetailModalを開けるようにする

---

### 5-7. CompanyRegisterForm

#### 目的

新規企業を登録する。

#### 表示項目

- 企業名
- 媒体
- 志望度
- 求人URL
- メモ
- 登録ボタン

#### Liteでの扱い

登録フォームは軽くする。

詳細項目はCompanyDetailModalで編集する。

---

### 5-8. CompanyTable

#### 目的

登録済み企業を一覧表示する。

#### 表示項目

- 企業名
- 媒体
- 志望度
- 状況
- 応募日
- 面談日
- 次アクション
- 書類
- 1次
- メモ
- 詳細
- 削除

#### 操作

- priorityインライン更新
- statusインライン更新
- 詳細モーダル表示
- 削除

---

### 5-9. CompanyDetailModal

#### 目的

一覧に常時表示しない詳細情報を確認・編集する。

#### 表示項目

- 企業名
- 媒体
- 応募日
- 志望度
- 状況
- 面談日
- 次アクション
- 求人URL
- 面談URL
- 書類選考
- 1次面接
- 2次面接
- 最終結果
- 落選段階
- メモ

#### 今日の改善対象

- セクション分け
- ラベルの整理
- 入力欄の余白統一
- 保存ボタンと閉じるボタン整理
- 長いフォームでも読みやすくする

---

## 6. React設計

### 6-1. App.tsxの役割

App.tsxは以下を担当する。

- companies state
- form state
- detailForm state
- selectedCompany state
- loading state
- fetchCompanies
- createCompany
- updateCompany
- deleteCompany
- openDetailModal
- closeDetailModal
- saveDetail
- inline update
- 画面配置

ただし、以下は分離済み、または分離対象。

- types
- constants
- utils
- components

---

### 6-2. types/company.ts

#### 目的

型定義を集約する。

#### 定義対象

- Company
- CompanyForm
- Option

#### メリット

- 型の重複を防ぐ
- コンポーネントが読みやすくなる
- APIレスポンスの形を意識できる
- 教材として型設計を説明しやすい

---

### 6-3. constants/companyOptions.ts

#### 目的

選択肢を集約する。

#### 定義対象

- priorityOptions
- statusOptions
- resultOptions
- rejectionStageOptions

#### メリット

- App.tsxが軽くなる
- 選択肢を一箇所で管理できる
- LaravelのRule::inと対応しやすい

---

### 6-4. utils/companyUtils.ts

#### 目的

変換処理・初期値生成を集約する。

#### 定義対象

- getTodayString
- createInitialForm
- toDateTimeLocal
- toApiDateTime
- buildCompanyRequestBody

#### buildCompanyRequestBodyの役割

CompanyデータをLaravel API送信用のrequestBodyに変換する。

PUT全体更新に対応するため、既存companyをベースにしつつ、変更したい値だけoverridesで上書きする。

---

## 7. Laravel設計

### 7-1. companiesテーブル

#### カラム

- id
- name
- media
- priority
- status
- applied_date
- interview_date
- job_url
- interview_url
- memo
- next_action
- document_result
- first_interview_result
- second_interview_result
- final_result
- rejection_stage
- created_at
- updated_at

---

### 7-2. Companyモデル

#### 目的

companiesテーブルの1レコードをLaravel上で扱う。

#### fillable対象

- name
- media
- priority
- status
- applied_date
- interview_date
- job_url
- interview_url
- memo
- next_action
- document_result
- first_interview_result
- second_interview_result
- final_result
- rejection_stage

---

### 7-3. CompanyController

#### 目的

企業CRUD APIを担当する。

#### メソッド

- index
- store
- show
- update
- destroy

#### 責務

- 一覧取得
- 登録
- 詳細取得
- 更新
- 削除

---

### 7-4. StoreCompanyRequest

#### 目的

企業登録時のバリデーションを担当する。

#### 主なルール

- name必須
- status必須
- job_urlはURL形式
- interview_urlはURL形式
- priorityは許可値のみ
- statusは許可値のみ

---

### 7-5. UpdateCompanyRequest

#### 目的

企業更新時のバリデーションを担当する。

#### Liteでの扱い

PUT全体更新として扱う。

#### Pro拡張

PATCH専用Requestを追加する。

---

### 7-6. CompanyResource

#### 目的

APIレスポンスをReactで扱いやすい形に変換する。

#### 変換例

- applied_date → appliedDate
- interview_date → interviewDate
- job_url → jobUrl
- interview_url → interviewUrl
- next_action → nextAction

---

## 8. API仕様

### 8-1. GET /api/companies

#### 目的

企業一覧を取得する。

#### クエリ

- keyword
- status
- media

#### 処理

- keywordがある場合、name / memo / next_action を部分一致検索する
- statusがある場合、statusで絞り込む
- mediaがある場合、mediaで絞り込む
- 面談日・作成日順で並び替える

---

### 8-2. POST /api/companies

#### 目的

企業を登録する。

#### バリデーション

StoreCompanyRequestを使用する。

#### レスポンス

CompanyResourceを返す。

---

### 8-3. GET /api/companies/{id}

#### 目的

企業詳細を取得する。

#### レスポンス

CompanyResourceを返す。

---

### 8-4. PUT /api/companies/{id}

#### 目的

企業情報を更新する。

#### バリデーション

UpdateCompanyRequestを使用する。

#### 方針

JobHunt LiteではPUT全体更新とする。

---

### 8-5. DELETE /api/companies/{id}

#### 目的

企業を削除する。

#### レスポンス

削除成功メッセージを返す。

---

## 9. Feature Test設計

### 9-1. テスト一覧

JobHunt Liteで用意するテストは以下。

- 企業を登録できる
- 企業名なしでは登録できない
- 不正な求人URLでは登録できない
- 企業情報を更新できる
- 不正なstatusでは更新できない
- 企業を削除できる
- keywordで検索できる
- statusで絞り込みできる
- mediaで絞り込みできる
- keyword + statusで複合検索できる
- PUT全体更新で既存項目が消えない

---

### 9-2. テスト専用DB

#### 目的

Feature Testで開発DBを壊さないようにする。

#### 方針

.env.testingを用意する。

#### 効果

- RefreshDatabaseを安全に使える
- テスト実行時にブラウザ用データが消えない
- 何度でもテストを実行できる

---

## 10. 今日の作業計画

### 10-1. 1セット目：設計書の方向修正

#### 想定時間

30〜45分

#### 作業内容

- タイトルをJobHunt Liteに統一する
- Pro機能は将来拡張欄へ移動する
- 現行画面に存在する機能だけを設計対象にする
- 会社詳細モーダル設計をLite基準にする

#### 対象シート

- 00\_表紙
- 01\_会社登録画面
- 02\_企業一覧画面
- 03\_会社詳細モーダル
- 04_API仕様
- 05\_テスト仕様
- 10\_変更履歴

---

### 10-2. 2セット目：UI微調整

#### 想定時間

30〜45分

#### 作業内容

- ActionListsの枠線を薄くする
- CompanyTableの余白・行高を整える
- CompanyDetailModalのラベル・入力欄を整える
- 登録フォームを軽く見せる
- SearchFormの高さを揃える
- SummaryCardsの余白を揃える

#### 完了条件

- 清楚系エレガントに少し近づく
- スクショで見たときに教材っぽく見える
- 画面全体の重さが減る

---

### 10-3. 3セット目：ActionLists詳細連携

#### 想定時間

45〜60分

#### 作業内容

- ActionListsPropsにonOpenDetailを追加する
- App.tsxからopenDetailModalを渡す
- 各企業カードに詳細ボタンを追加する
- 詳細ボタンでCompanyDetailModalを開く

#### 完了条件

- ActionListsから直接詳細を開ける
- 一覧テーブルまでスクロールしなくても重要企業を確認できる

---

### 10-4. 4セット目：設計書反映

#### 想定時間

30分

#### 作業内容

Excelに以下を追記する。

- ActionListsの目的
- 表示条件
- 操作
- 利用state
- 詳細モーダル連携
- Pro拡張候補

---

### 10-5. 5セット目：CompanyDetailModal UI整理

#### 想定時間

60分

#### 作業内容

詳細モーダルを以下の区分で整理する。

- 基本情報
- 選考情報
- URL
- メモ
- 保存操作

#### 完了条件

- 長いフォームでも読みやすい
- 入力欄の高さが揃う
- ラベルが見やすい
- 保存操作が分かりやすい

---

### 10-6. 6セット目：Feature Test確認

#### 想定時間

30分

#### 作業内容

CompanyApiTestを実行する。

目的：

- 11pass維持
- UI調整やReact変更でLaravel側が壊れていないことを確認する
- GitHub公開前の安心材料にする

---

### 10-7. 7セット目：README下書き

#### 想定時間

60分

#### 書く内容

- 概要
- 使用技術
- 機能一覧
- 画面構成
- API仕様
- DB設計
- テスト一覧
- 今後の拡張
- Udemy教材化想定

---

### 10-8. 8セット目：Excel設計書更新

#### 想定時間

60〜90分

#### 対象

- 03\_会社詳細モーダル
- 04_API仕様
- 05\_テスト仕様
- 10\_変更履歴

---

## 11. 明日の作業計画

### 11-1. README完成

#### 作業内容

- 概要を整える
- 使用技術を整理する
- 機能一覧を整理する
- API仕様を整理する
- テスト一覧を整理する
- 今後の拡張を書く
- Udemy講座化想定を書く

---

### 11-2. スクショ撮影

#### 撮影対象

- 全体画面
- AppHeader / Hero
- TodayStrategyPanel
- SearchForm / SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

---

### 11-3. GitHub新規リポジトリ作成

#### 作業内容

- GitHubで新規リポジトリ作成
- README追加
- スクショ追加
- backend / frontend構成確認
- push
- リポジトリ説明文設定

---

### 11-4. Udemy導線作成

#### 作業内容

- 講座タイトル案作成
- 講座概要作成
- 対象者作成
- 学べること作成
- セクション構成作成
- サンプル動画候補作成

---

### 11-5. Pro拡張計画追記

#### README末尾に書く内容

- 認証
- Googleカレンダー連携
- 通知
- Dashboard API
- 選考履歴ログ
- AI求人票構造化
- AI面談準備メモ

---

## 12. 今日・明日の勝利条件

### 今日の最低ライン

- JobHunt Liteとして設計書の方向を修正する
- UIを少し清楚系に寄せる
- ActionListsから詳細モーダルを開ける
- Feature Test 11passを維持する

---

### 今日の標準ライン

- CompanyDetailModalのUIを整理する
- Excel設計書に差分を反映する
- README下書きを作る
- commit / pushする

---

### 今日の勝ちライン

- READMEの骨子がほぼ完成する
- スクショ候補画面が整う
- GitHub新規リポジトリ作成準備ができる

---

### 明日の最低ライン

- README完成
- スクショ撮影
- GitHub新規リポジトリ作成
- push完了

---

### 明日の標準ライン

- Udemy講座構成作成
- GitHub説明文作成
- Pro拡張計画追記

---

### 明日の勝ちライン

- JobHunt Liteを教材原型として公開できる
- Udemy導線が見える
- JobHunt Proへ進む判断材料が揃う

---

## 13. 最終判断

JobHunt Liteは、短期で完成させる。

目的は、Laravel × Reactの教材原型として成立させること。

今日・明日は、機能を増やしすぎない。

今やるべきことは以下。

- 清楚系エレガントUIに整える
- 詳細モーダルと一覧を見やすくする
- ActionListsから詳細確認できるようにする
- Feature Test 11passを維持する
- READMEと設計書を整える
- GitHub公開する
- Udemy導線を作る

JobHunt Liteが完成したら、JobHunt Proとして以下を追加検討する。

- Dashboard API
- 認証
- Googleカレンダー
- 通知
- Service層
- AI補助

まずはLiteを完成させる。

##　5/24-5/25 設計実装完了

### 1. CompanyDetailModalを5ブロックに分ける

- 理由:JobHunt Liteの編集体験は全部モーダルに集まってるから。

1. 基本情報
   - 企業名
   - 媒体
   - 応募日

2. 選考情報
   - 志望度
   - 状況
   - 面談日
   - 次アクション

3. URL
   - 求人URL
   - 面談URL

4. 選考結果
   - 書類選考
   - 1次面接
   - 2次面接
   - 最終結果
   - 落選段階

5. メモ・操作
   - メモ
   - 保存
   - 閉じる

### 見た目:

- モーダル全体：rounded-2xl
- セクションごとに border-t か bg-slate-50
- input/select/textarea：h-11 rounded-xl border-slate-300
- ラベル：text-sm font-semibold text-slate-700
- 保存ボタン：黒
- 閉じるボタン：白/枠線

### 完了条件

- 詳細モーダルを開いたときに「どこを編集すればいいか」迷わない

### 2. ActionListsに「詳細」ボタンを付ける

- ActionListsProps に onOpenDetail を追加
- App.tsx から openDetailModal を渡す
- 各カードに「詳細」ボタンを置く
- クリックで CompanyDetailModal を開く

### 3. CompanyTableを整える

- テーブルヘッダーを濃いslate-900で統一
- 行の高さを少し上げる
- selectをrounded-lg / h-9に統一
- 詳細ボタンをslate-700系にする
- 削除ボタンはred-600だが小さめ
- メモやURLなど長い文字は表示しすぎない

### 4. CompanyRegisterFormを軽くする

- 登録フォームをカード化したまま軽くする
- 入力欄の高さを揃える
- 詳細項目は増やさない
- 登録ボタンだけ黒で目立たせる

### 5. Headerの画面遷移はまだ作らない

- 応募管理：現在画面
- Dashboard：将来拡張
- 検討リスト：将来拡張
- 設定：将来拡張

### 6. 最後にテスト確認

php artisan test --filter=CompanyApiTest
