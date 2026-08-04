<?php

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;

test('login screen can be rendered', function () {
    $response = $this->get('/admin/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(RouteServiceProvider::HOME);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/logout');

    $this->assertGuest();
    $response->assertRedirect('/admin/login');
});

test('login with remember=true sets the remember cookie and token', function () {
    $user = User::factory()->create([
        'remember_token' => null,
    ]);

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(RouteServiceProvider::HOME);

    $recaller = Auth::guard('web')->getRecallerName();
    $response->assertCookie($recaller);

    expect($user->fresh()->remember_token)->not->toBeNull()
        ->and(Auth::viaRemember())->toBeFalse(); // viaRemember is for subsequent requests
});

test('login without remember does not set the remember cookie', function () {
    $user = User::factory()->create([
        'remember_token' => null,
    ]);

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => false,
    ]);

    $this->assertAuthenticated();

    $recaller = Auth::guard('web')->getRecallerName();
    $response->assertCookieMissing($recaller);

    expect($user->fresh()->remember_token)->toBeNull();
});

test('remember cookie payload is shaped for Auth::viaRemember', function () {
    $user = User::factory()->create();

    $login = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $recaller = Auth::guard('web')->getRecallerName();
    $cookie = $login->getCookie($recaller);
    expect($cookie)->not->toBeNull();

    $user = $user->fresh();
    // Recaller format: id|remember_token|password_hash — consumed by viaRemember.
    expect($cookie->getValue())
        ->toStartWith($user->id.'|'.$user->remember_token.'|');
});

test('json login with remember=true sets the remember cookie', function () {
    $user = User::factory()->create([
        'remember_token' => null,
    ]);

    $response = $this->postJson('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $this->assertAuthenticated();
    $response->assertCookie(Auth::guard('web')->getRecallerName());
    expect($user->fresh()->remember_token)->not->toBeNull();
});
