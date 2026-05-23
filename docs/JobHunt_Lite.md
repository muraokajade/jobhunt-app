# JobHunt Lite 設計・実装手順：清楚系エレガントUI/UX版

## 0. 前提

JobHunt Liteは、Laravel × Reactで作る転職活動管理アプリの教材版である。

目的は、SaaSとして完成させることではなく、以下を満たすこと。

- Laravel × Reactの実務寄りCRUD教材として成立する
- GitHubリポジトリとして見せられる
- Udemy講座の題材として使える
- 清楚系でエレガントなUI/UXにする
- 機能を増やしすぎず、設計・実装・テストの流れを説明できる
- JobHunt Proへ拡張できる余地を残す

---

# 1. JobHunt Liteの完成定義

## 1-1. JobHunt Liteで作るもの

JobHunt Liteでは、以下の機能に絞る。

- 企業登録
- 企業一覧表示
- 検索・絞り込み
- 詳細モーダル編集
- priority / status インライン更新
- ActionLists
- TodayStrategyPanel
- SummaryCards
- Laravel API CRUD
- FormRequest
- Resource
- Feature Test
- types / constants / utils分離
- README
- GitHub公開

---

## 1-2. JobHunt Liteでやらないもの

JobHunt Liteでは以下はやらない。

- 認証
- ログイン
- ユーザー別管理
- Googleカレンダー連携
- 通知
- AI
- 決済
- SaaS運用
- 複雑なDashboard API
- 複雑な画面遷移
- 大規模な状態管理ライブラリ導入

これらはJobHunt Proの拡張候補にする。

---

## 1-3. JobHunt Liteの教材価値

JobHunt Liteの価値は、機能数ではなく、以下にある。

- Laravel APIとReactを接続する経験
- FormRequestでバリデーションを分離する経験
- ResourceでAPIレスポンスを整える経験
- React TypeScriptで型を意識する経験
- コンポーネント分割を行う経験
- Feature TestでAPIを検証する経験
- READMEに説明できる成果物を作る経験

---

# 2. UI/UX方針

## 2-1. 目指すUI

JobHunt LiteのUIは、清楚系エレガントを目指す。

方向性：

- 派手すぎない
- 情報が見やすい
- 余白が整っている
- カードが柔らかい
- 業務アプリ感がある
- 教材スクショとして見栄えが良い
- 初学者が「作ってみたい」と思える

---

## 2-2. 色の方針

使用する色は絞る。

背景：

- slate-50
- slate-100

メイン：

- slate-900

カード：

- white

枠線：

- slate-200

補足文字：

- slate-500
- slate-600

危険操作：

- red-600

アクセント：

- slate-900
- 必要最低限のblue系

---

## 2-3. 角丸・影・余白

角丸：

- 大カード：rounded-2xl
- 入力欄：rounded-xl
- ボタン：rounded-xl
- バッジ：rounded-full

影：

- shadow-smを中心にする
- 濃いshadowは使いすぎない

余白：

- セクション間：mb-6からmb-8
- カード内：p-5からp-6
- 入力欄高さ：h-11

---

## 2-4. UIで大事にすること

JobHunt Liteの画面では、以下の順で見えるようにする。

1. これは転職活動管理アプリである
2. 今、次に見るべき企業が分かる
3. 企業を検索・絞り込みできる
4. 企業を登録できる
5. 一覧から詳細確認・更新できる

つまり、ただの一覧アプリではなく、転職活動の状況を整理する画面に見せる。

---

# 3. 画面構成

## 3-1. 画面全体

JobHunt LiteはSPAでよい。

React Routerを使った複数ページ構成にしてもよいが、教材版では1画面SPAでも十分成立する。

最初は以下の構成にする。

- AppHeader
- Hero
- TodayStrategyPanel
- SearchForm
- SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

---

## 3-2. SPAでよい理由

JobHunt Liteでは、画面遷移そのものよりも、Laravel APIとReactの連携を学ぶことが重要である。

