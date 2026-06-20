<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceRequest extends Model
{
    protected $fillable = ['crop_id', 'customer_id', 'farmer_id', 'requested_price', 'quantity', 'status'];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }
}
