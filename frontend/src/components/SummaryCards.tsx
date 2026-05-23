// 集計カードで利用する企業データの型。
// 一覧表示や集計に必要な最低限の項目として、idとstatusを受け取る。
type Company = {
  id: number;
  status: string;
};

// SummaryCardsコンポーネントが親コンポーネントから受け取るpropsの型。
// companiesを受け取り、応募総数や状況別件数を画面に表示する。
type SummaryCardsProps = {
  companies: Company[];
};

// 企業一覧データから、指定した選考状況に一致する件数を数える関数。
// 集計カード内で「面談予定」「返答待ち」「内定」「落選」などの件数表示に使う。
function countByStatus(companies: Company[], status: string) {
  return companies.filter((company) => company.status === status).length;
}

// 応募企業の集計カードを表示するコンポーネント。
// API通信は行わず、親から受け取ったcompaniesをもとに画面表示用の件数を計算する。
function SummaryCards({ companies }: SummaryCardsProps) {
  return (
    <section className="mb-4 grid gap-3 md:grid-cols-5">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">応募総数</p>
        <p className="text-2xl font-bold">{companies.length}</p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">面談予定</p>
        <p className="text-2xl font-bold">
          {countByStatus(companies, "面談予定")}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">返答待ち</p>
        <p className="text-2xl font-bold">
          {countByStatus(companies, "面談後返答待ち")}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">内定</p>
        <p className="text-2xl font-bold">
          {countByStatus(companies, "内定")}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">落選</p>
        <p className="text-2xl font-bold">
          {countByStatus(companies, "落選")}
        </p>
      </div>
    </section>
  );
}

export default SummaryCards;