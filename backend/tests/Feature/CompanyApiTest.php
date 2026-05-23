<?php

namespace Tests\Feature;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;


/**
 * 企業管理APIのFeature Testクラス。
 * 登録・更新・検索・削除・バリデーションがAPIとして正しく動くかを確認する。
 */
class CompanyApiTest extends TestCase
{
    use RefreshDatabase;




    /**
     * 企業登録APIへ送る標準リクエストデータを作るメソッド。
     * 複数のテストで同じ入力データを使い回すために用意する。
     *
     * @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    private function companyPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'テスト株式会社',
            'media' => 'Green',
            'priority' => '3.0',
            'status' => '応募済み',
            'applied_date' => now()->toDateString(),
            'interview_date' => null,
            'job_url' => 'https://example.com/jobs/1',
            'interview_url' => null,
            'memo' => 'テスト用メモ',
            'next_action' => '書類選考結果待ち',
            'document_result' => '未対応',
            'first_interview_result' => '未対応',
            'second_interview_result' => '未対応',
            'final_result' => '未対応',
            'rejection_stage' => null,
        ], $overrides);
    }

    /**
     * 企業を登録できることを確認するテスト。
     * 正しいリクエストを送った場合、201が返りDBに企業情報が保存されることを確認する。
     */
    public function test_can_create_company(): void
    {
        $response = $this->postJson('/api/companies', $this->companyPayload());

        $response->assertCreated();

        $this->assertDatabaseHas('companies', [
            'name' => 'テスト株式会社',
            'status' => '応募済み',
            'priority' => '3.0',
        ]);
    }

