<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    public const string CREATED_AT = 'created_at';
    public const string UPDATED_AT = 'updated_at';

    public $timestamps = true;

    protected $guarded = [];
}
