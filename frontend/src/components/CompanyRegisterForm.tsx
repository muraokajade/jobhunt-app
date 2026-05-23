
// 企業登録フォームで扱う入力値の型。
// Laravel APIへ送る項目名に合わせて、フォーム側ではsnake_caseを使っている。
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

// selectで表示する志望度の選択肢の型。
// valueはAPIやstateで扱う値、labelは画面に表示する文字列。
type PriorityOption = {
  value: string;
  label: string;
};

// CompanyRegisterFormコンポーネントが親コンポーネントから受け取るpropsの型。
// App.tsxで保持しているform状態・更新関数・選択肢・登録処理を受け取る。
type CompanyRegisterFormProps = {
  form: CompanyForm;
  setForm: React.Dispatch<React.SetStateAction<CompanyForm>>; // Dispatchわかんねえ
  priorityOptions: PriorityOption[];
  onCreate: () => void;
};

// 企業登録フォームを表示するコンポーネント。
// このコンポーネントはAPI通信を直接行わず、入力変更と登録ボタン押下を親へ伝える役割に限定する。
function CompanyRegisterForm({
  form,
  setForm,
  priorityOptions,
  onCreate,
}: CompanyRegisterFormProps) {
    return(
        <section className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">企業登録</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="企業名"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />

            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="媒体"
              value={form.media}
              onChange={(event) => setForm({ ...form, media: event.target.value })}
            />

            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: event.target.value })
              }
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-3"
              placeholder="求人URL"
              value={form.job_url}
              onChange={(event) =>
                setForm({ ...form, job_url: event.target.value })
              }
            />

            <textarea
              className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-3"
              placeholder="メモ"
              value={form.memo}
              onChange={(event) => setForm({ ...form, memo: event.target.value })}
            />
          </div>

          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
            onClick={onCreate}
          >
            登録する
          </button>
        </section>
    );
}


export default CompanyRegisterForm;