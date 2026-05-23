// APIから取得した企業データをReact側で扱うための型。
// LaravelのCompanyResourceから返るcamelCaseのレスポンス形式に合わせている。
export type Company = {
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

// 企業登録フォーム・詳細編集フォームで扱う入力値の型。
// Laravel APIへ送信するrequestBodyに近い形にするため、snake_caseで定義している。
export type CompanyForm = {
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

// value / label形式のselect選択肢で使う共通型。
// priorityOptionsやrejectionStageOptionsなどで利用する。
export type Option = {
  value: string;
  label: string;
};