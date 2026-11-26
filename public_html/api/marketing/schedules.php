<?php
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/additional_signals.php';

sendSuccess([
    'schedules' => [
        [
            'session_name' => 'First Daily Signal',
            'slot' => 1,
            'release_time' => 'Live Alert',
            'release_time_utc' => 'Global Session',
            'window_minutes' => 15,
            'win_probability_estimate' => 97.6,
            'profit_return_percent' => 1.67
        ],
        [
            'session_name' => 'Second Daily Signal',
            'slot' => 2,
            'release_time' => 'Live Alert',
            'release_time_utc' => 'Global Session',
            'window_minutes' => 15,
            'win_probability_estimate' => 98.2,
            'profit_return_percent' => 1.67
        ],
        [
            'session_name' => 'Additional Signal',
            'slot' => 3,
            'release_time' => 'Bonus Alert',
            'release_time_utc' => 'Global Session',
            'window_minutes' => 15,
            'win_probability_estimate' => 98.8,
            'profit_return_percent' => 0
        ]
    ],
    'additional_rewards' => [
        [
            'tier_name' => '30-Day 2× Doubler Plan',
            'requirement' => 'Confirm daily signals (Min $100 deposit)',
            'benefit' => 'Funded deposit principal earns 1.67% per session (3.33%/day) to double in 30 days.'
        ],
        [
            'tier_name' => 'Additional Signal Rewards',
            'requirement' => 'Deposit $300+ or invite a friend who deposits $300+ (both receive credits)',
            'benefit' => 'Additional Signals credit an instant bonus separate from your 30-day 2× plan (max 1 per day).'
        ]
    ],
    'additional_signal_tiers' => primex_additional_signal_tiers(),
    'user_eligibility' => [
        'trading_days' => 1,
        'signal_volume' => 100,
        'current_tier' => 'Daily Signals + Additional Credits'
    ]
], 'Signal overview loaded');
