import { useEffect, useState } from "react";
import CompanyDetailModal from "./components/CompanyDetailModal";
import CompanyTable from "./components/CompanyTable";

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

const API_BASE_URL = "http://127.0.0.1:8000/api";

const priorityOptions = [
  { value: "5.0", label: "5.0 本命" },
  { value: "4.5", label: "4.5" },
  { value: "4.0", label: "4.0 高い" },
  { value: "3.5", label: "3.5" },
  { value: "3.0", label: "3.0 普通" },
  { value: "2.5", label: "2.5" },
  { value: "2.0", label: "2.0 低い" },
  { value: "1.5", label: "1.5" },
  { value: "1.0", label: "1.0 とりあえず" },
];

const statusOptions = [
  "応募済み",
  "書類選考待ち",
  "書類通過",
  "面談日程調整中",
  "面談予定",
  "面談後返答待ち",
  "内定",
  "辞退",
  "落選",
];

const resultOptions = ["未対応", "通過", "不通過", "保留", "辞退"];

const rejectionStageOptions = [
  { value: "", label: "未設定" },
  { value: "書類落ち", label: "書類落ち" },
  { value: "1次面接落ち", label: "1次面接落ち" },
  { value: "2次面接落ち", label: "2次面接落ち" },
  { value: "最終落ち", label: "最終落ち" },
  { value: "条件不一致", label: "条件不一致" },
  { value: "辞退", label: "辞退" },
];

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function createInitialForm(): CompanyForm {
  return {
    name: "",
    media: "",
    priority: "3.0",
    status: "応募済み",
    applied_date: getTodayString(),
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
  };
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return value.replace(" ", "T").slice(0, 16);
}

