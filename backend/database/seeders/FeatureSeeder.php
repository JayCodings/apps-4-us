<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $features = [
            ['name' => 'webhook-proxy'],
        ];

        foreach ($features as $feature) {
            Feature::firstOrCreate($feature);
        }
    }
}
