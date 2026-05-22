# Excel 転職ログと JobHunt 項目対応表

## 目的

Excel で管理していた転職ログの項目が、JobHunt の画面・DB・API にどう対応しているかを整理する。

今日は新機能を増やすのではなく、現状の設計と実装のズレを確認する。

---

## 1. 企業ごとの入力項目

| Excel 項目     | JobHunt 画面項目 | DB カラム               | API レスポンス        | DB/API   | 現在の画面           |
| -------------- | ---------------- | ----------------------- | --------------------- | -------- | -------------------- |
| 応募した企業名 | 企業名           | name                    | name                  | 実装済み | 入力・表示済み       |
| 媒体           | 媒体             | media                   | media                 | 実装済み | 入力・表示済み       |
| 志望度         | 志望度           | priority                | priority              | 実装済み | 入力・表示済み       |
| 状況           | 状況             | status                  | status                | 実装済み | 表示済み             |
| 応募日         | 応募日           | applied_date            | appliedDate           | 実装済み | 表示済み             |
| 面談日         | 面談日           | interview_date          | interviewDate         | 実装済み | 表示済み             |
| メモ           | メモ             | memo                    | memo                  | 実装済み | 入力・表示済み       |
| 次アクション   | 次アクション     | next_action             | nextAction            | 実装済み | 表示済み             |
| 書類選考       | 書類選考         | document_result         | documentResult        | 実装済み | 表示済み             |
| 1 次面接       | 1 次面接         | first_interview_result  | firstInterviewResult  | 実装済み | 表示済み             |
| 2 次面接       | 2 次面接         | second_interview_result | secondInterviewResult | 実装済み | 未表示               |
| 最終結果       | 最終結果         | final_result            | finalResult           | 実装済み | 未表示               |
| 落選段階       | 落選段階         | rejection_stage         | rejectionStage        | 実装済み | 未表示               |
| 求人 URL       | 求人 URL         | job_url                 | jobUrl                | 実装済み | 入力済み・一覧未表示 |
| 面談 URL       | 面談 URL         | interview_url           | interviewUrl          | 実装済み | 未入力・未表示       |

---

## 2. Excel 右側の集計項目

Excel 右側の件数表は、DB に直接保存する情報ではない。

企業ごとのデータをもとに、Dashboard または summary API で集計して表示する。

| Excel 集計        | JobHunt での扱い                 | 実装方針                          | 現状   |
| ----------------- | -------------------------------- | --------------------------------- | ------ |
| 状況別件数        | status から集計                  | summary API または React 側で計算 | 未実装 |
| 書類選考 合否辞退 | document_result から集計         | summary API または React 側で計算 | 未実装 |
| 1 次面接 合否辞退 | first_interview_result から集計  | summary API または React 側で計算 | 未実装 |
| 2 次面接 合否辞退 | second_interview_result から集計 | summary API または React 側で計算 | 未実装 |
| 最終結果 合否辞退 | final_result から集計            | summary API または React 側で計算 | 未実装 |

---

## 3. status の役割

status は「現在どの状態にいるか」を表す。

候補：

```txt
応募済み
書類選考待ち
書類通過
面談日程調整中
面談予定
面談後返答待ち
内定
辞退
落選
```

### 考え方

status は、一覧画面や Dashboard で現在地を把握するためのメイン項目。

例：

```txt
status = 応募済み
status = 面談予定
status = 落選
```

---

## 4. result の役割

result は「各選考段階の結果」を表す。

対象カラム：

```txt
document_result
first_interview_result
second_interview_result
final_result
```

候補：

```txt
未対応
通過
不通過
保留
辞退
```

### status との違い

status は、企業が現在どの状態にいるかを表す。

例：

```txt
status = 面談予定
```

result は、各選考段階ごとの結果を表す。

例：

```txt
document_result = 通過
first_interview_result = 未対応
second_interview_result = 未対応
final_result = 未対応
```

---

## 5. rejection_stage の役割

rejection_stage は「どの段階で落選・終了したか」を表す。

候補：

```txt
書類落ち
1次面接落ち
2次面接落ち
最終落ち
条件不一致
辞退
```

### status との関係

`status = 落選` の場合、どの段階で落ちたかを `rejection_stage` に記録する。

例：

```txt
status = 落選
rejection_stage = 書類落ち
```

`status = 辞退` の場合も、必要に応じて `rejection_stage = 辞退` として扱う。

