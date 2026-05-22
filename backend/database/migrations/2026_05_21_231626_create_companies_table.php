<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('media')->nullable();
            $table->string('status')->default('応募済み');
            $table->date('applied_date')->nullable();
            $table->dateTime('interview_date')->nullable();
            $table->text('job_url')->nullable();
            $table->text('interview_url')->nullable();
            $table->text('memo')->nullable();
            $table->string('next_action')->nullable();
            $table->string('document_result')->nullable();
            $table->string('first_interview_result')->nullable();
            $table->string('second_interview_result')->nullable();
            $table->string('final_result')->nullable();
            $table->string('rejection_stage')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
