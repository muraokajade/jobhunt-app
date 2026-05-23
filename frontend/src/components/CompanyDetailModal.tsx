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

type Option = {
  value: string;
  label: string;
};

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
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                document_result: event.target.value,
              })
            }
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
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                first_interview_result: event.target.value,
              })
            }
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
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                second_interview_result: event.target.value,
              })
            }
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
            onChange={(event) =>
              setDetailForm({
                ...detailForm,
                final_result: event.target.value,
              })
            }
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