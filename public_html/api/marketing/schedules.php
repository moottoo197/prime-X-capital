<?php
require_once dirname(__DIR__) . '/bootstrap.php';

sendSuccess([
    'schedules' => [
        [
            'session_name' => 'Session 1: 4 PM Signal',
            'slot' => 1,
            'release_time' => '4 PM',
            'release_time_utc' => '4 PM PKT',
            'window_minutes' => 15,
            'win_probability_estimate' => 97.2,
            'profit_return_percent' => 2.5
        ],
        [
            'session_name' => 'Session 2: 8 PM Signal',
            'slot' => 2,
            'release_time' => '8 PM',
            'release_time_utc' => '8 PM PKT',
            'window_minutes' => 15,
            'win_probability_estimate' => 98.1,
            'profit_return_percent' => 2.5
        ]
    ],
    'additional_rewards' => [
        [
            'tier_name' => 'Daily Doubler Protocol',
            'requirement' => 'Confirm both 4 PM & 8 PM signals daily',
            'benefit' => 'Funded deposit/admin-adjustment principal can earn up to 100% signal profit in 20 full days when both 4 PM & 8 PM signals are confirmed daily (2.5% per signal; 5% daily). Referral and other bonuses are separate.'
        ]
    ],
    'user_eligibility' => [
        'trading_days' => 1,
        'signal_volume' => 20,
        'current_tier' => 'Active 2-Signal Tier (4 AM & 8 AM)'
    ]
], 'Signal timetable loaded');
