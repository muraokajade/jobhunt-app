# Excel 転職ログと JobHunt 項目対応表

## 目的

Excel で管理していた転職ログの項目が、JobHunt の画面・DB・API にどう対応しているかを整理する。

今日は新機能を増やすのではなく、現状の設計と実装のズレを確認する。

---

## 1. 企業ごとの入力項目

| Excel 項目     | JobHunt 画面項目 | DB カラム               | API レスポンス        | 現状     |
| -------------- | ---------------- | ----------------------- | --------------------- | -------- |
| 応募した企業名 | 企業名           | name                    | name                  | 実装済み |
| 媒体           | 媒体             | media                   | media                 | 実装済み |
| 状況           | 状況             | status                  | status                | 実装済み |
| 応募日         | 応募日           | applied_date            | appliedDate           | 実装済み |
| 面談日         | 面談日           | interview_date          | interviewDate         | 実装済み |
| メモ           | メモ             | memo                    | memo                  | 実装済み |
| 次アクション   | 次アクション     | next_action             | nextAction            | 実装済み |
| 書類選考       | 書類選考         | document_result         | documentResult        | 実装済み |
| 1 次面接       | 1 次面接         | first_interview_result  | firstInterviewResult  | 実装済み |
| 2 次面接       | 2 次面接         | second_interview_result | secondInterviewResult | 実装済み |
| 最終結果       | 最終結果         | final_result            | finalResult           | 実装済み |
| 落選段階       | 落選段階         | rejection_stage         | rejectionStage        | 実装済み |

---

## 2. Excel 右側の集計項目

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
