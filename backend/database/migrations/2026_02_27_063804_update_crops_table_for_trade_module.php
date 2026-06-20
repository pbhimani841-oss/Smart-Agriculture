<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('crops', 'listing_price')) {
            Schema::table('crops', function (Blueprint $table) {
                $table->decimal('listing_price', 10, 2)->nullable()->after('price_per_kg');
                $table->decimal('selling_price', 10, 2)->nullable()->after('listing_price');
                $table->decimal('sold_quantity', 10, 2)->default(0)->after('quantity');
                $table->decimal('remaining_quantity', 10, 2)->nullable()->after('sold_quantity');
                $table->decimal('total_amount', 10, 2)->nullable()->after('remaining_quantity');
            });
        }

        // Safely expand the enum first to prevent truncation errors on existing old records
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE crops MODIFY COLUMN status ENUM('available', 'sold_out', 'active', 'partially_sold', 'completed') DEFAULT 'available'");

        // Update existing records to the new ENUM format and sync required calculations
        \Illuminate\Support\Facades\DB::table('crops')->update([
            'listing_price' => \Illuminate\Support\Facades\DB::raw('price_per_kg'),
            'remaining_quantity' => \Illuminate\Support\Facades\DB::raw('quantity'),
            'status' => \Illuminate\Support\Facades\DB::raw("CASE WHEN status = 'available' THEN 'active' ELSE 'completed' END")
        ]);

        // Shrink the enum back strictly to the new values
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE crops MODIFY COLUMN status ENUM('active', 'partially_sold', 'completed') DEFAULT 'active'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE crops MODIFY COLUMN status ENUM('available', 'sold_out') DEFAULT 'available'");

        Schema::table('crops', function (Blueprint $table) {
            $table->dropColumn([
                'listing_price',
                'selling_price',
                'sold_quantity',
                'remaining_quantity',
                'total_amount'
            ]);
        });
    }
};
