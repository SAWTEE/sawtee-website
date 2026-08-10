<?php

use App\Exceptions\Handler;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Http\Request;
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
    $request = Request::create('/', 'GET');
    $request->headers->set('X-Inertia', 'true');

    $shared = (new HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy)->toHaveKey('location')
        ->and($ziggy)->not->toHaveKey('routes');
});

test('public document visits share only public ziggy routes', function () {
    $request = Request::create('/', 'GET');

    $shared = (new HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy)->toHaveKey('location')
        ->and($ziggy)->toHaveKey('routes')
        ->and($ziggy['routes'])->toHaveKey('home')
        ->and($ziggy['routes'])->toHaveKey('search')
        ->and($ziggy['routes'])->not->toHaveKey('admin.dashboard')
        ->and($ziggy['routes'])->not->toHaveKey('admin.posts.destroy')
        ->and($ziggy['routes'])->not->toHaveKey('boost.browser-logs')
        ->and($ziggy['routes'])->not->toHaveKey('ignition.executeSolution');
});

test('guest admin login shares auth ziggy routes without cms map', function () {
    $request = Request::create('/admin/login', 'GET');

    $shared = (new HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy['routes'])->toHaveKey('login')
        ->and($ziggy['routes'])->toHaveKey('password.request')
        ->and($ziggy['routes'])->not->toHaveKey('admin.dashboard')
        ->and($ziggy['routes'])->not->toHaveKey('home');
});

test('authenticated document visits share admin ziggy routes', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $request = Request::create('/admin/dashboard', 'GET');
    $request->setUserResolver(fn () => $user);

    $shared = (new HandleInertiaRequests)->share($request);
    $ziggy = value($shared['ziggy']);

    expect($ziggy)->toHaveKey('routes')
        ->and($ziggy['routes'])->toHaveKey('admin.dashboard')
        ->and($ziggy['routes'])->toHaveKey('admin.logout')
        ->and($ziggy['routes'])->toHaveKey('home')
        ->and($ziggy['routes'])->not->toHaveKey('boost.browser-logs');
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
    $handler = app(Handler::class);
    $request = Request::create('/admin/maintenance/clean', 'POST');
    $request->headers->set('referer', route('admin.maintenance.index'));
    $request->setLaravelSession(app('session.store'));

    $response = $handler->render($request, new TokenMismatchException);

    expect($response->isRedirect())->toBeTrue()
        ->and(session('message'))->not->toBeNull();
});
