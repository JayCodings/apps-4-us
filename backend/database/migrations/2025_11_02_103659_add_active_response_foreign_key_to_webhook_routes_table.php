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
        Schema::table('webhook_routes', function (Blueprint $table) {
            $table->foreign('active_response_id')->references('id')->on('webhook_responses')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('webhook_routes', function (Blueprint $table) {
            $table->dropForeign(['active_response_id']);
        });
    }
};