そのため、以下のようなSPA構成でよい。

- 企業一覧
- 登録フォーム
- 検索フォーム
- 詳細モーダル
- Dashboard風表示

画面遷移を増やしすぎると、教材として焦点がぼやける。

---

## 3-3. 画面遷移を入れる場合

もし画面遷移を入れるなら、以下の程度に抑える。

- /companies
- /dashboard
- /about

ただし、JobHunt Liteでは必須ではない。

Udemy教材としては、まず1画面SPAで完成させた後、拡張としてReact Routerを紹介する方が分かりやすい。

---

# 4. コンポーネント設計

## 4-1. App.tsxの役割

App.tsxは、以下を担当する。

- state管理
- API通信
- 画面全体の配置
- 子コンポーネントへのprops受け渡し
- 登録・更新・削除・検索処理

ただし、App.tsxが肥大化しすぎないように、以下は外へ分ける。

- types
- constants
- utils
- components

---

## 4-2. AppHeader

AppHeaderは、アプリ上部のヘッダーを担当する。

表示内容：

- JobHuntロゴ
- 応募管理
- Dashboard
- 検討リスト
- 設定
- ユーザー名
- ログアウトボタン

JobHunt Liteでは認証は実装しないため、ユーザー名はmockでよい。

例：

- 村岡 兼通さん
- ログイン中
- ログアウト

---

## 4-3. Hero

Heroは、ログイン後の管理画面感を出すための導入エリアである。

表示内容：

- ユーザー名
- 転職活動ダッシュボード
- 次に確認すべき企業を整理しましょう
- 応募管理
- 面談予定
- 次アクション
- 優先企業

Heroは黒系のカードにしてよい。

ただし、ページ全体が重くならないよう、黒を使うのはHeroと一部ボタンだけにする。

---

## 4-4. TodayStrategyPanel

TodayStrategyPanelは、今日の作戦ボードを表示する。

JobHunt Liteでは完全な実データでなくてもよいが、最終的にはcompaniesから生成できるとよい。

表示内容：

- 面談予定を確認
- 返答待ちを確認
- 優先企業を整理
- 仮スコア

教材版では、まずmockで作り、その後companiesデータから生成する流れにすると分かりやすい。

---

## 4-5. SearchForm

SearchFormは、検索・絞り込み条件を入力するコンポーネントである。

表示内容：

- keyword入力
- status選択
- media入力
- 検索ボタン

役割：

- UIを表示する
- 入力値を親へ渡す
- 検索処理自体はApp.tsxに任せる

---

## 4-6. SummaryCards

SummaryCardsは、応募状況の件数を表示する。

表示内容：

- 応募総数
- 面談予定
- 返答待ち
- 内定
- 落選

JobHunt Liteでは、companies配列からフロント側で集計してよい。

JobHunt Proでは、Laravel Dashboard APIから取得する方針にできる。

---

## 4-7. ActionLists

ActionListsは、次に確認すべき企業を表示する。

表示内容：

- 面談予定
- 返答待ち
- 高優先度

役割：

- 全企業ではなく、今見るべき企業だけを表示する
- 各リストを最大3件程度にする
- 詳細ボタンからCompanyDetailModalを開けるようにする

---

## 4-8. CompanyRegisterForm

CompanyRegisterFormは、企業登録フォームを担当する。

表示内容：

- 企業名
- 媒体
- 志望度
- 求人URL
- メモ
- 登録ボタン

JobHunt Liteでは、登録項目を多くしすぎない。

詳細項目はCompanyDetailModalで編集する形にする。

---

## 4-9. CompanyTable

CompanyTableは、企業一覧を表示する。

表示内容：

- 企業名
- 媒体
- 志望度
- 状況
- 応募日
- 面談日
- 次アクション
- 書類結果
- 1次結果
- メモ
- 詳細ボタン
- 削除ボタン

CompanyTableでは、priorityとstatusをインライン更新できるようにする。

