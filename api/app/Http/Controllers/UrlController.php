<?php

namespace App\Http\Controllers;

use App\Url;
use App\User;
use App\UrlTag;
use App\Tag;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;

class UrlController extends Controller
{
    protected $request;
    protected $url;
    protected $user;
    protected $urlTag;
    protected $tag;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     * 
     */
    public function __construct(Request $request, Url $url, User $user, UrlTag $urlTag, Tag $tag)
    {
        $this->request = $request;
        $this->url = $url;
        $this->user = $user;
        $this->urlTag = $urlTag;
        $this->tag = $tag;
    }

    public function getUrls()
    {
        $id = auth()->id();
        $urls = $this->user->with('urls','urls.tags')->findOrFail($id); 
        return $this->success(compact('urls'));
    }

    public function create(Request $request){
        $tags = explode(',' , $request->new_tags);
        $i = 0;
        $ids = array();
        for($i; $i < count($tags); $i++){
            $id = $this->createTag($tags[$i]);
            array_push($ids, $id);
        }
        $tags_ids = array_merge($ids,$request->tags);
        $this->url->name = $request->name;
        $this->url->address = $request->address;
        $this->url->privacy = $request->privacy;
        $this->url->user_id = auth()->id();
        $this->url->save();
        $this->url->tags()->sync($tags_ids);

        $url = $this->url->with('tags')->find($this->url->id);

        return $this->success(compact('url'));
    }

    public function createTag($tag){
        $i = 0;
        $tag_new = new Tag;
        $tag_new->name = $tag;
        $tag_new->save();
            
        return $tag_new->id;
    }

    public function update(Request $request, $id){
        $url = $this->isAuthorized($id);
        if(!$url){
            $response = $this->forbidden();
        }
        else{
            $url->name = $request->name;
            $url->address = $request->address;
            $url->privacy = $request->privacy;
            $url->tags()->sync($request->tags);
            $url->save();
            $url = $this->url->with('tags')->find($url->id);
            $response = $this->success(compact('url'));
        }

        return $response;
    }

    public function getAll(){
        $urls = $this->url->with('tags')->where('privacy','public')->get();

        return $this->success(compact('urls'));
    }

    public function getAllTags(){
        $tags = $this->tag->get();
        return $this->success(compact('tags'));
    }

    public function destroy($id){
        $url = $this->isAuthorized($id);
        if(!$url){
            $response = $this->forbidden();
        }
        else{
            $data = $url->delete();
            if($data)
                $data = 'URL deletada com sucesso!';
            $response = $this->success(compact('data'));
        }

        return $response;
    }

    //verifica se o usuario esta autorizado
    private function isAuthorized($id){
        $userId = auth()->id();
        $url = $this->url->with('tags')->find($id);
        $response = $url;
        if($url->user_id !== $userId){
            $response = false;
        }
        return $response;
    }
}
