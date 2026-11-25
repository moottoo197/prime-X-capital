<?php
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/additional_signals.php';

sendSuccess([
    'schedules' => [
        [
            'session_name' => 'First Signal: 6:00 PM PKT',
            'slot' => 1,
            'release_time' => '6:00 PM',
            'release_time_utc' => '6:00 PM PKT (1:00 PM UTC)',
            'window_minutes' => 15,
            'win_probability_estimate' => 97.6,
            'profit_return_percent' => 1.67
        ],
        [
            'session_name' => 'Second Signal: 8:00 PM PKT',
            'slot' => 2,
            'release_time' => '8:00 PM',
            'release_time_utc' => '8:00 PM PKT (3:00 PM UTC)',
            'window_minutes' => 15,
            'win_probability_estimate' => 98.2,
            'profit_return_percent' => 1.67
        ],
        [
            'session_name' => 'Additional Signal: 9:30 PM PKT',
            'slot' => 3,
            'release_time' => '9:30 PM',
            'release_time_utc' => '9:30 PM PKT (4:30 PM UTC)',
            'window_minutes' => 15,
            'win_probability_estimate' => 98.8,
            'profit_return_percent' => 0,
            'reward_usdt' => 4.00
        ]
    ],
    'additional_rewards' => [
        [
            'tier_name' => '30-Day 2× Doubler Plan',
            'requirement' => 'Confirm 6:00 PM & 8:00 PM signals daily (Min $100 deposit)',
            'benefit' => 'Funded deposit principal earns 1.67% per session (3.33%/day) to double in 30 days.'
        ],
        [
            'tier_name' => 'Additional Signal Rewards ($4.00 Fixed)',
            'requirement' => 'Deposit $300+ or invite a friend who deposits $300+ (both receive credits)',
            'benefit' => 'Each Additional Signal at 9:30 PM PKT pays $4.00 USDT fixed, completely separate from your 30-day 2× plan.'
        ]
    ],
    'additional_signal_tiers' => primex_additional_signal_tiers(),
    'user_eligibility' => [
        'trading_days' => 1,
        'signal_volume' => 100,
        'current_tier' => '6:00 PM & 8:00 PM Daily + 9:30 PM Additional'
    ]
], 'Signal timetable loaded');
