# 2026-05-24 JobHunt 今日の作業順序

## 今日の結論

今日は、JobHuntを以下の方向に進める。

- 午前前半：UI微調整で画面の見通しを整える
- 午前後半：ActionListsを「見るだけ」から「詳細確認できる」部品にする
- 昼〜午後：App.tsxの重さを少し整理する
- 午後本命：Laravel Dashboard APIを作る
- 夕方以降：Feature Test追加・Excel設計書反映・READMEメモ

今日の主役はLaravel。

Reactは「見た目調整」と「Dashboard APIを使う準備」までに抑える。

---

# 0. 今日の目的

JobHuntを、ただの企業CRUDではなく、

「転職活動で次に確認すべき企業へすぐアクセスできるCRM」

に近づける。

さらに、Laravel側にDashboard APIを追加することで、

「Reactでfilterしているだけの画面」

から、

「Laravel APIがDashboard情報を返す業務アプリ」

に引き上げる。

---

# 1. 今日の全体タスク順

## Step 1：UI微調整

想定時間：30〜45分

目的：

- 朝イチで画面の違和感を潰す
- 見た瞬間にどこを見ればいいか分かる状態にする
- 画面全体の試作感を少し減らす

作業：

- ActionListsの枠線を薄くする
- ActionListsのカード余白を揃える
- SummaryCardsの余白・角丸を揃える
- SearchFormの高さ・角丸を揃える
- CompanyTableの見た目を少しだけ整える
- 「次に確認する企業」セクションを見やすくする

完了条件：

- 黒枠が強すぎない
- カードの角丸・余白が揃っている
- 検索・集計・ActionListsの見た目が統一されている
- 画面を開いたときにDashboard感がある

---

## Step 2：ActionListsから詳細モーダルを開く

想定時間：60〜90分

目的：

ActionListsを「表示するだけのカード」から、「重要企業をすぐ確認できる入口」にする。

作業：

- ActionListsPropsにonOpenDetailを追加する
- App.tsxからActionListsへopenDetailModalを渡す
- 面談予定カードに「詳細」ボタンを追加する
- 返答待ちカードに「詳細」ボタンを追加する
- 高優先度カードに「詳細」ボタンを追加する
- ボタンクリックでCompanyDetailModalを開く

実装イメージ：

App.tsx

- ActionListsにcompaniesを渡す
- ActionListsにonOpenDetailを渡す

ActionLists.tsx

- propsにonOpenDetailを追加
- 各companyカードに詳細ボタンを追加
- onClick={() => onOpenDetail(company)} を呼ぶ

完了条件：

- ActionLists上の企業カードから詳細モーダルを開ける
- 一覧テーブルまでスクロールしなくても重要企業を確認できる
- 「次に見るべき企業」から直接操作できる

---

## Step 3：ActionListsの並び順整理

想定時間：30〜45分

目的：

ActionListsを「なんとなく出ているリスト」ではなく、「優先順に並んだリスト」にする。

作業：

- 面談予定を面談日が近い順に並べる
- 確認待ちは応募日が古い順に並べる
- 高優先度はpriority降順に並べる
- 各リストを最大3件に制限する
- 終了状態の企業を必要に応じて除外する

表示条件：

面談予定：

- interviewDateが存在する
- またはstatusが面談予定
- 面談日が近い順

確認待ち：

- statusが応募済み
- statusが書類選考待ち
- statusが面談日程調整中
- statusが面談後返答待ち
- 応募日が古い順

高優先度：

- priorityが4.0以上
- priority降順
- 落選・辞退は除外候補

完了条件：

- 表示される企業の順番に意味がある
- 見るべき順に並んでいる
- Dashboard感が少し強くなる

---

## Step 4：TodayStrategyPanelを実データ化する

想定時間：90〜120分

目的：

現在のTodayStrategyPanelはMockなので、companiesデータから表示内容を生成する。

作業：

- TodayStrategyPanelにcompaniesをpropsで渡す
- strategyTasksを固定配列から生成関数に変更する
- 面談予定がある場合は「面談予定を確認」を表示
- 確認待ち企業がある場合は「返答待ちを確認」を表示
- 高優先度でnextAction未設定の企業がある場合は「優先企業を整理」を表示
- 何もない場合は「現在の優先タスクはありません」と表示
- Mockバッジを削除する
- 進捗スコアを実データから仮計算する

仮スコアロジック：

- 面談予定がある：+20
- 確認待ち企業がある：+20
- 高優先度企業がある：+20
- 高優先度企業にnextActionが設定されている：+20
- 内定企業がある：+20

完了条件：

- TodayStrategyPanelが固定Mockではなくなる
- 表示内容がcompaniesの状態に応じて変わる
- 仮スコアが実データから計算される
- JobHuntの「次に何を見るか分かる」感が強くなる

---

## Step 5：App.tsxの重さを確認して、最小整理する

想定時間：45〜60分

目的：

App.tsxに処理が集まりすぎているため、今後の教材化・保守のために整理方針を立てる。

今日は大規模リファクタはしない。

