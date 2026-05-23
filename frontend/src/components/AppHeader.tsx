// AppHeaderコンポーネントで表示する仮ユーザー情報の型。
// 将来的に認証機能を入れた場合、ログインユーザー情報に置き換える。
type AppUser = {
  name: string;
};

// アプリ全体の上部ヘッダーを表示するコンポーネント。
// 現時点では見た目用のヘッダーとして、ロゴ・ナビゲーション・ユーザー名・ログアウトを表示する。
function AppHeader() {
  // 認証実装前の仮ユーザー情報。
  // 将来的にはLaravel SanctumやFirebase Authなどのログインユーザー情報に置き換える。
  const user: AppUser = {
    name: "村岡 兼通",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              転職活動CRM
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              JobHunt
            </h1>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              応募管理
            </button>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Dashboard
            </button>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              検討リスト
            </button>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              設定
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user.name} さん
            </p>
            <p className="text-xs text-slate-500">ログイン中</p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;