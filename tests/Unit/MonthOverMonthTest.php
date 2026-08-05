<?php

use App\Support\MonthOverMonth;

test('percent change is positive when current exceeds previous', function () {
    expect(MonthOverMonth::percentChange(4, 2))->toBe(100.0);
});

test('percent change is negative when current is below previous', function () {
    expect(MonthOverMonth::percentChange(1, 2))->toBe(-50.0);
});

test('percent change is zero when current equals previous', function () {
    expect(MonthOverMonth::percentChange(3, 3))->toBe(0.0);
});

test('percent change is 100 when previous is zero and current is positive', function () {
    expect(MonthOverMonth::percentChange(5, 0))->toBe(100.0);
});

test('percent change is zero when previous and current are both zero', function () {
    expect(MonthOverMonth::percentChange(0, 0))->toBe(0.0);
});

test('direction is up for positive percent', function () {
    expect(MonthOverMonth::direction(12.5))->toBe('up');
});

test('direction is down for negative percent', function () {
    expect(MonthOverMonth::direction(-8.0))->toBe('down');
});

test('direction is neutral for zero percent', function () {
    expect(MonthOverMonth::direction(0.0))->toBe('neutral');
});