---

## 4-10. CompanyDetailModal

CompanyDetailModalは、企業詳細の確認・編集を担当する。

表示内容：

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
- 保存ボタン
- 閉じるボタン

UIは清楚にする。

- 入力欄の高さを揃える
- ラベルを太字にしすぎない
- セクションを分ける
- スクロールしても疲れにくくする

---

# 5. types設計

## 5-1. types/company.ts

Company型、CompanyForm型、Option型を定義する。

目的：

- 型定義を一箇所に集約する
- コンポーネントごとの重複を減らす
- React側の責務を整理する

内容：

    export type Company = {
      id: number;
      name: string;
      media: string | null;
      priority: string | null;
      status: string;
      appliedDate: string | null;
      interviewDate: string | null;
      jobUrl: string | null;
      interviewUrl: string | null;
      memo: string | null;
      nextAction: string | null;
      documentResult: string | null;
      firstInterviewResult: string | null;
      secondInterviewResult: string | null;
      finalResult: string | null;
      rejectionStage: string | null;
      createdAt: string;
      updatedAt: string;
    };

    export type CompanyForm = {
      name: string;
      media: string;
      priority: string;
      status: string;
      applied_date: string;
      interview_date: string;
      job_url: string;
      interview_url: string;
      memo: string;
      next_action: string;
      document_result: string;
      first_interview_result: string;
      second_interview_result: string;
      final_result: string;
      rejection_stage: string;
    };

    export type Option = {
      value: string;
      label: string;
    };

---

# 6. constants設計

## 6-1. constants/companyOptions.ts

選択肢をまとめる。

対象：

- priorityOptions
- statusOptions
- resultOptions
- rejectionStageOptions

目的：

- App.tsxを軽くする
- 選択肢を一箇所で管理する
- LaravelのRule::inと対応しやすくする

---

# 7. utils設計

## 7-1. utils/companyUtils.ts

変換処理・初期値生成をまとめる。

対象：

- getTodayString
- createInitialForm
- toDateTimeLocal
- toApiDateTime
- buildCompanyRequestBody

目的：

- App.tsxを軽くする
- フォーム初期値の重複を防ぐ
- Laravel APIへ送るrequestBodyを統一する
- PUT全体更新の補助をする

---

## 7-2. buildCompanyRequestBody

buildCompanyRequestBodyは、CompanyデータをLaravel APIへ送る形式に変換する関数である。

特に重要なのは、PUT全体更新への対応である。

priorityだけ変更する場合でも、APIへは全体データを送る。

そのため、既存companyをベースにして、変更したい項目だけoverridesで上書きする。

例：

    buildCompanyRequestBody(company, { priority: "5.0" });

意味：

- 既存companyの値を使う
- priorityだけ5.0に上書きする

---

## 7-3. Partial<CompanyForm> = {}

意味：

    overrides: Partial<CompanyForm> = {}

これは、第二引数に一部のフォーム項目だけ渡せるという意味である。

第二引数がない場合は、空オブジェクトとして扱う。

例：

    buildCompanyRequestBody(company);

この場合は上書きなし。

例：

    buildCompanyRequestBody(company, { status: "面談予定" });

この場合はstatusだけ上書き。

---

# 8. Laravel設計

## 8-1. Companyモデル

Companyモデルは、companiesテーブルの1行を表す。

fillableに保存可能なカラムを定義する。

対象：

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

## 8-2. CompanyController

CompanyControllerは、企業CRUD APIを担当する。

メソッド：

- index
- store
- show
- update
- destroy

責務：

- 一覧取得
- 登録
- 詳細取得
- 更新
- 削除

---

## 8-3. StoreCompanyRequest

StoreCompanyRequestは、企業登録時のバリデーションを担当する。

主なルール：

- name必須
- status必須
- job_urlはURL形式
- interview_urlはURL形式
- priorityは許可値のみ
- statusは許可値のみ

---

