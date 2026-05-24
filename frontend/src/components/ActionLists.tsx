import type { Company, DashboardActionLists } from "../types/company";

// ActionListsコンポーネントが親コンポーネントから受け取るpropsの型。
// App.tsxで取得した企業一覧を受け取り、次に確認すべき企業を分類して表示する。
type ActionListsProps = {
  companies: Company[];
  dashboardActionLists?: DashboardActionLists;
  onOpenDetail: (company: Company) => void;
};

// 企業一覧から面談予定の企業を抽出する関数。
// statusが面談予定、またはinterviewDateが登録されている企業を対象にする。

function getInterviewCompanies(companies: Company[]): Company[] {
    return companies.filter((company) => {
        return company.status === "面談予定" || company.status !== null
    });
}

// 一覧表示から除外したい終了状態の選考ステータス。
// 落選・辞退は次アクション対象から外す。
const closedStatuses = ["落選", "辞退"];

// 企業が終了状態かどうかを判定する関数。
// 落選・辞退の企業をActionListsの表示対象から外すために使う。
function isClosedCompany(company: Company): boolean {
  return closedStatuses.includes(company.status);
}

// 企業一覧から返答待ちの企業を抽出する関数。
// 書類選考待ち・面談後返答待ちなど、次に確認が必要な企業を対象にする。

function getWaitingCompanies(companies: Company[]): Company[] {
    return companies.filter((company) => 
        company.status === "応募済み" ||
        company.status === "書類選考待ち" ||
        company.status === "面談日程調整中" ||
        company.status === "面談後返答待ち"
    )
    .filter((company) => !isClosedCompany(company))
    .slice(0, 3);
}

// 企業一覧から高優先度の企業を抽出する関数。
// priorityが4.0以上の企業を、優先的に確認すべき企業として扱う。
function getHighPriorityCompanies(companies: Company[]): Company[] {
  return companies.filter((company) => Number(company.priority) >= 4);
}

// 転職活動で次に確認すべき企業リストを表示するコンポーネント。
// 面談予定・返答待ち・高優先度を表示し、ユーザーが次に見るべき対象を迷わないようにする。

function ActionLists({companies,dashboardActionLists, onOpenDetail}: ActionListsProps) {
    // const interviewCompanies = getInterviewCompanies(companies);
    // const waitingCompanies = getWaitingCompanies(companies);
    // const highPriorityCompanies = getHighPriorityCompanies(companies);

    const interviewCompanies =
      dashboardActionLists?.interviews ?? getInterviewCompanies(companies);

    const waitingCompanies =
      dashboardActionLists?.waiting ?? getWaitingCompanies(companies);

    const highPriorityCompanies =
      dashboardActionLists?.highPriority ?? getHighPriorityCompanies(companies);

      return (
    <section className="mb-6 grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">面談予定</h2>

        {interviewCompanies.length === 0 ? (
          <p className="text-sm text-slate-500">面談予定はありません。</p>
        ) : (
          <ul className="space-y-2">
            {interviewCompanies.map((company) => (
              <li key={company.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-slate-500">
                  面談日：{company.interviewDate ?? "未設定"}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenDetail(company)}
                  className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  詳細
                </button>
                <p className="text-sm text-slate-500">
                  次アクション：{company.nextAction ?? "未設定"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">確認待ち</h2>

        {waitingCompanies.length === 0 ? (
          <p className="text-sm text-slate-500">確認待ちはありません。</p>
        ) : (
          <ul className="space-y-2">
            {waitingCompanies.map((company) => (
              <li key={company.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-slate-500">状況：{company.status}</p>
                                <button
                  type="button"
                  onClick={() => onOpenDetail(company)}
                  className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  詳細
                </button>
                <p className="text-sm text-slate-500">
                  次アクション：{company.nextAction ?? "未設定"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">高優先度</h2>

        {highPriorityCompanies.length === 0 ? (
          <p className="text-sm text-slate-500">高優先度の企業はありません。</p>
        ) : (
          <ul className="space-y-2">
            {highPriorityCompanies.map((company) => (
              <li key={company.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="font-semibold">{company.name}</p>
                                <button
                  type="button"
                  onClick={() => onOpenDetail(company)}
                  className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  詳細
                </button>
                <p className="text-sm text-slate-500">
                  志望度：{company.priority ?? "未設定"}
                </p>
                <p className="text-sm text-slate-500">状況：{company.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ActionLists;