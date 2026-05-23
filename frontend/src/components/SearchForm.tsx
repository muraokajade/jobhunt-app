
// 検索フォームコンポーネントが親コンポーネントから受け取るpropsの型。
// keyword / status / media の検索条件と、それぞれの更新関数、検索実行関数を受け取る。
type SearchFormProps = {
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    media: string;
    setMedia: React.Dispatch<React.SetStateAction<string>>;
    statusOptions: string[];
    onSearch: () => void;
}

// 企業一覧の検索フォームを表示するコンポーネント。
// このコンポーネントは検索条件の入力UIだけを担当し、実際のAPI検索処理は親のApp.tsxに任せる。
function SearchForm({
  keyword,
  setKeyword,
  status,
  setStatus,
  media,
  setMedia,
  statusOptions,
  onSearch,
}: SearchFormProps)  {
            {/* 検索フォーム */}

    return(
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
            onClick={onSearch}
            >
            検索
            </button>
        </section>
    )

}
export default SearchForm;