---

## 6. 登録フォーム UX の見直し

### 課題

現在の登録フォームは、DB カラムをそのまま並べた形になりやすい。

しかし、実際の転職活動では、応募直後に分かる情報と、選考が進んでから分かる情報が異なる。

そのため、初回登録フォームにすべての項目を出すと、入力負荷が高く、実運用では使いづらい。

---

## 7. 応募直後に分かる情報

応募直後に分かる情報は以下。

```txt
企業名
媒体
求人URL
メモ
志望度
```

この 5 項目を初回登録フォームの中心にする。

---

## 8. 初期値で自動設定できる情報

初回登録時にユーザーへ入力させず、裏側で自動設定する項目。

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

### 理由

応募直後には、面談日・面談 URL・次アクション・選考結果はまだ分からないことが多い。

初回登録時にこれらを入力させると、入力負荷が高くなり、Excel より使いづらくなる。

---

## 9. 初回登録フォームの確定方針

初回登録フォームは、応募直後に分かる情報だけに絞る。

### 表示する項目

```txt
企業名
媒体
志望度
求人URL
メモ
```

### 表示しないが自動設定する項目

```txt
状況
応募日
面談日
面談URL
次アクション
書類選考
1次面接
2次面接
最終結果
落選段階
```

### 判断

初回登録フォームは速さ重視。

選考が進んだ後に必要な情報は、詳細モーダルまたは編集画面で更新する。

---

## 10. 志望度 priority の方針

志望度は、応募企業の優先度を表す。

DB カラム：

```txt
priority
```

候補値：

```txt
1.0
1.5
2.0
2.5
3.0
3.5
4.0
4.5
5.0
```

画面表示では、以下のような意味づけをする。

```txt
5.0 = 本命
4.0 = 高い
3.0 = 普通
2.0 = 低い
1.0 = とりあえず応募
```

### 判断

S / A / B+ のような文字評価より、数値評価の方が並び替え・集計・フィルターに使いやすい。

そのため、JobHunt では `priority` を 1.0〜5.0 の 0.5 刻みで管理する。

---

## 11. 一覧画面の UX 方針

一覧画面は、Excel より速く状況把握できることを目的にする。

### 一覧に表示する項目

```txt
企業名
媒体
志望度
状況
応募日
面談日
次アクション
書類選考
1次面接
メモ
操作
```

### 一覧で即編集したい項目

```txt
志望度
状況
```

志望度と状況は変化しやすいため、将来的に一覧上で直接変更できるようにする。

変更時は PUT API で即保存する。

---

## 12. 詳細モーダルの方針

求人 URL、面談 URL、面談日、選考結果などは、一覧にすべて出すと横に長くなりすぎる。

そのため、詳細モーダルで確認・編集できるようにする。

### 詳細モーダルで扱う項目

```txt
求人URL
面談URL
面談日
次アクション
書類選考
1次面接
2次面接
最終結果
落選段階
メモ
```

### 方針

JobHunt は、画面の役割を以下のように分ける。

```txt
初回登録 = 速さ重視
一覧画面 = 状況把握重視
詳細モーダル = 正確な更新重視
```

---

## 13. 現時点の判断

DB/API には Excel 転職ログの主要項目はほぼ揃っている。

現在の主な課題は、DB 設計ではなく React 側の UX 設計。

今後の優先順位は以下。

```txt
1. 初回登録フォームを最小項目にする
2. 志望度priorityを扱う
3. 一覧で志望度・状況を見やすくする
4. 詳細モーダルでURL・面談情報・選考結果を編集できるようにする
5. DashboardでExcel右側の件数集計を再現する
```

---

## 14. 次回 TODO

次回は、以下を安全に進める。

```txt
1. priorityがDB/API/Reactで保存・表示できるか確認する
2. 初回登録フォームから不要項目が消えているか確認する
3. 登録時に status = 応募済み、applied_date = 今日 が自動セットされるか確認する
4. 一覧の志望度表示を確認する
5. 余裕があれば、志望度のインライン更新設計に入る
```

---

## 15. 今日やらないこと

今日は以下を深追いしない。

```txt
認証機能
Googleカレンダー連携
複雑な通知
本格デプロイ
大規模なUI刷新
詳細モーダル実装
Dashboard集計実装
```

完成ではなく、方向性・必要項目・次に直す場所が明確になっている状態を目指す。
