import { useEffect, useState } from "react";

type Company = {
  id: number;
  name: string;
  media: string | null;
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

type CompanyResponse = {
  data: Company[];
};

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [media, setMedia] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // 編集中の企業IDを保持する
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  // null のときは新規登録モード
  // number のときは編集モード

  const [form, setForm] = useState({
    name: "",
    media: "",
    status: "応募済み",
    applied_date: "",
    interview_date: "",
    job_url: "",
    interview_url: "",
    memo: "",
    next_action: "",
    document_result: "未対応",
    first_interview_result: "未対応",
    second_interview_result: "未対応",
    final_result: "未対応",
    rejection_stage: "",
  });


  async function fetchCompanies() {
    setLoading(true);

    const params = new URLSearchParams();

    if (keyword.trim() !== "") {
      params.append("keyword", keyword);
    }

    if (status !== "") {
      params.append("status", status);
    }

    if (media.trim() !== "") {
      params.append("media", media);
    }

    const queryString = params.toString();
    const url = queryString
      ? `http://127.0.0.1:8000/api/companies?${queryString}`
      : "http://127.0.0.1:8000/api/companies";

    const response = await fetch(url,{
      headers: {
        Accept: "application/json",
      }
    });
    const json: CompanyResponse = await response.json();

    setCompanies(json.data);
    setLoading(false);
  }

  async function createCompany() {

    console.log("登録ボタン押された", form);
    if(form.name.trim() === "") {
      alert("企業名は必須です。");
      return;
    }
    const response = await fetch("http://127.0.0.1:8000/api/companies",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
          ...form,
          applied_date: form.applied_date || null,
          interview_date: form.interview_date || null,
          job_url: form.job_url || null,
          interview_url: form.interview_url || null,
          memo: form.memo || null,
          next_action: form.next_action || null,
          rejection_stage: form.rejection_stage || null,
      }),

    });
    if(!response.ok) {
      setToastMessage("登録に失敗しました。入力内容を確認してください。");
      setTimeout(() => {
        setToastMessage("");
      }, 2500);
      return;
    }

    setForm({
      name: "",
      media: "",
      status: "応募済み",
      applied_date: "",
      interview_date: "",
      job_url: "",
      interview_url: "",
      memo: "",
      next_action: "",
      document_result: "未対応",
      first_interview_result: "未対応",
      second_interview_result: "未対応",
      final_result: "未対応",
      rejection_stage: "",
    });

    setToastMessage("企業を登録しました。");

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
    await fetchCompanies();
  }

  async function deleteCompany(id: number) {
    if(!confirm("この企業を削除しますか？")) {
      return;
    }
    const response = await fetch(`http://127.0.0.1:8000/api/companies/${id}`,{
      method: "DELETE",
      headers: {
        Accept: "application/json",
      }
    });

    if (!response.ok) {

      setToastMessage("削除に失敗しました。");

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
      return;
    }

      setToastMessage("企業を削除しました。");

      setTimeout(() => {
        setToastMessage("");
      }, 2500);

      await fetchCompanies();

  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      )}
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-sm font-semibold text-slate-500">
            転職活動CRM
          </p>
          <h1 className="text-3xl font-bold">JobHunt</h1>
          <p className="mt-2 text-slate-600">
            応募企業・選考状況・面談予定・次アクションを一元管理します。
          </p>
        </header>

        <section className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="企業名・メモ検索"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">すべての状況</option>
            <option value="応募済み">応募済み</option>
            <option value="書類選考待ち">書類選考待ち</option>
            <option value="書類通過">書類通過</option>
            <option value="面談日程調整中">面談日程調整中</option>
            <option value="面談予定">面談予定</option>
            <option value="面談後返答待ち">面談後返答待ち</option>
            <option value="内定">内定</option>
            <option value="辞退">辞退</option>
            <option value="落選">落選</option>
          </select>

          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="媒体 type / Green など"
            value={media}
            onChange={(event) => setMedia(event.target.value)}
          />

          <button
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
            onClick={fetchCompanies}
          >
            検索
          </button>
        </section>
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
      value={form.status}
      onChange={(event) => setForm({ ...form, status: event.target.value })}
    >
      <option value="応募済み">応募済み</option>
      <option value="書類選考待ち">書類選考待ち</option>
      <option value="書類通過">書類通過</option>
      <option value="面談日程調整中">面談日程調整中</option>
      <option value="面談予定">面談予定</option>
      <option value="面談後返答待ち">面談後返答待ち</option>
      <option value="内定">内定</option>
      <option value="辞退">辞退</option>
      <option value="落選">落選</option>
    </select>

    <input
      className="rounded-lg border border-slate-300 px-3 py-2"
      type="date"
      value={form.applied_date}
      onChange={(event) => setForm({ ...form, applied_date: event.target.value })}
    />

    <input
      className="rounded-lg border border-slate-300 px-3 py-2"
      type="datetime-local"
      value={form.interview_date}
      onChange={(event) => setForm({ ...form, interview_date: event.target.value })}
    />

    <input
      className="rounded-lg border border-slate-300 px-3 py-2"
      placeholder="次アクション"
      value={form.next_action}
      onChange={(event) => setForm({ ...form, next_action: event.target.value })}
    />

    <input
      className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-3"
      placeholder="求人URL"
      value={form.job_url}
      onChange={(event) => setForm({ ...form, job_url: event.target.value })}
    />

    <input
      className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-3"
      placeholder="面談URL"
      value={form.interview_url}
      onChange={(event) => setForm({ ...form, interview_url: event.target.value })}
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
    onClick={createCompany}
  >
    登録する
  </button>
        </section>


        <section className="mb-4 grid gap-3 md:grid-cols-5">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">応募総数</p>
            <p className="text-2xl font-bold">{companies.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">面談予定</p>
            <p className="text-2xl font-bold">
              {companies.filter((company) => company.status === "面談予定").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">返答待ち</p>
            <p className="text-2xl font-bold">
              {companies.filter((company) => company.status === "面談後返答待ち").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">内定</p>
            <p className="text-2xl font-bold">
              {companies.filter((company) => company.status === "内定").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">落選</p>
            <p className="text-2xl font-bold">
              {companies.filter((company) => company.status === "落選").length}
            </p>
          </div>
        </section>

        <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">企業名</th>
                <th className="px-4 py-3">媒体</th>
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
                  <td className="px-4 py-6 text-center" colSpan={10}>
                    読み込み中...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center" colSpan={10}>
                    企業データがありません。
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 font-semibold">{company.name}</td>
                    <td className="px-4 py-3">{company.media ?? "-"}</td>
                    <td className="px-4 py-3">{company.status}</td>
                    <td className="px-4 py-3">{company.appliedDate ?? "-"}</td>
                    <td className="px-4 py-3">{company.interviewDate ?? "-"}</td>
                    <td className="px-4 py-3">{company.nextAction ?? "-"}</td>
                    <td className="px-4 py-3">{company.documentResult ?? "-"}</td>
                    <td className="px-4 py-3">{company.firstInterviewResult ?? "-"}</td>
                    <td className="px-4 py-3">{company.memo ?? "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white"
                        onClick={() => deleteCompany(company.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

export default App;