ただし、以下を確認する。

現在App.tsxが持っている責務：

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

今後の分離候補：

- hooks/useCompanies.ts
- hooks/useCompanyDetail.ts
- hooks/useToast.ts
- utils/companyUtils.ts
- types/company.ts
- constants/companyOptions.ts

今日やる最低限：

- 既に分離したtypes / constants / utilsが正常に使われているか確認
- App.tsx内のコメントを軽く整理
- これ以上フロント分割に深入りしすぎない

完了条件：

- App.tsxの責務が説明できる
- 次に切り出すならhooksだと判断できる
- 今日はLaravelへ進む準備ができる

---

# 2. Laravel本命タスク

## Step 6：Dashboard API設計

想定時間：30〜45分

目的：

React側でfilterしているDashboardロジックを、Laravel側に寄せる準備をする。

作るAPI：

GET /api/companies/dashboard

返却するもの：

- summary
- actionLists
- alerts

summary：

- total
- interview
- waiting
- offer
- rejected
- highPriority

actionLists：

- interviews
- waiting
- highPriority

alerts：

- missing_next_action
- missing_interview_url
- waiting_without_next_action

完了条件：

- APIの返却形式が決まっている
- Controllerを分ける方針が決まっている
- Excel設計書に書ける粒度になっている

---

## Step 7：CompanyDashboardController作成

想定時間：30〜45分

目的：

Dashboard用の処理をCompanyControllerから分離する。

作るもの：

app/Http/Controllers/Api/CompanyDashboardController.php

コマンド：

php artisan make:controller Api/CompanyDashboardController

役割：

- Dashboard用の集計を担当する
- CRUD処理とは分ける
- GET /api/companies/dashboard を担当する

route追加：

routes/api.php

use App\Http\Controllers\Api\CompanyDashboardController;

Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);

完了条件：

- /api/companies/dashboard にアクセスできる
- 最小のJSONが返る
- CompanyControllerを太らせずに済む

---

## Step 8：Dashboard API最小実装

想定時間：90〜150分

目的：

Laravel側でDashboard表示用データを返す。

最小実装内容：

summary：

- total
- interview
- waiting
- offer
- rejected
- highPriority

actionLists：

- interviews
- waiting
- highPriority

alerts：

- 高優先度なのにnext_action未設定
- 面談予定なのにinterview_url未設定
- 確認待ちなのにnext_action未設定

使うLaravel機能：

- Company::query()
- get()
- count()
- where()
- filter()
- sortBy()
- sortByDesc()
- take()
- values()
- CompanyResource::collection()

完了条件：

- GET /api/companies/dashboard が動く
- summaryが正しい
- actionListsが返る
- alertsが返る
- React側で使える形になっている

---

## Step 9：Dashboard API Feature Test追加

想定時間：60〜90分

目的：

Dashboard APIの集計・リスト返却が壊れないようにする。

追加テスト候補：

1. Dashboard APIがsummaryを返す
2. total件数が正しい
3. highPriority件数が正しい
4. 面談予定企業がactionLists.interviewsに含まれる
5. 高優先度企業がactionLists.highPriorityに含まれる
6. alertsが必要な場合に返る

最低限追加するテスト：

- test_can_get_company_dashboard_summary
- test_dashboard_contains_high_priority_companies

既存テスト：

- CompanyApiTest 11pass維持

完了条件：

- 既存11pass維持
- Dashboard APIテスト1〜3本追加
- テスト専用DBを使い続ける
- Laravel側の実務感が強くなる

---

# 3. ReactとDashboard APIの接続

## Step 10：React側でDashboard APIを読む

想定時間：60〜90分

目的：

Laravel側で作ったDashboard APIをReact側で使う。

ただし、全部一気に移行しなくてよい。

優先順位：

1. SummaryCardsをDashboard APIに寄せる
2. TodayStrategyPanelをDashboard APIに寄せる
3. ActionListsをDashboard APIに寄せる

今日の最低ライン：

- dashboard stateを作る
- fetchDashboardを作る
- SummaryCardsだけAPI結果を使う

完了条件：

- ReactがDashboard APIを読める
- SummaryCardsがAPI結果から表示される
- companies filterだけに依存しない構成になる

---

# 4. Excel設計書反映

## Step 11：Excel_Bookへ反映

想定時間：30〜60分

目的：

実装した内容を、第三者に説明できる設計資料として残す。

今日反映する候補：

- ActionLists設計
- TodayStrategyPanel設計
- Dashboard API設計
- 表示条件
- 利用データ
- テスト観点
- 将来の拡張

Excelシート候補：

01\_画面構成

- Header
- Hero
- TodayStrategyPanel
- SearchForm
- SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

02\_状態管理

- companies
- dashboard
- keyword
- status
- media
- form
- detailForm
- selectedCompany
- isDetailOpen
- loading
- toastMessage

03\_コンポーネント責務

- App.tsx
- AppHeader
- TodayStrategyPanel
- SearchForm
- SummaryCards
- ActionLists
- CompanyRegisterForm
- CompanyTable
- CompanyDetailModal

