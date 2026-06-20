<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [
        'farmer_id',
        'crop_name',
        'quantity',
        'price_per_kg',
        'description',
        'status',
        'listing_price',
        'selling_price',
        'sold_quantity',
        'remaining_quantity',
        'total_amount'
    ];

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function priceRequests()
    {
        return $this->hasMany(PriceRequest::class);
    }
}
