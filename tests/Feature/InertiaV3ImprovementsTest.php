<?php

use App\Models\User;
use Illuminate\Session\TokenMismatchException;
use Inertia\Testing\AssertableInertia as Assert;

test('shared auth user is limited to safe fields', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', $user->name)
            ->where('auth.user.email', $user->email)
            ->missing('auth.user.password')
            ->missing('auth.user.remember_token')
        );
});

test('admin pages do not share frontend menus', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->missing('primaryMenu')
            ->missing('footerMenu')
        );
});

test('inertia xhr visits only share ziggy location', function () {
    $request = \Illuminate\Http\Request::create('/admin/dashboard', 'GET');
    $request->headers->set('X-Inertia', 'true');

    $shared = (new \App\Http\Middleware\HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy)->toHaveKey('location')
        ->and($ziggy)->not->toHaveKey('routes');
});

test('full document visits share complete ziggy routes', function () {
    $request = \Illuminate\Http\Request::create('/admin/dashboard', 'GET');

    $shared = (new \App\Http\Middleware\HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy)->toHaveKey('location')
        ->and($ziggy)->toHaveKey('routes');
});

test('dashboard defers analytics props', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Backend/Dashboard')
            ->missing('analytics')
            ->loadDeferredProps('default', fn (Assert $reload) => $reload
                ->has('analytics.views_today')
                ->has('analytics.views_this_week')
                ->has('analytics.views_this_month')
                ->has('analytics.top_pages')
            )
        );
});

test('home page defers below-the-fold sections', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('slides')
            ->missing('events')
            ->missing('publications')
            ->loadDeferredProps('below', fn (Assert $reload) => $reload
                ->has('events')
                ->has('publications')
                ->has('sawteeInMedia')
                ->has('newsletters')
                ->has('webinars')
            )
        );
});

test('token mismatch exception is converted to a redirect with message', function () {
    $handler = app(\App\Exceptions\Handler::class);
    $request = \Illuminate\Http\Request::create('/admin/maintenance/clean', 'POST');
    $request->headers->set('referer', route('admin.maintenance.index'));
    $request->setLaravelSession(app('session.store'));

    $response = $handler->render($request, new TokenMismatchException);

    expect($response->isRedirect())->toBeTrue()
        ->and(session('message'))->not->toBeNull();
});
