<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    //
    protected $fillable = ['name', 'address', 'privacy', 'user_id'];

    public function tags()
    {
        return $this->belongsToMany('App\Tag', 'url_tags', 'url_id', 'tag_id');
    }
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