## 8-4. UpdateCompanyRequest

UpdateCompanyRequestは、企業更新時のバリデーションを担当する。

JobHunt Liteでは、PUT全体更新として扱う。

将来的にPATCHを入れる場合は、専用Requestを作る。

---

## 8-5. CompanyResource

CompanyResourceは、Laravel側のsnake_caseをReact側のcamelCaseへ変換する。

例：

- applied_date → appliedDate
- interview_date → interviewDate
- job_url → jobUrl
- next_action → nextAction

Resourceを使うことで、APIレスポンス形式を統一できる。

---

# 9. Feature Test設計

## 9-1. テスト一覧

JobHunt Liteでは、以下のFeature Testを用意する。

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

## 9-2. テスト専用DB

Feature Testでは、開発用DBを壊さないように.env.testingを使う。

目的：

- テスト実行時にブラウザ用データが消えないようにする
- 安全にRefreshDatabaseを使う
- テストを何度でも実行できるようにする

---

# 10. UI実装手順

## 10-1. Step 1：全体背景と幅

App.tsxのmain部分を整える。

方針：

- 背景はslate-100
- コンテンツ幅はmax-w-7xl
- セクション間に余白を持たせる

目的：

- 画面が広がりすぎないようにする
- 教材スクショとして見やすくする

---

## 10-2. Step 2：AppHeader

AppHeaderを整える。

作業：

- 左にJobHuntロゴ
- 中央にナビ
- 右にユーザー名とログアウト
- 高さをコンパクトにする
- border-bを薄くする

完了条件：

- サービス画面らしく見える
- ログイン後の自分の管理画面感がある

---

## 10-3. Step 3：Hero

Heroを整える。

作業：

- 黒系カード
- ユーザー名入り
- キャッチコピー
- 小さなタグ

文言例：

- 村岡 兼通さんの転職活動ダッシュボード
- 次に確認すべき企業を整理しましょう
- 応募企業・面談予定・返答待ち・優先企業をまとめて管理できます

完了条件：

- アプリの目的が一目で分かる
- 見た目にリッチ感が出る

---

## 10-4. Step 4：TodayStrategyPanel

作業：

- mockカードを清楚にする
- 白カードと黒カードのバランスを取る
- Mockバッジは最終的には消す
- 進捗カードは右側に配置する

完了条件：

- Dashboard風に見える
- ただのCRUDではなく行動支援に見える

---

## 10-5. Step 5：SearchForm

作業：

- input / select / buttonの高さを揃える
- rounded-xlにする
- h-11にする
- sectionはrounded-2xlにする
- shadow-smにする

完了条件：

- 入力欄が整って見える
- 業務アプリっぽい検索欄になる

---

## 10-6. Step 6：SummaryCards

作業：

- 角丸をrounded-2xlにする
- p-4またはp-5にする
- 数字をtext-2xlまたはtext-3xlにする
- ラベルはtext-sm text-slate-500にする

完了条件：

- 数字が見やすい
- カードが軽く上品に見える

---

## 10-7. Step 7：ActionLists

作業：

- 外側カードをrounded-2xlにする
- 内側カードの黒枠を薄くする
- border-slate-200にする
- bg-slate-50を使う
- 詳細ボタンを追加する
- 最大3件に制限する

完了条件：

- 重要企業リストとして見やすい
- 一覧テーブルまで行かなくても詳細確認できる

---

## 10-8. Step 8：CompanyRegisterForm

作業：

- カードをrounded-2xlにする
- 入力欄の高さを統一する
- 登録フォームの存在感を少し抑える
- 詳細項目を詰め込みすぎない

完了条件：

- 登録フォームが重すぎない
- DashboardやActionListsの邪魔をしない

---

## 10-9. Step 9：CompanyTable

作業：

- ヘッダーをslate-900で統一
- 行の高さを揃える
- selectの高さを揃える
- 詳細ボタンと削除ボタンを整える
- テーブル全体をrounded-2xlにする