    public function test_cannot_creat_company_without_name(): void
    {
        $response = $this->postJson('/api/companies', $this->companyPayload([
            'name' => '',
        ]));

        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['name']);
    }
    /**
     * 不正な求人URLでは企業登録できないことを確認するテスト。
     * job_urlはURL形式である必要があるため、不正な文字列を送ると422になる。
     */
    public function test_cannot_create_company_with_invalid_job_url(): void
    {
        $response = $this->postJson('/api/companies', $this->companyPayload([
            'job_url' => 'invalid-url',
        ]));

        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['job_url']);
    }

    /**
     * 企業情報を更新できることを確認するテスト。
     * Factoryで既存企業を1件DBに作り、その企業に対してPUT全体更新できるかを確認する。
     */
    public function test_can_update_company(): void
    {
        $company = Company::factory()->create();

        $response = $this->putJson("/api/companies/{$company->id}", $this->companyPayload([
            'name' => '更新株式会社',
            'status' => '面談予定',
            'priority' => '5.0',
        ]));

        $response->assertOk();

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => '更新株式会社',
            'status' => '面談予定',
            'priority' => '5.0',
        ]);
    }

    /**
     * 許可されていない選考状況では企業情報を更新できないことを確認するテスト。
     * statusはUpdateCompanyRequestのRule::inで許可値が決まっているため、想定外の値は422になる。
     */
    public function test_cannot_update_company_with_invalid_status(): void
    {
        $company = Company::factory()->create();

        $response = $this->putJson("/api/companies/{$company->id}", $this->companyPayload([
            'status' => '謎ステータス',
        ]));

        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['status']);
    }

    /**
     * 企業を削除できることを確認するテスト。
     * Factoryで作成した企業にDELETEリクエストを送り、DBから削除されることを確認する。
     */
    public function test_can_delete_company(): void
    {
        $company = Company::factory()->create();

        $response = $this->deleteJson("/api/companies/{$company->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('companies', [
            'id' => $company->id,
        ]);
    }

    /**
     * キーワードで企業一覧を検索できることを確認するテスト。
     * keywordに一致する企業だけがレスポンスに含まれることを確認する。
     */
    public function test_can_search_companies_by_keyword(): void
    {
        Company::factory()->create([
            'name' => 'Search Target Company',
            'memo' => 'Laravel案件',
        ]);

        Company::factory()->create([
            'name' => 'Other Company',
            'memo' => 'React案件',
        ]);

        $response = $this->getJson('/api/companies?keyword=Search');

        $response->assertOk();

        $response->assertJsonFragment([
            'name' => 'Search Target Company',
        ]);

        $response->assertJsonMissing([
            'name' => 'Other Company',
        ]);
    }

    /**
     * 選考状況で企業一覧を絞り込めることを確認するテスト。
     * statusクエリに一致する企業だけがレスポンスに含まれることを確認する。
     */
    public function test_can_filter_companies_by_status(): void
    {
        Company::factory()->create([
            'name' => '面談予定株式会社',
            'status' => '面談予定',
        ]);

        Company::factory()->create([
            'name' => '応募済み株式会社',
            'status' => '応募済み',
        ]);

        $response = $this->getJson('/api/companies?status=' . urlencode('面談予定'));

        $response->assertOk();

        $response->assertJsonFragment([
            'name' => '面談予定株式会社',
        ]);

        $response->assertJsonMissing([
            'name' => '応募済み株式会社',
        ]);
    }

    /**
     * 媒体名で企業一覧を絞り込めることを確認するテスト。
     * mediaクエリに一致する企業だけがレスポンスに含まれることを確認する。
     */
    public function test_can_filter_companies_by_media(): void
    {
        Company::factory()->create([
            'name' => 'Green経由株式会社',
            'media' => 'Green',
        ]);

        Company::factory()->create([
            'name' => 'Type経由株式会社',
            'media' => 'type',
        ]);

        $response = $this->getJson('/api/companies?media=Green');

        $response->assertOk();

        $response->assertJsonFragment([
            'name' => 'Green経由株式会社',
        ]);

        $response->assertJsonMissing([
            'name' => 'Type経由株式会社',
        ]);
    }
    /**
     * キーワードと選考状況を組み合わせて企業一覧を絞り込めることを確認するテスト。
     * keyword条件とstatus条件の両方に一致する企業だけがレスポンスに含まれることを確認する。
     */
    public function test_can_filter_companies_by_keyword_and_status(): void
    {
        Company::factory()->create([
            'name' => 'Laravel面談予定株式会社',
            'memo' => 'Laravel案件',
            'status' => '面談予定',
        ]);

        Company::factory()->create([
            'name' => 'Laravel応募済み株式会社',
            'memo' => 'Laravel案件',
            'status' => '応募済み',
        ]);

        Company::factory()->create([
            'name' => 'React面談予定株式会社',
            'memo' => 'React案件',
            'status' => '面談予定',
        ]);

        $response = $this->getJson('/api/companies?keyword=Laravel&status=' . urlencode('面談予定'));

        $response->assertOk();

        $response->assertJsonFragment([
            'name' => 'Laravel面談予定株式会社',
        ]);

        $response->assertJsonMissing([
            'name' => 'Laravel応募済み株式会社',
        ]);

        $response->assertJsonMissing([
            'name' => 'React面談予定株式会社',
        ]);
    }

    /**
     * PUT全体更新で企業情報を更新しても、送信した既存項目が正しく保持されることを確認するテスト。
     * 一覧のインライン更新では一部項目だけ変更するUIだが、APIには全体データを送る設計であることを確認する。
     */
    public function test_can_update_company_without_losing_existing_fields(): void
    {
        $company = Company::factory()->create([
            'name' => '既存企業株式会社',
            'job_url' => 'https://example.com/original-job',
            'memo' => '既存メモ',
            'next_action' => '既存アクション',
            'status' => '応募済み',
            'priority' => '3.0',
        ]);

        $response = $this->putJson("/api/companies/{$company->id}", $this->companyPayload([
            'name' => $company->name,
            'job_url' => $company->job_url,
            'memo' => $company->memo,
            'next_action' => $company->next_action,
            'status' => '応募済み',
            'priority' => '5.0',
        ]));

        $response->assertOk();

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => '既存企業株式会社',
            'job_url' => 'https://example.com/original-job',
            'memo' => '既存メモ',
            'next_action' => '既存アクション',
            'priority' => '5.0',
        ]);
    }
}