04\_表示条件

- 面談予定
- 確認待ち
- 高優先度
- 今日の作戦ボード
- 進捗スコア
- 未設定アラート

05_API仕様

- GET /api/companies
- POST /api/companies
- GET /api/companies/{id}
- PUT /api/companies/{id}
- DELETE /api/companies/{id}
- GET /api/companies/dashboard

07\_テスト仕様

- CompanyApiTest 11pass
- Dashboard API test
- バリデーションテスト
- 検索・絞り込みテスト

完了条件：

- Excel_Bookに最低1シート反映する
- Dashboard APIの目的・レスポンス・テスト観点を書ける
- READMEに転用できる状態にする

---

# 5. READMEメモ

## Step 12：README用メモ作成

想定時間：20〜30分

追記候補：

- AppHeader追加
- TodayStrategyPanel追加
- ActionLists追加
- types / constants / utils分離
- Feature Test 11pass
- Dashboard API追加
- Dashboard API Feature Test追加
- 今後の拡張

README説明文候補：

JobHuntは、転職活動中の応募企業・面談予定・返答待ち・優先企業を一元管理するLaravel × React製の転職活動CRMです。

React側では、企業一覧・検索・登録・詳細モーダル・インライン更新に加えて、次に確認すべき企業を表示するActionListsとTodayStrategyPanelを実装しました。

Laravel側では、企業CRUD API、FormRequestによるバリデーション、CompanyResourceによるレスポンス整形、Feature Testによる自動検証を実装しています。

今後はDashboard API、Googleカレンダー連携、通知機能、認証機能へ拡張予定です。

---

# 6. 今日の時間割案

## 10時間想定

### 1時間目

- UI微調整
- ActionLists見た目整理
- 画面の視線誘導確認

### 2時間目

- ActionListsから詳細モーダルを開く
- onOpenDetail props追加
- 詳細ボタン追加

### 3時間目

- ActionLists並び順整理
- 最大3件
- priority降順
- 面談日順

### 4時間目

- TodayStrategyPanel実データ化
- companies props化
- strategyTasks生成

### 5時間目

- TodayStrategyPanelスコア仮計算
- Mock削除
- 動作確認

### 6時間目

- Feature Test 11pass確認
- App.tsx軽量化方針確認
- Laravel Dashboard API設計

### 7時間目

- CompanyDashboardController作成
- route追加
- summary最小実装

### 8時間目

- actionLists / alerts実装
- API動作確認

### 9時間目

- Dashboard API Feature Test追加
- 既存11pass維持確認

### 10時間目

- Excel_Book反映
- READMEメモ
- commit / push

---

# 7. 今日の勝利条件

## 最低ライン

- UI微調整完了
- ActionListsから詳細モーダルを開ける
- Feature Test 11pass維持
- 設計メモを残す

## 標準ライン

- TodayStrategyPanelがcompaniesから生成される
- 仮スコアが実データから計算される
- Excel_Bookに1シート反映する
- READMEメモを残す

## 勝ちライン

- Dashboard APIをLaravel側に追加する
- Dashboard API Feature Testを1〜3本追加する
- React側をDashboard APIに一部寄せる
- READMEに新機能説明を追記する

---

# 8. 今日の最初の行動

最初はUI微調整。

理由：

- 最速で進捗感が出る
- 昨日の画面違和感をすぐ潰せる
- ActionLists改善につながる
- 朝イチの作業として軽い
- 成功体験を作ってからLaravelに入れる

最初に見るファイル：

- App.tsx
- ActionLists.tsx
- TodayStrategyPanel.tsx
- SearchForm.tsx
- SummaryCards.tsx
- CompanyTable.tsx
- CompanyDetailModal.tsx

最初の作業：

- ActionListsの枠線を薄くする
- カード余白を揃える
- 「次に確認する企業」見出しを整える
- 詳細ボタンを置けるスペースを確認する

---

# 9. 今日の判断まとめ

今日のテーマはこれ。

JobHuntを「企業一覧を管理するアプリ」から、
「次に確認すべき企業へすぐアクセスできるCRM」にする。

作業順は以下。

1. UI微調整
2. ActionLists詳細モーダル連携
3. ActionLists並び順整理
4. TodayStrategyPanel実データ化
5. App.tsx重さ確認
6. Dashboard API設計
7. CompanyDashboardController作成
8. Dashboard API最小実装
9. Dashboard API Feature Test追加
10. Excel_Book反映
11. READMEメモ
12. commit / push

Reactは必要最低限。

今日の本命はLaravel Dashboard API。

これで、JobHuntを「Reactでfilterしているだけの画面」から、
「Laravel APIがDashboard情報を返す業務アプリ」に引き上げる。

1. JobHunt Liteの完成定義を固定
2. 既存JobHuntからLite用に切り出す
3. GitHub新規リポジトリ作成
4. README / スクショ / 起動手順整備
5. Udemy章立て・導線作成
6. その後、現行JobHuntをPro化
