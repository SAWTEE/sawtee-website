<?php

namespace App\Http\Controllers;

use App\Actions\Frontend\SearchContent;
use App\Http\Requests\SearchRequest;
use Inertia\Response;

class SearchController extends Controller
{
    public function __invoke(SearchRequest $request, SearchContent $searchContent): Response
    {
        return $searchContent->handle($request->filters());
    }
}
