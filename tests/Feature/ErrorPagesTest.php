<?php

use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // Branded pages are skipped only for local/development + debug.
    config(['app.debug' => false]);
});

test('unknown routes render branded inertia 404 page', function () {
    $this->get('/this-route-definitely-does-not-exist-sawtee')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/Error')
            ->where('status', 404)
            ->where('admin', false)
            ->has('message')
        );
});

test('admin unknown routes mark error page as admin', function () {
    $this->get('/admin/this-route-definitely-does-not-exist-sawtee')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/Error')
            ->where('status', 404)
            ->where('admin', true)
        );
});

test('json clients still receive json 404 payloads', function () {
    $this->getJson('/this-route-definitely-does-not-exist-sawtee')
        ->assertNotFound()
        ->assertHeader('content-type', 'application/json')
        ->assertJsonStructure(['message']);
});
