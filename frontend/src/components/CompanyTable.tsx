import { useState } from "react";
import type { Company, Option } from "../types/company";

// CompanyTableコンポーネントが親コンポーネントから受け取るpropsの型。
// 企業一覧、読み込み状態、選択肢、更新・詳細表示・削除・お気に入り切り替え処理を受け取る。
type CompanyTableProps = {
  companies: Company[];
  loading: boolean;
  priorityOptions: Option[];
  statusOptions: string[];
  onPriorityChange: (company: Company, priority: string) => void;
  onStatusChange: (company: Company, status: string) => void;
  onOpenDetail: (company: Company) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (company: Company) => void;
};

// 企業一覧を表示するコンポーネント。
// 初期表示は5件までに抑え、必要に応じて「もっと見る」で全件表示できる。
function CompanyTable({
  companies,
  loading,
  priorityOptions,
  statusOptions,
  onPriorityChange,
  onStatusChange,
  onOpenDetail,
  onDelete,
  onToggleFavorite,
}: CompanyTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCompanies = isExpanded ? companies : companies.slice(0, 5);
  const shouldShowMoreButton = companies.length > 5;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">企業一覧</h2>
          <p className="mt-1 text-sm text-slate-500">
            登録済み企業の選考状況・志望度・次アクションを確認できます。
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {companies.length}件
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="w-[210px] px-4 py-3 font-semibold">企業名</th>
              <th className="w-[110px] px-3 py-3 font-semibold">媒体</th>
              <th className="w-[120px] px-3 py-3 font-semibold">志望度</th>
              <th className="w-[140px] px-3 py-3 font-semibold">状況</th>
              <th className="w-[120px] px-3 py-3 font-semibold">応募日</th>
              <th className="w-[145px] px-3 py-3 font-semibold">面談日</th>
              <th className="w-[130px] px-3 py-3 font-semibold">次アクション</th>
              <th className="w-[90px] px-3 py-3 font-semibold">書類</th>
              <th className="w-[90px] px-3 py-3 font-semibold">1次</th>
              <th className="w-[90px] px-3 py-3 font-semibold">メモ</th>
              <th className="w-[100px] px-3 py-3 font-semibold">操作</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={11}>
                  読み込み中...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={11}>
                  企業データがありません。
                </td>
              </tr>
            ) : (
              visibleCompanies.map((company) => {
                const isRejected = company.status === "落選";

                const rowClass = isRejected
                  ? "bg-red-50 text-red-800/70 hover:bg-red-100"
                  : company.isFavorite
                    ? "bg-amber-50 text-slate-800 hover:bg-amber-100"
                    : "bg-white text-slate-700 hover:bg-slate-50";

                return (
                  <tr
                    key={company.id}
                    className={["transition", rowClass].join(" ")}
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex min-w-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(company)}
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                            company.isFavorite
                              ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                              : "border-slate-300 bg-white text-slate-400 hover:bg-slate-50",
                          ].join(" ")}
                          aria-label="お気に入り切り替え"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill={company.isFavorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                            />
                          </svg>
                        </button>

                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className={[
                                "truncate font-bold",
                                isRejected
                                  ? "text-red-900 line-through"
                                  : company.isFavorite
                                    ? "text-amber-900"
                                    : "text-slate-900",
                              ].join(" ")}
                              title={company.name}
                            >
                              {company.name}
                            </span>

                            {company.isFavorite && !isRejected && (
                              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                注目
                              </span>
                            )}

                            {isRejected && (
                              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                                落選
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="truncate px-3 py-3 align-middle" title={company.media ?? "-"}>
                      {company.media ?? "-"}
                    </td>

                    <td className="px-3 py-3 align-middle">
                      <select
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-slate-500"
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

                    <td className="px-3 py-3 align-middle">
                      <select
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-slate-500"
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

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      {company.appliedDate ?? "-"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      {company.interviewDate ?? "-"}
                    </td>

                    <td className="truncate px-3 py-3 align-middle" title={company.nextAction ?? "-"}>
                      {company.nextAction ?? "-"}
                    </td>

                    <td className="truncate px-3 py-3 align-middle" title={company.documentResult ?? "-"}>
                      {company.documentResult ?? "-"}
                    </td>

                    <td className="truncate px-3 py-3 align-middle" title={company.firstInterviewResult ?? "-"}>
                      {company.firstInterviewResult ?? "-"}
                    </td>

                    <td className="truncate px-3 py-3 align-middle" title={company.memo ?? "-"}>
                      {company.memo ?? "-"}
                    </td>

                    <td className="px-3 py-3 align-middle">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                          onClick={() => onOpenDetail(company)}
                        >
                          詳細
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          onClick={() => onDelete(company.id)}
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && shouldShowMoreButton && (
        <div className="border-t border-slate-200 px-5 py-4 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {isExpanded
              ? "閉じる ↑"
              : `もっと見る ↓（残り${companies.length - 5}件）`}
          </button>
        </div>
      )}
    </section>
  );
}

export default CompanyTable;