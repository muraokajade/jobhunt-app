import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "doing" | "done";
  priority: "low" | "middle" | "high";
  due_date: string | null;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("middle");
  const [dueDate, setDueDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<Task["priority"]>("middle");
  const [editDueDate, setEditDueDate] = useState("");
  
  // TODO ロジック // TODO 学習ログ：フロント側filter版
  // const filteredTasks = tasks.filter((task) => {
  //   const matchesStatus = 
  //     statusFilter === "all" || task.status === statusFilter;

  //   const keyword = searchKeyword.toLowerCase();

  //   const title = task.title.toLowerCase();

  //   const description = (task.description ?? "").toLowerCase();

  //   // title description 一致したらどちらも。
  //   const matchesKeyword = 
  //     title.includes(keyword) || description.includes(keyword);

  //   //2条件 trueどちらも返す。
  //   return matchesStatus && matchesKeyword;


  // });

  //一覧表示
  const fetchTasks = async () => {
    // /tasks?status=todo
    const params = new URLSearchParams();

    if (statusFilter !== "all") {
      params.append("status", statusFilter); //statusFilter が todo なら、最終的に ?status=todo を作る
    }

    if(searchKeyword.trim() !== "") {
      params.append("keyword", searchKeyword);
    }

    const res = await fetch(`http://127.0.0.1:8000/api/tasks?${params.toString()} `);
    const json = await res.json();
    
    setTasks(json.data ?? json);
  };

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        due_date:dueDate || null,
      }),
    });

    setDueDate("");
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("middle");
    await fetchTasks();
  };

  const deleteTask = async(id: number) => {
    const  res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}`,
      { method:"DELETE",
        headers: {
        "Content-Type": "application/json"
        }
       });

        console.log("delete status", res.status);

  if (!res.ok) {
    const error = await res.text();
    console.log(error);
    return;
  } 

      await fetchTasks();
  };

  const updateStatus = async(task: Task, status: Task["status"]) => {
    const payload = {
      title: task.title,
      description: task.description ?? null,
      status,
      priority: task.priority ?? null,
      due_date: task.due_date ?? null,
    }

    console.log("update payload", payload);

    const res = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
   });
   console.log("update status", res.status);


  if (!res.ok) {
    const error = await res.text();
    console.log(error);
    return;
  }

    await fetchTasks();
  }




  useEffect(() => {
    fetchTasks();
  }, [statusFilter, searchKeyword]);


    const startEdit = (task: Task) => {
      setEditingTaskId(task.id);
      setEditTitle(task.title);
      setEditDescription(task.description ?? "");
      setEditPriority(task.priority);
      setEditDueDate(task.due_date ?? "");
    };

  const cancelEdit = () => {
      setEditingTaskId(null);
      setEditTitle("");
      setEditDescription("");
      setEditPriority("middle");
      setEditDueDate("");
  };

  const updateTask = async(task: Task) => {
    const res = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", //これ何
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        status: task.status,
        priority: editPriority,
        due_date: editDueDate || null,
      }),
    });

    cancelEdit();
    await fetchTasks();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-gray-500">TaskLog</p>
          <h1 className="text-3xl font-bold tracking-tight">
            軽量タスク管理
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            日々の学習・作業タスクを、Notionより軽く記録する。
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">タスクを登録</h2>

          <form onSubmit={createTask} className="space-y-4">
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスク名"
            />

            <textarea
              className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <select
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
              >
                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>

              <select
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Task["priority"])
                }
              >
                <option value="low">low</option>
                <option value="middle">middle</option>
                <option value="high">high</option>
              </select>

              <input
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <button
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
              type="submit"
            >
              登録する
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold">タスク一覧</h2>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="キーワード検索"
              />

              <select
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | Task["status"])
                }
              >
                <option value="all">all</option>
                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>

          <ul className="space-y-3">
            {tasks.map((task) => (
              
              <li
                key={task.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                {editingTaskId === task.id ? (
                  // 編集モード：このtaskのidとeditingTaskIdが一致したときだけ表示
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <textarea
                      className="min-h-20 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <select
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as Task["priority"])
                        }
                      >
                        <option value="low">low</option>
                        <option value="middle">middle</option>
                        <option value="high">high</option>
                      </select>

                      <input
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white hover:bg-gray-700"
                        onClick={() => updateTask(task)}
                      >
                        保存
                      </button>
                      <button
                        className="rounded-lg bg-white px-3 py-2 text-xs hover:bg-gray-100"
                        onClick={cancelEdit}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  // 通常表示モード
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description || "詳細なし"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-white px-3 py-1">
                          {task.status}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="rounded-full bg-white px-3 py-1">
                            期限: {task.due_date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg bg-white px-3 py-2 text-xs hover:bg-gray-100"
                        onClick={() => updateStatus(task, "todo")}
                      >
                        todo
                      </button>
                      <button
                        className="rounded-lg bg-white px-3 py-2 text-xs hover:bg-gray-100"
                        onClick={() => updateStatus(task, "doing")}
                      >
                        doing
                      </button>
                      <button
                        className="rounded-lg bg-white px-3 py-2 text-xs hover:bg-gray-100"
                        onClick={() => updateStatus(task, "done")}
                      >
                        done
                      </button>
                      <button
                        className="rounded-lg bg-white px-3 py-2 text-xs hover:bg-gray-100"
                        onClick={() => startEdit(task)}
                      >
                        編集
                      </button>
                      <button
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100"
                        onClick={() => deleteTask(task.id)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default App;