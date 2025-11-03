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
        Schema::table('webhook_logs', function (Blueprint $table) {
            $table->foreignUuid('project_id')->after('route_id')->constrained()->cascadeOnDelete();
            $table->index(['project_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('webhook_logs', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropIndex(['project_id', 'created_at']);
            $table->dropColumn('project_id');
        });
    }
};
