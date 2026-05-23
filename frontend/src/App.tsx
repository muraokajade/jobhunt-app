import { useEffect, useState } from "react";
import CompanyDetailModal from "./components/CompanyDetailModal";
import CompanyTable from "./components/CompanyTable";

import CompanyRegisterForm from "./components/CompanyRegisterForm";
import SearchForm from "./components/SearchForm";
import SummaryCards from "./components/SummaryCards";
import ActionLists from "./components/ActionLists";
import AppHeader from "./components/AppHeader";
import TodayStrategyPanel from "./components/TodayStrategyPanel";
import type { Company, CompanyForm } from "./types/company";

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

const API_BASE_URL = "http://127.0.0.1:8000/api";

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
    <>
    <AppHeader />
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-slate-300">
            村岡 兼通さんの転職活動ダッシュボード
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            次に確認すべき企業を整理しましょう
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            応募企業・面談予定・返答待ち・優先企業をまとめて管理できます。
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1">
              応募管理
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              面談予定
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              次アクション
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              優先企業
            </span>
          </div>
        </section>
        <TodayStrategyPanel />
        <section className="mb-6">
          <h2 className="text-2xl font-bold">応募管理</h2>
          <p className="mt-2 text-slate-600">
            応募企業・選考状況・面談予定・次アクションを一元管理します。
          </p>
        </section>
        {/* 検索フォーム */}

        <SearchForm
          keyword={keyword}
          setKeyword={setKeyword}
          status={status}
          media={media}
          setMedia={setMedia}
          setStatus={setStatus}
          statusOptions={statusOptions}
          onSearch={fetchCompanies}

        
        />
        <SummaryCards 
          companies={companies}
        />

        <section className="mb-3">
          <h2 className="text-xl font-bold">次に確認する企業</h2>
          <p className="mt-1 text-sm text-slate-600">
            面談予定・返答待ち・高優先度の企業を優先して確認できます。
          </p>
        </section>

        <ActionLists companies={companies} />
        <CompanyRegisterForm
          form={form}
          setForm={setForm}
          onCreate={createCompany}
          priorityOptions={priorityOptions}
        />

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
  </>
  );
}

export default App;