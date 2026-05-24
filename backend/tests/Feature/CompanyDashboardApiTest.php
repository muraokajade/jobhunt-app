<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Company;

class CompanyDashboardApiTest extends TestCase
{

    use RefreshDatabase;
    /**
     * Dashboard APIでsummary件数を取得できることを確認する。
     */
    public function test_can_get_company_dashboard_summary(): void
    {
        Company::factory()->create([
            'status' => '内定',
            'priority' => '5.0',
        ]);

        Company::factory()->create([
            'status' => '落選',
            'priority' => '3.0',
        ]);

        Company::factory()->create([
            'status' => '面談予定',
            'priority' => '4.0',
            'interview_date' => now()->addDay(),
        ]);

        $response = $this->getJson('/api/companies/dashboard');

        $response->assertOk();

        $response->assertJsonPath('summary.total', 3);
        $response->assertJsonPath('summary.offer', 1);
        $response->assertJsonPath('summary.rejected', 1);
        $response->assertJsonPath('summary.interview', 1);
        $response->assertJsonPath('summary.highPriority', 2);
    }

    /**
     * Dashboard APIで高優先度企業リストを取得できることを確認する。actionLists表示候補
     */
    /**
     * Dashboard APIで高優先度企業リストを取得できることを確認する。
     */
    public function test_dashboard_contains_high_priority_companies(): void
    {
        Company::factory()->create([
            'name' => '高優先度株式会社',
            'priority' => '5.0',
            'status' => '応募済み',
        ]);

        Company::factory()->create([
            'name' => '低優先度株式会社',
            'priority' => '2.0',
            'status' => '応募済み',
        ]);

        $response = $this->getJson('/api/companies/dashboard');

        $response->assertOk();

        $response->assertJsonCount(1, 'actionLists.highPriority');

        $response->assertJsonPath(
            'actionLists.highPriority.0.name',
            '高優先度株式会社'
        );
    }

    /**
     * Dashboard APIで面談予定企業リストを取得できることを確認する。
     */
    public function test_dashboard_contains_interview_companies(): void
    {
        Company::factory()->create([
            'name' => '面談予定株式会社',
            'status' => '面談予定',
            'priority' => '3.0',
            'interview_date' => now()->addDay(),
        ]);

        Company::factory()->create([
            'name' => '通常応募株式会社',
            'status' => '応募済み',
            'priority' => '3.0',
            'interview_date' => null,
        ]);

        $response = $this->getJson('/api/companies/dashboard');

        $response->assertOk();

        $response->assertJsonCount(1, 'actionLists.interviews');

        $response->assertJsonPath(
            'actionLists.interviews.0.name',
            '面談予定株式会社'
        );
    }
    /**
     * Dashboard APIで確認待ち企業リストを取得できることを確認する。
     */
    public function test_dashboard_contains_waiting_companies(): void
    {
        Company::factory()->create([
            'name' => '確認待ち株式会社',
            'status' => '応募済み',
            'priority' => '3.0',
        ]);

        Company::factory()->create([
            'name' => '内定済み株式会社',
            'status' => '内定',
            'priority' => '3.0',
        ]);

        $response = $this->getJson('/api/companies/dashboard');

        $response->assertOk();

        $response->assertJsonCount(1, 'actionLists.waiting');

        $response->assertJsonPath(
            'actionLists.waiting.0.name',
            '確認待ち株式会社'
        );
    }
}
