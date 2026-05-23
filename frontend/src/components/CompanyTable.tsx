type Company = {
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

type PriorityOption = {
    value: string;
    label: string;
}

type CompanyTableProps = {
    companies: Company[];
    loading: boolean;
    priorityOptions: PriorityOption[];
    statusOptions: string[];
    onPriorityChange: (company: Company, priority: string) => void;
    onStatusChange: (company: Company, status: string) => void;
    onOpenDetail: (company: Company) => void;
    onDelete: (id: number) => void;
};

function CompanyTable({
companies,
  loading,
  priorityOptions,
  statusOptions,
  onPriorityChange,
  onStatusChange,
  onOpenDetail,
  onDelete,
}: CompanyTableProps) {

    return(
        <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">企業名</th>
                <th className="px-4 py-3">媒体</th>
                <th className="px-4 py-3">志望度</th>
                <th className="px-4 py-3">状況</th>
                <th className="px-4 py-3">応募日</th>
                <th className="px-4 py-3">面談日</th>
                <th className="px-4 py-3">次アクション</th>
                <th className="px-4 py-3">書類</th>
                <th className="px-4 py-3">1次</th>
                <th className="px-4 py-3">メモ</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center" colSpan={11}>
                    読み込み中...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center" colSpan={11}>
                    企業データがありません。
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 font-semibold">{company.name}</td>
                    <td className="px-4 py-3">{company.media ?? "-"}</td>

                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-300 px-2 py-1"
                        value={company.priority ?? "3.0"}
                        onChange={(event) =>
                          onPriorityChange(company, event.target.value)
                        }
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-300 px-2 py-1"
                        value={company.status}
                        onChange={(event) =>
                          onStatusChange(company, event.target.value)
                        }
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">{company.appliedDate ?? "-"}</td>
                    <td className="px-4 py-3">{company.interviewDate ?? "-"}</td>
                    <td className="px-4 py-3">{company.nextAction ?? "-"}</td>
                    <td className="px-4 py-3">{company.documentResult ?? "-"}</td>
                    <td className="px-4 py-3">
                      {company.firstInterviewResult ?? "-"}
                    </td>
                    <td className="px-4 py-3">{company.memo ?? "-"}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="rounded-lg bg-slate-700 px-3 py-1 text-sm font-semibold text-white"
                          onClick={() => onOpenDetail(company)}
                        >
                          詳細
                        </button>

                        <button
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white"
                          onClick={() => onDelete(company.id)}
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
    )
};

export default CompanyTable;