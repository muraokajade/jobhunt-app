// 今日の作戦ボードで表示するタスク情報の型。
// 現時点ではmockデータとして扱い、将来的にはAPIやcompaniesデータから生成する。
type StrategyTask = {
  id: number;
  label: string;
  description: string;
  status: "未着手" | "進行中" | "完了";
};

// 今日の作戦ボードで表示するmockタスク一覧。
// 明日以降、面談予定・確認待ち・次アクションから自動生成する候補。
const strategyTasks: StrategyTask[] = [
  {
    id: 1,
    label: "面談予定を確認",
    description: "面談日が近い企業を確認し、URLと準備メモを見直す。",
    status: "進行中",
  },
  {
    id: 2,
    label: "返答待ちを確認",
    description: "書類選考待ち・面談後返答待ちの企業を確認する。",
    status: "未着手",
  },
  {
    id: 3,
    label: "優先企業を整理",
    description: "志望度4.0以上の企業に次アクションを設定する。",
    status: "未着手",
  },
];

// 転職活動の今日の作戦を表示するコンポーネント。
// 完全なmock表示として、ユーザーが明日触りたくなる行動支援エリアを作る。
function TodayStrategyPanel() {
  return (
    <section className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              今日の作戦ボード
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              内定までの次アクションを整理する
            </h2>
          </div>

          <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            Mock
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
            {strategyTasks.map((task) => (
            <div
                key={task.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
                <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-slate-900">{task.label}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                    {task.status}
                </span>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                {task.description}
                </p>
            </div>
            ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
        <p className="text-sm font-semibold text-slate-300">今週の進捗</p>

        <div className="mt-4">
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold">38%</p>
            <p className="text-sm text-slate-300">仮スコア</p>
          </div>

          <div className="mt-4 h-3 rounded-full bg-white/10">
            <div className="h-3 w-[38%] rounded-full bg-white" />
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <p>・面談予定の確認が必要です。</p>
          <p>・返答待ち企業の放置を防ぎましょう。</p>
          <p>・高優先度企業に次アクションを設定しましょう。</p>
        </div>
      </div>
    </section>
  );
}

export default TodayStrategyPanel;