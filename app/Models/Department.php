<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    /**
     * Derive a short unique "code" from a department name, e.g. "ICT" -> ICT,
     * "Human Resources" -> HUMANR (deduped with a numeric suffix on collision).
     */
    public static function generateCode(string $name): string
    {
        $base = strtoupper(preg_replace('/[^A-Za-z]/', '', $name));
        $base = substr($base, 0, 6) ?: 'DEPT';

        $code = $base;
        $suffix = 1;

        while (self::where('code', $code)->exists()) {
            $code = $base.$suffix++;
        }

        return $code;
    }
}
