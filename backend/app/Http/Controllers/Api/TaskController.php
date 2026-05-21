<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    public function index(Request $request)
    {

        // tasksテーブルに対する検索条件を組み立てる
        $query = Task::query();

        // status が指定されていて、all ではない場合だけ絞り込む
        if ($request->filled('status') && $request->status !== "all") {
            $query->where('status', $request->status);
        }

        // Reactから ?keyword=xxx のように送られてきた場合だけ検索する
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            // title または description に keyword を含むタスクを検索する
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }


        // 複数件のTaskモデル一覧を、1件ずつTaskResourceの形式に変換して返す
        return TaskResource::collection($query->latest()->get());
    }

    public function store(StoreTaskRequest $request)
    {


        $task = Task::create($request->validated());

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        // 1件のタスク詳細を返す
        return new TaskResource($task);
    }

    //これは Laravel の ルートモデルバインディング です。
    public function update(UpdateTaskRequest $request, Task $task)
    {

        $task->update($request->validated());

        // 更新後の1件を返す
        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }
}