完了条件：

- 業務アプリの一覧っぽく見える
- 情報が読みやすい

---

## 10-10. Step 10：CompanyDetailModal

作業：

- モーダル幅を適切にする
- ラベルと入力欄の余白を揃える
- セクション分けする
- URL欄を見やすくする
- 保存ボタンと閉じるボタンを整える

完了条件：

- 長いフォームでも読みやすい
- 編集画面として使いやすい
- 清楚でエレガントに見える

---

# 11. 画面遷移方針

## 11-1. JobHunt LiteではSPAでよい

JobHunt Liteは1画面SPAで進める。

理由：

- 教材として分かりやすい
- CRUDとAPI連携に集中できる
- 画面遷移で複雑化しすぎない
- モーダル編集で十分実務感が出る

---

## 11-2. 画面遷移を入れる場合

余裕があれば、React Routerで以下を作る。

- /companies
- /dashboard
- /about

ただし、これはJobHunt Proまたは追加章でよい。

Liteでは必須ではない。

---

# 12. 実装順序

## 12-1. 今日の順序

今日の順序は以下。

1. UI微調整
2. ActionListsから詳細モーダルを開く
3. CompanyDetailModalを清楚に整える
4. CompanyTableを整える
5. Feature Test 11pass確認
6. JobHunt Lite設計メモ作成
7. README下書き
8. GitHub新規リポジトリ準備

---

## 12-2. その後の順序

JobHunt Liteの完成に向けて、以下を進める。

1. README完成
2. スクショ撮影
3. 起動手順整理
4. API仕様整理
5. テスト一覧整理
6. Udemy章立て整理
7. GitHub新規リポジトリ作成
8. push
9. サンプル動画構成作成

---

# 13. README構成

## 13-1. READMEに書く内容

READMEには以下を書く。

- アプリ概要
- 使用技術
- 機能一覧
- 画面スクショ
- API仕様
- DB設計
- テスト一覧
- セットアップ手順
- 今後の拡張
- Udemy教材化想定

---

## 13-2. README説明文

JobHunt Liteは、Laravel × Reactで作成した転職活動管理CRMです。

応募企業、選考状況、面談予定、求人URL、面談URL、次アクションを一元管理できます。

Laravel側では、FormRequestによる入力検証、CompanyResourceによるレスポンス整形、Feature TestによるAPI検証を実装しています。

React側では、企業一覧、登録フォーム、検索フォーム、詳細モーダル、インライン更新、ActionLists、TodayStrategyPanelを実装しています。

---

# 14. Udemy講座化方針

## 14-1. 講座タイトル案

Laravel × Reactで作る実務CRUDアプリ

転職活動管理アプリ JobHunt Lite で学ぶAPI設計・バリデーション・テスト

---

## 14-2. 対象者

対象者：

- Laravel基礎を終えた人
- React基礎を終えた人
- Todoアプリの次に進みたい人
- Laravel APIとReactをつなげたい人
- 実務寄りCRUDを作りたい人
- Feature Testを学びたい人

---

## 14-3. 講座で伝えること

伝えること：

- Laravel API CRUD
- React API連携
- FormRequest
- Resource
- Feature Test
- TypeScript型定義
- コンポーネント分割
- utils / constants分離
- README化
- GitHub公開

---

# 15. 最終判断

JobHunt Liteは、単体SaaSではなく、Laravel × React教材原型として扱う。

今日やることは以下。

- 清楚系エレガントUIに整える
- 機能は増やしすぎない
- ActionListsから詳細を開けるようにする
- 詳細モーダルとテーブルを整える
- Feature Test 11passを維持する
- READMEと設計メモに残す

これで、JobHunt LiteはGitHub公開・Udemy導線・教材原型として成立する。

JobHunt Proでは、後半に以下を追加する。

- Dashboard API
- 認証
- Googleカレンダー
- 通知
- Service層
- AI補助

まずはLiteを完成させる。
