// APIから取得した企業データを画面で扱うための型。
// LaravelのCompanyResourceから返ってくるcamelCaseの項目に合わせている。
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

// 詳細モーダル内の編集フォームで扱う入力値の型。
// Laravel APIへ送るリクエスト形式に合わせてsnake_caseで定義している。
type CompanyForm = {
  name: string;
  media: string;
  priority: string;
  status: string;
  applied_date: string;
  interview_date: string;
  job_url: string;
  interview_url: string;
  memo: string;
  next_action: string;
  document_result: string;
  first_interview_result: string;
  second_interview_result: string;
  final_result: string;
  rejection_stage: string;
};

// selectの選択肢で使う共通型。
// valueはstateやAPIに送る値、labelは画面表示用の文字列。
type Option = {
  value: string;
  label: string;
};

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">会社詳細</h2>

          <button className="rounded-lg border px-3 py-1" onClick={onClose}>
            閉じる
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p>企業名：{selectedCompany.name}</p>
          <p>媒体：{selectedCompany.media ?? "-"}</p>
          <p>応募日：{selectedCompany.appliedDate ?? "-"}</p>

          <label className="block font-semibold">志望度</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.priority}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
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

          <label className="block font-semibold">状況</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.status}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                status: event.target.value,
              })
            }
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          <label className="block font-semibold">面談日</label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.interview_date}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                interview_date: event.target.value,
              })
            }
          />

          <label className="block font-semibold">次アクション</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.next_action}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                next_action: event.target.value,
              })
            }
          />

          <label className="block font-semibold">求人URL</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.job_url}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                job_url: event.target.value,
              })
            }
          />

          {detailForm.job_url ? (
            <a
              href={detailForm.job_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-blue-600 underline"
            >
              求人ページを開く
            </a>
          ) : (
            <p>-</p>
          )}

          <label className="block font-semibold">面談URL</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.interview_url}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                interview_url: event.target.value,
              })
            }
          />

          {detailForm.interview_url ? (
            <a
              href={detailForm.interview_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-blue-600 underline"
            >
              面談URLを開く
            </a>
          ) : (
            <p>-</p>
          )}

          <label className="block font-semibold">書類選考</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.document_result}
            onChange={(event) => {
              // 書類選考selectで選ばれた値を一時的に保持する。
              // 不通過の場合のみ、状況と落選段階を補助的に自動反映する。
              const documentResult = event.target.value;

              if (documentResult === "不通過") {
                setDetailForm({
                  ...detailForm,
                  document_result: documentResult,
                  status: "落選",
                  rejection_stage: "書類落ち",
                });

                return;
              }

              setDetailForm({
                ...detailForm,
                document_result: documentResult,
              });
            }}
          >
            {resultOptions.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>

          <label className="block font-semibold">1次面接</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.first_interview_result}
            onChange={(event) => {
              // 1次面接selectで選ばれた値を一時的に保持する。
              // 不通過の場合のみ、状況と落選段階を補助的に自動反映する。
              const firstInterviewResult = event.target.value;

              if (firstInterviewResult === "不通過") {
                setDetailForm({
                  ...detailForm,
                  first_interview_result: firstInterviewResult,
                  status: "落選",
                  rejection_stage: "1次面接落ち",
                });

                return;
              }

              setDetailForm({
                ...detailForm,
                first_interview_result: firstInterviewResult,
              });
            }}
          >
            {resultOptions.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>

          <label className="block font-semibold">2次面接</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.second_interview_result}
            onChange={(event) => {
              // 2次面接selectで選ばれた値を一時的に保持する。
              // 不通過の場合のみ、状況と落選段階を補助的に自動反映する。
              const secondInterviewResult = event.target.value;

              if (secondInterviewResult === "不通過") {
                setDetailForm({
                  ...detailForm,
                  second_interview_result: secondInterviewResult,
                  status: "落選",
                  rejection_stage: "2次面接落ち",
                });

                return;
              }

              setDetailForm({
                ...detailForm,
                second_interview_result: secondInterviewResult,
              });
            }}
          >
            {resultOptions.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>

          <label className="block font-semibold">最終結果</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.final_result}
            onChange={(event) => {
              // 最終結果selectで選ばれた値を一時的に保持する。
              // 通過なら内定、不通過なら最終落ちとして補助的に自動反映する。
              const finalResult = event.target.value;

              if (finalResult === "不通過") {
                setDetailForm({
                  ...detailForm,
                  final_result: finalResult,
                  status: "落選",
                  rejection_stage: "最終落ち",
                });

                return;
              }

              if (finalResult === "通過") {
                setDetailForm({
                  ...detailForm,
                  final_result: finalResult,
                  status: "内定",
                  rejection_stage: "",
                });

                return;
              }

              setDetailForm({
                ...detailForm,
                final_result: finalResult,
              });
            }}
          >
            {resultOptions.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>

          <label className="block font-semibold">落選段階</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.rejection_stage}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
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

          <label className="block font-semibold">メモ</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            value={detailForm.memo}
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                memo: event.target.value,
              })
            }
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="rounded-lg border px-4 py-2 font-semibold"
              onClick={onClose}
            >
              キャンセル
            </button>

            <button
              type="button"
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
              onClick={onSave}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;