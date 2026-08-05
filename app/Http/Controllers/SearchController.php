<?php

namespace App\Http\Controllers;

use App\Actions\Frontend\SearchContent;
use Illuminate\Http\Request;
use Inertia\Response;

class SearchController extends Controller
{
    public function __invoke(Request $request, SearchContent $searchContent): Response
    {
        return $searchContent->handle($request);
    }
}