function toApiDateTime(value: string) {
  if (!value) {
    return null;
  }

  return value.replace("T", " ") + ":00";
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [media, setMedia] = useState("");
  const [form, setForm] = useState<CompanyForm>(createInitialForm());
  const [detailForm, setDetailForm] = useState<CompanyForm>(createInitialForm());
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  function showToast(message: string) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  async function fetchCompanies() {
    setLoading(true);

    const params = new URLSearchParams();

    if (keyword) {
      params.append("keyword", keyword);
    }

    if (status) {
      params.append("status", status);
    }

    if (media) {
      params.append("media", media);
    }

    const queryString = params.toString();

    const response = await fetch(
      `${API_BASE_URL}/companies${queryString ? `?${queryString}` : ""}`
    );

    const result = await response.json();

    setCompanies(result.data ?? []);
    setLoading(false);
  }

  async function createCompany() {
    if (!form.name.trim()) {
      showToast("企業名を入力してください。");
      return;
    }

    // 初回登録用。
    // 応募直後に分かる情報だけを受け取り、
    // statusやapplied_dateなどは業務ルールとして自動セットする。
    const requestBody = {
      name: form.name,
      media: form.media || null,
      priority: form.priority || null,
      status: "応募済み",
      applied_date: getTodayString(),
      interview_date: null,
      job_url: form.job_url || null,
      interview_url: null,
      memo: form.memo || null,
      next_action: null,
      document_result: "未対応",
      first_interview_result: "未対応",
      second_interview_result: "未対応",
      final_result: "未対応",
      rejection_stage: null,
    };

    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("登録に失敗しました。入力内容を確認してください。");
      return;
    }

    showToast("企業を登録しました。");
    setForm(createInitialForm());
    await fetchCompanies();
  }

  // CompanyResourceから返るcamelCaseの会社データを、
  // Laravelへ送るsnake_caseのrequestBodyに変換する。
  // overridesに渡した項目だけ、新しい値で上書きする。
  function buildCompanyRequestBody(
    company: Company,
    overrides: Partial<CompanyForm> = {}
  ) {
    return {
      name: overrides.name ?? company.name,
      media: overrides.media ?? company.media ?? null,
      priority: overrides.priority ?? company.priority ?? null,
      status: overrides.status ?? company.status,
      applied_date: overrides.applied_date ?? company.appliedDate ?? null,
      interview_date:
        overrides.interview_date !== undefined
          ? toApiDateTime(overrides.interview_date)
          : company.interviewDate ?? null,
      job_url: overrides.job_url ?? company.jobUrl ?? null,
      interview_url: overrides.interview_url ?? company.interviewUrl ?? null,
      memo: overrides.memo ?? company.memo ?? null,
      next_action: overrides.next_action ?? company.nextAction ?? null,
      document_result:
        overrides.document_result ?? company.documentResult ?? "未対応",
      first_interview_result:
        overrides.first_interview_result ??
        company.firstInterviewResult ??
        "未対応",
      second_interview_result:
        overrides.second_interview_result ??
        company.secondInterviewResult ??
        "未対応",
      final_result:
        overrides.final_result ?? company.finalResult ?? "未対応",
      rejection_stage:
        overrides.rejection_stage ?? company.rejectionStage ?? null,
    };
  }

  async function updateCompanyPriority(company: Company, priority: string) {
    // 一覧上で志望度を変更する。
    // LaravelのPUTは会社データ全体を受け取るため、
    // companyの既存値を使い、priorityだけ新しい値に差し替えて送信する。
    const requestBody = buildCompanyRequestBody(company, { priority });

    const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("志望度の更新に失敗しました。");
      return;
    }

    showToast("志望度を更新しました。");
    await fetchCompanies();
  }

  async function updateCompanyStatus(company: Company, status: string) {
    // 一覧上で選考状況を変更する。
    // priority更新と同じく、statusだけ新しい値に差し替えて送信する。
    const requestBody = buildCompanyRequestBody(company, { status });

    const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("状況の更新に失敗しました。");
      return;
    }

    showToast("状況を更新しました。");
    await fetchCompanies();
  }

  function openDetailModal(company: Company) {
    // 一覧から選択した会社の元データを保持する。
    setSelectedCompany(company);

    // モーダル内で編集するため、Company型のcamelCaseを
    // フォーム用のsnake_caseへ詰め替える。
    setDetailForm({
      name: company.name,
      media: company.media ?? "",
      priority: company.priority ?? "3.0",
      status: company.status,
      applied_date: company.appliedDate ?? "",
      interview_date: toDateTimeLocal(company.interviewDate),
      job_url: company.jobUrl ?? "",
      interview_url: company.interviewUrl ?? "",
      memo: company.memo ?? "",
      next_action: company.nextAction ?? "",
      document_result: company.documentResult ?? "未対応",
      first_interview_result: company.firstInterviewResult ?? "未対応",
      second_interview_result: company.secondInterviewResult ?? "未対応",
      final_result: company.finalResult ?? "未対応",
      rejection_stage: company.rejectionStage ?? "",
    });

    setIsDetailOpen(true);
  }

  function closeDetailModal() {
    setIsDetailOpen(false);
    setSelectedCompany(null);
    setDetailForm(createInitialForm());
  }

  async function updateCompanyDetail() {
    if (!selectedCompany) {
      return;
    }

    const requestBody = {
      name: detailForm.name,
      media: detailForm.media || null,
      priority: detailForm.priority || null,
      status: detailForm.status,
      applied_date: detailForm.applied_date || null,
      interview_date: toApiDateTime(detailForm.interview_date),
      job_url: detailForm.job_url || null,
      interview_url: detailForm.interview_url || null,
      memo: detailForm.memo || null,
      next_action: detailForm.next_action || null,
      document_result: detailForm.document_result || "未対応",
      first_interview_result: detailForm.first_interview_result || "未対応",
      second_interview_result: detailForm.second_interview_result || "未対応",
      final_result: detailForm.final_result || "未対応",
      rejection_stage: detailForm.rejection_stage || null,
    };

    const response = await fetch(
      `${API_BASE_URL}/companies/${selectedCompany.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      showToast("更新に失敗しました。");
      return;
    }

    showToast("更新しました。");
    await fetchCompanies();
    closeDetailModal();
  }

  async function deleteCompany(id: number) {
    const confirmed = window.confirm("この企業を削除しますか？");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      showToast("削除に失敗しました。");
      return;
    }

    showToast("企業を削除しました。");
    await fetchCompanies();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-sm font-semibold text-slate-500">転職活動CRM</p>
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
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
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
              {
                companies.filter(
                  (company) => company.status === "面談後返答待ち"
                ).length
              }
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
        
        {/* 一覧表示テーブル */}
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
                          updateCompanyPriority(company, event.target.value)
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
                          updateCompanyStatus(company, event.target.value)
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
                          onClick={() => openDetailModal(company)}
                        >
                          詳細
                        </button>

                        <button
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white"
                          onClick={() => deleteCompany(company.id)}
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

        <CompanyTable
          companies={companies}
          loading={loading}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          onPriorityChange={updateCompanyPriority}
          onStatusChange={updateCompanyStatus}
          onOpenDetail={openDetailModal}
          onDelete={deleteCompany}
        />

        <CompanyDetailModal
          isOpen={isDetailOpen}
          selectedCompany={selectedCompany}
          detailForm={detailForm}
          setDetailForm={setDetailForm}
          onClose={closeDetailModal}
          onSave={updateCompanyDetail}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          resultOptions={resultOptions}
          rejectionStageOptions={rejectionStageOptions}
        />
      </div>
    </main>
  );
}

export default App;