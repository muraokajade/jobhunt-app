Laravel × React の実務寄り転職活動管理アプリ

- 認証あり
- 企業登録
- 一覧表示
- 検索・絞り込み
- 詳細モーダル編集
- priority / status インライン更新
- Dashboard 集計
- Google カレンダー登録
- 通知機能の土台
- README
- 設計書
- API 仕様
- テスト仕様

## 100h

1. 現状整理・React 分割：10h
2. Laravel API 整理：12h
3. 認証：12h
4. 詳細モーダル UX 完成：10h
5. Dashboard 集計：12h
6. Google カレンダー連携：14h
7. 通知機能：10h
8. テスト・バグ修正：10h
9. README・設計書・スクショ：10h

### Phase 1

- CompanyDetailModal 分割
- CompanyTable 分割
- CompanyRegisterForm 分割
- SearchForm 分割
- SummaryCards 分割
- types 分離
- constants 分離
- utils 分離

### App.tsx

- App.tsx = state 管理・API 通信・画面配置
- components = 表示・入力・操作
- utils = requestBody 変換など
- types = Company / CompanyForm
- constants = statusOptions / priorityOptions
