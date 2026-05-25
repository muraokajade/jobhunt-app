import { useEffect, useState } from "react";
import CompanyDetailModal from "./components/CompanyDetailModal";
import CompanyTable from "./components/CompanyTable";
import CompanyRegisterForm from "./components/CompanyRegisterForm";
import SearchForm from "./components/SearchForm";
import SummaryCards from "./components/SummaryCards";
import ActionLists from "./components/ActionLists";
import AppHeader from "./components/AppHeader";
import type { Company, CompanyForm, DashboardResponse } from "./types/company";
import {
  priorityOptions,
  statusOptions,
  resultOptions,
  rejectionStageOptions,
} from "./constants/companyOptions";
import {
  getTodayString,
  createInitialForm,
  toDateTimeLocal,
  toApiDateTime,
  buildCompanyRequestBody,
} from "./utils/companyUtils";

const API_BASE_URL = "http://127.0.0.1:8001/api";

type MainPanel = "register" | "list";

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [media, setMedia] = useState("");
  const [form, setForm] = useState<CompanyForm>(createInitialForm());
  const [detailForm, setDetailForm] = useState<CompanyForm>(
    createInitialForm()
  );
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isActionListsOpen, setIsActionListsOpen] = useState(false);
  const [mainPanel, setMainPanel] = useState<MainPanel>("list");

  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("jobhunt_token")
  );
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!authToken) {
      setCompanies([]);
      setDashboard(null);
      return;
    }

    fetchMe(authToken);
    fetchCompanies(authToken);
    fetchDashboard(authToken);
  }, [authToken]);

  // API通信で利用するheadersを作る関数。
  // tokenがある場合だけAuthorizationヘッダーを付ける。
  function createHeaders(token: string | null, hasBody = false) {
    return {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // 画面右上に一時的な通知メッセージを表示する関数。
  function showToast(message: string) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  // ログイン中ユーザー情報を取得する関数。
  async function fetchMe(token: string) {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: createHeaders(token),
    });

    if (!response.ok) {
      localStorage.removeItem("jobhunt_token");
      setAuthToken(null);
      setAuthUser(null);
      return;
    }

    const data = await response.json();
    setAuthUser(data.user);
  }

  // ログイン処理を行う関数。
  async function login() {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: createHeaders(null, true),
      body: JSON.stringify({
        email: authForm.email,
        password: authForm.password,
      }),
    });

    if (!response.ok) {
      showToast("ログインに失敗しました。");
      return;
    }

    const data: AuthResponse = await response.json();

    localStorage.setItem("jobhunt_token", data.token);
    setAuthToken(data.token);
    setAuthUser(data.user);
    showToast("ログインしました。");
  }

  // ユーザー登録処理を行う関数。
  async function register() {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: createHeaders(null, true),
      body: JSON.stringify(authForm),
    });

    if (!response.ok) {
      showToast("ユーザー登録に失敗しました。");
      return;
    }

    const data: AuthResponse = await response.json();

    localStorage.setItem("jobhunt_token", data.token);
    setAuthToken(data.token);
    setAuthUser(data.user);
    showToast("ユーザー登録しました。");
  }

  // ログアウト処理を行う関数。
  async function logout() {
    if (authToken) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: createHeaders(authToken),
      });
    }

    localStorage.removeItem("jobhunt_token");
    setAuthToken(null);
    setAuthUser(null);
    setCompanies([]);
    setDashboard(null);
    showToast("ログアウトしました。");
  }

  // Dashboard APIから集計データを取得する関数。
  async function fetchDashboard(tokenOverride?: string) {
    const token = tokenOverride ?? authToken;

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/companies/dashboard`, {
        headers: createHeaders(token),
      });

      if (!response.ok) {
        throw new Error("Dashboard APIの取得に失敗しました。");
      }

      const data: DashboardResponse = await response.json();

      setDashboard(data);
    } catch (error) {
      console.error(error);
      setDashboard(null);
    }
  }

  // 企業一覧APIから企業データを取得する関数。
  async function fetchCompanies(tokenOverride?: string) {
    const token = tokenOverride ?? authToken;

    if (!token) {
      return;
    }

    setLoading(true);

    try {
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
        `${API_BASE_URL}/companies${queryString ? `?${queryString}` : ""}`,
        {
          headers: createHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error("企業一覧APIの取得に失敗しました。");
      }

      const result = await response.json();

      setCompanies(result.data ?? []);
    } catch (error) {
      console.error(error);
      showToast("企業一覧の取得に失敗しました。");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  // 企業を新規登録する関数。
  async function createCompany() {
    if (!authToken) {
      showToast("ログインしてください。");
      return;
    }

    if (!form.name.trim()) {
      showToast("企業名を入力してください。");
      return;
    }

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
      headers: createHeaders(authToken, true),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("登録に失敗しました。入力内容を確認してください。");
      return;
    }

    showToast("企業を登録しました。");
    setForm(createInitialForm());
    await fetchCompanies();
    await fetchDashboard();
    setMainPanel("list");
  }

  // 一覧上で志望度を変更する関数。
  async function updateCompanyPriority(company: Company, priority: string) {
    if (!authToken) {
      return;
    }

    const requestBody = buildCompanyRequestBody(company, { priority });

    const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: createHeaders(authToken, true),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("志望度の更新に失敗しました。");
      return;
    }

    showToast("志望度を更新しました。");
    await fetchCompanies();
    await fetchDashboard();
  }

  // 一覧上で選考状況を変更する関数。
  async function updateCompanyStatus(company: Company, status: string) {
    if (!authToken) {
      return;
    }

    const requestBody = buildCompanyRequestBody(company, { status });

    const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: createHeaders(authToken, true),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showToast("状況の更新に失敗しました。");
      return;
    }

    showToast("状況を更新しました。");
    await fetchCompanies();
    await fetchDashboard();
  }

  // 企業のお気に入り状態を切り替える関数。
  async function toggleCompanyFavorite(company: Company) {
    if (!authToken) {
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/companies/${company.id}/favorite`,
      {
        method: "PATCH",
        headers: createHeaders(authToken),
      }
    );

    if (!response.ok) {
      showToast("お気に入りの更新に失敗しました。");
      return;
    }

    showToast("お気に入りを更新しました。");
    await fetchCompanies();
    await fetchDashboard();
  }

  // 詳細モーダルを開く関数。
  function openDetailModal(company: Company) {
    setSelectedCompany(company);

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

  // 詳細モーダルを閉じる関数。
  function closeDetailModal() {
    setIsDetailOpen(false);
    setSelectedCompany(null);
    setDetailForm(createInitialForm());
  }

  // 詳細モーダルで編集した企業情報を保存する関数。
  async function updateCompanyDetail() {
    if (!selectedCompany || !authToken) {
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
        headers: createHeaders(authToken, true),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      showToast("更新に失敗しました。");
      return;
    }

    showToast("更新しました。");
    await fetchCompanies();
    await fetchDashboard();
    closeDetailModal();
  }

  // 企業を削除する関数。
  async function deleteCompany(id: number) {
    if (!authToken) {
      return;
    }

    const confirmed = window.confirm("この企業を削除しますか？");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: createHeaders(authToken),
    });

    if (!response.ok) {
      showToast("削除に失敗しました。");
      return;
    }

    showToast("企業を削除しました。");
    await fetchCompanies();
    await fetchDashboard();
  }

  if (!authToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-900">
        {toastMessage && (
          <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {toastMessage}
          </div>
        )}

        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            JobHunt Lite
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {authMode === "login" ? "ログイン" : "ユーザー登録"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            自分の応募企業・選考状況・次アクションを管理します。
          </p>

          <div className="mt-6 space-y-4">
            {authMode === "register" && (
              <input
                className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-slate-500"
                placeholder="名前"
                value={authForm.name}
                onChange={(event) =>
                  setAuthForm({ ...authForm, name: event.target.value })
                }
              />
            )}

            <input
              className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-slate-500"
              placeholder="メールアドレス"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm({ ...authForm, email: event.target.value })
              }
            />

            <input
              className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-slate-500"
              type="password"
              placeholder="パスワード"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
            />

            <button
              type="button"
              onClick={authMode === "login" ? login : register}
              className="h-11 w-full rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800"
            >
              {authMode === "login" ? "ログイン" : "登録する"}
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="mt-5 w-full text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            {authMode === "login"
              ? "アカウントを作成する"
              : "ログイン画面へ戻る"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-900">
        {toastMessage && (
          <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {toastMessage}
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          <section className="mb-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  JobHunt Lite
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                  応募企業を管理する
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  企業登録・検索・選考状況更新・詳細編集を一画面で行います。
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {authUser?.name ?? "ユーザー"} さんでログイン中
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMainPanel("register")}
                  className={[
                    "rounded-xl px-5 py-2 text-sm font-bold transition",
                    mainPanel === "register"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  登録
                </button>

                <button
                  type="button"
                  onClick={() => setMainPanel("list")}
                  className={[
                    "rounded-xl px-5 py-2 text-sm font-bold transition",
                    mainPanel === "list"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  一覧
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </section>

          <SummaryCards
            companies={companies}
            dashboardSummary={dashboard?.summary}
          />

          <SearchForm
            keyword={keyword}
            setKeyword={setKeyword}
            status={status}
            media={media}
            setMedia={setMedia}
            setStatus={setStatus}
            statusOptions={statusOptions}
            onSearch={() => fetchCompanies()}
          />

          <section className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setIsActionListsOpen(!isActionListsOpen)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  次に確認する企業
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  面談予定・返答待ち・高優先度の企業を必要な時だけ確認します。
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {isActionListsOpen ? "閉じる" : "開く"}
              </span>
            </button>

            {isActionListsOpen && (
              <div className="border-t border-slate-200 p-5">
                <ActionLists
                  companies={companies}
                  dashboardActionLists={dashboard?.actionLists}
                  onOpenDetail={openDetailModal}
                />
              </div>
            )}
          </section>

          {mainPanel === "register" ? (
            <CompanyRegisterForm
              form={form}
              setForm={setForm}
              onCreate={createCompany}
              priorityOptions={priorityOptions}
            />
          ) : (
            <CompanyTable
              companies={companies}
              loading={loading}
              priorityOptions={priorityOptions}
              statusOptions={statusOptions}
              onPriorityChange={updateCompanyPriority}
              onStatusChange={updateCompanyStatus}
              onOpenDetail={openDetailModal}
              onDelete={deleteCompany}
              onToggleFavorite={toggleCompanyFavorite}
            />
          )}

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
    </>
  );
}

export default App;