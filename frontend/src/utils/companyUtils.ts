import type { Company, CompanyForm } from "../types/company";

// 今日の日付を yyyy-mm-dd 形式で返す関数。
// 新規企業登録時のapplied_date初期値として利用する。
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// 企業登録・詳細編集フォームの初期値を生成する関数。
// 登録フォームやモーダルをリセットするときに利用する。
export function createInitialForm(): CompanyForm {
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

// APIから返る日時文字列をdatetime-local用の形式に変換する関数。
// Laravel側の "yyyy-mm-dd hh:mm:ss" を React入力欄用の "yyyy-mm-ddThh:mm" に整える。
export function toDateTimeLocal(value: string | null): string {
  if (!value) {
    return "";
  }

  return value.replace(" ", "T").slice(0, 16);
}

// datetime-localの値をAPI送信用の日時形式に変換する関数。
// React側の "yyyy-mm-ddThh:mm" を Laravel側で扱いやすい "yyyy-mm-dd hh:mm:ss" に整える。
export function toApiDateTime(value: string): string | null {
  if (!value) {
    return null;
  }

  return value.replace("T", " ") + ":00";
}

// CompanyResourceから返るcamelCaseの会社データを、Laravelへ送るsnake_caseのrequestBodyに変換する関数。
// overridesに渡した項目だけ新しい値で上書きし、PUT全体更新用のリクエストを作る。

export function buildCompanyRequestBody(
  company: Company,
  // CompanyFormの一部だけを上書き値として受け取る。
  // 何も渡されなかった場合は、空オブジェクト{}として扱う。
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
    final_result: overrides.final_result ?? company.finalResult ?? "未対応",
    rejection_stage: overrides.rejection_stage ?? company.rejectionStage ?? null,
  };
}