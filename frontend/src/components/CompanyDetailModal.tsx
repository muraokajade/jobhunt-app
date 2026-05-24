import type { Company, CompanyForm, Option } from "../types/company";

// CompanyDetailModalコンポーネントが親コンポーネントから受け取るpropsの型。
// 詳細表示対象の企業、編集フォーム、保存処理、各種選択肢を受け取る。
type CompanyDetailModalProps = {
  isOpen: boolean;
  selectedCompany: Company | null;
  detailForm: CompanyForm;
  setDetailForm: React.Dispatch<React.SetStateAction<CompanyForm>>;
  onClose: () => void;
  onSave: () => void;
  priorityOptions: Option[];
  statusOptions: string[];
  resultOptions: string[];
  rejectionStageOptions: Option[];
};

// 会社詳細モーダルを表示するコンポーネント。
// 詳細情報の編集UIだけを担当し、API保存処理は親コンポーネントのonSaveに任せる。
function CompanyDetailModal({
  isOpen,
  selectedCompany,
  detailForm,
  setDetailForm,
  onClose,
  onSave,
  priorityOptions,
  statusOptions,
  resultOptions,
  rejectionStageOptions,
}: CompanyDetailModalProps) {
  if (!isOpen || !selectedCompany) {
    return null;
  }

  // フォーム項目を安全に更新する共通関数。
  // prevを使うことで、古いdetailFormを参照して上書きミスが起きることを防ぐ。
  function updateDetailForm(values: Partial<CompanyForm>) {
    setDetailForm((prev) => ({
      ...prev,
      ...values,
    }));
  }

  // 書類選考の結果変更時に、状況・落選段階を自動補助する。
  function handleDocumentResultChange(result: string) {
    if (result === "不通過") {
      updateDetailForm({
        document_result: result,
        status: "落選",
        rejection_stage: "書類落ち",
      });
      return;
    }

    if (result === "通過") {
      updateDetailForm({
        document_result: result,
        status: "書類通過",
        rejection_stage: "",
      });
      return;
    }

    if (result === "辞退") {
      updateDetailForm({
        document_result: result,
        status: "辞退",
        rejection_stage: "辞退",
      });
      return;
    }

    updateDetailForm({
      document_result: result,
    });
  }

  // 1次面接の結果変更時に、状況・落選段階を自動補助する。
  function handleFirstInterviewResultChange(result: string) {
    if (result === "不通過") {
      updateDetailForm({
        first_interview_result: result,
        status: "落選",
        rejection_stage: "1次面接落ち",
      });
      return;
    }

    if (result === "通過") {
      updateDetailForm({
        first_interview_result: result,
        status: "面談後返答待ち",
        rejection_stage: "",
      });
      return;
    }

    if (result === "辞退") {
      updateDetailForm({
        first_interview_result: result,
        status: "辞退",
        rejection_stage: "辞退",
      });
      return;
    }

    updateDetailForm({
      first_interview_result: result,
    });
  }

  // 2次面接の結果変更時に、状況・落選段階を自動補助する。
  function handleSecondInterviewResultChange(result: string) {
    if (result === "不通過") {
      updateDetailForm({
        second_interview_result: result,
        status: "落選",
        rejection_stage: "2次面接落ち",
      });
      return;
    }

    if (result === "通過") {
      updateDetailForm({
        second_interview_result: result,
        status: "面談後返答待ち",
        rejection_stage: "",
      });
      return;
    }

    if (result === "辞退") {
      updateDetailForm({
        second_interview_result: result,
        status: "辞退",
        rejection_stage: "辞退",
      });
      return;
    }

    updateDetailForm({
      second_interview_result: result,
    });
  }

  // 最終結果の変更時に、状況・落選段階を自動補助する。
  function handleFinalResultChange(result: string) {
    if (result === "不通過") {
      updateDetailForm({
        final_result: result,
        status: "落選",
        rejection_stage: "最終落ち",
      });
      return;
    }

    if (result === "通過") {
      updateDetailForm({
        final_result: result,
        status: "内定",
        rejection_stage: "",
      });
      return;
    }

    if (result === "辞退") {
      updateDetailForm({
        final_result: result,
        status: "辞退",
        rejection_stage: "辞退",
      });
      return;
    }

    updateDetailForm({
      final_result: result,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">会社詳細</p>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCompany.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            閉じる
          </button>
        </div>

        <div className="space-y-6 p-6 text-sm">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-base font-bold text-slate-900">
              基本情報
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">企業名</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCompany.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">媒体</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCompany.media ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">応募日</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {detailForm.applied_date || selectedCompany.appliedDate || "-"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-base font-bold text-slate-900">
              選考情報
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  志望度
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.priority}
                  onChange={(event) =>
                    updateDetailForm({
                      priority: event.target.value,
                    })
                  }
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  状況
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.status}
                  onChange={(event) => {
                    const nextStatus = event.target.value;

                    if (nextStatus === "書類通過") {
                      updateDetailForm({
                        status: nextStatus,
                        document_result: "通過",
                        rejection_stage: "",
                      });
                      return;
                    }

                    if (nextStatus === "内定") {
                      updateDetailForm({
                        status: nextStatus,
                        final_result: "通過",
                        rejection_stage: "",
                      });
                      return;
                    }

                    if (nextStatus === "落選") {
                      updateDetailForm({
                        status: nextStatus,
                      });
                      return;
                    }

                    if (nextStatus === "辞退") {
                      updateDetailForm({
                        status: nextStatus,
                        rejection_stage: "辞退",
                      });
                      return;
                    }

                    updateDetailForm({
                      status: nextStatus,
                    });
                  }}
                >
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  面談日
                </label>
                <input
                  type="datetime-local"
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.interview_date}
                  onChange={(event) =>
                    updateDetailForm({
                      interview_date: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  次アクション
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.next_action}
                  onChange={(event) =>
                    updateDetailForm({
                      next_action: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-base font-bold text-slate-900">
              URL情報
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  求人URL
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.job_url}
                  onChange={(event) =>
                    updateDetailForm({
                      job_url: event.target.value,
                    })
                  }
                />

                {detailForm.job_url ? (
                  <a
                    href={detailForm.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-blue-600 underline"
                  >
                    求人ページを開く
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">未設定</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  面談URL
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.interview_url}
                  onChange={(event) =>
                    updateDetailForm({
                      interview_url: event.target.value,
                    })
                  }
                />

                {detailForm.interview_url ? (
                  <a
                    href={detailForm.interview_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-blue-600 underline"
                  >
                    面談URLを開く
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">未設定</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-base font-bold text-slate-900">
              選考結果
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  書類選考
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.document_result}
                  onChange={(event) =>
                    handleDocumentResultChange(event.target.value)
                  }
                >
                  {resultOptions.map((result) => (
                    <option key={result} value={result}>
                      {result}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  1次面接
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.first_interview_result}
                  onChange={(event) =>
                    handleFirstInterviewResultChange(event.target.value)
                  }
                >
                  {resultOptions.map((result) => (
                    <option key={result} value={result}>
                      {result}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  2次面接
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.second_interview_result}
                  onChange={(event) =>
                    handleSecondInterviewResultChange(event.target.value)
                  }
                >
                  {resultOptions.map((result) => (
                    <option key={result} value={result}>
                      {result}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  最終結果
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.final_result}
                  onChange={(event) =>
                    handleFinalResultChange(event.target.value)
                  }
                >
                  {resultOptions.map((result) => (
                    <option key={result} value={result}>
                      {result}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  落選段階
                </label>
                <select
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500"
                  value={detailForm.rejection_stage}
                  onChange={(event) =>
                    updateDetailForm({
                      rejection_stage: event.target.value,
                    })
                  }
                >
                  {rejectionStageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-base font-bold text-slate-900">メモ</h3>

            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              value={detailForm.memo}
              onChange={(event) =>
                updateDetailForm({
                  memo: event.target.value,
                })
              }
            />
          </section>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              onClick={onClose}
            >
              キャンセル
            </button>

            <button
              type="button"
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={onSave}
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;