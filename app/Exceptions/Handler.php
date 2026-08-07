<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Visitor-facing copy for common HTTP error statuses.
     *
     * @var array<int, string>
     */
    protected $messages = [
        403 => 'You do not have permission to view this page.',
        404 => 'The page you are looking for could not be found.',
        419 => 'Your session expired. Please reload the page and try again.',
        500 => 'Something went wrong on our servers.',
        503 => 'The site is temporarily unavailable. Please check back soon.',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $e)
    {
        // Prefer a valid Inertia redirect over the error modal for expired CSRF tokens.
        if ($e instanceof TokenMismatchException) {
            return back()->with(
                'message',
                $this->messages[419] ?? 'The page expired, please try again.'
            );
        }

        $response = parent::render($request, $e);
        $status = $response->getStatusCode();

        if ($status === 419) {
            return back()->with(
                'message',
                $this->messages[419] ?? 'The page expired, please try again.'
            );
        }

        if (! $this->shouldRenderBrandedError($request, $status)) {
            return $response;
        }

        // Non-Inertia form posts: flash and return so the UI can show the message.
        if (! $request->header('X-Inertia') && ! $request->isMethod('GET')) {
            return back()
                ->setStatusCode($status)
                ->with('error', $this->messages[$status]);
        }

        return Inertia::render('Errors/Error', [
            'status' => $status,
            'message' => $this->messages[$status],
            'admin' => $request->is('admin', 'admin/*'),
        ])
            ->toResponse($request)
            ->setStatusCode($status);
    }

    /**
     * Use branded Inertia error pages outside local debug sessions.
     */
    protected function shouldRenderBrandedError(Request $request, int $status): bool
    {
        if (! array_key_exists($status, $this->messages)) {
            return false;
        }

        // Preserve Ignition / detailed exception pages for local debugging.
        if (config('app.debug') && app()->environment(['local', 'development'])) {
            return false;
        }

        // API / JSON clients keep the framework JSON error payload.
        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return false;
        }

        return true;
    }
}
