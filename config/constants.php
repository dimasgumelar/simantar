<?php

return [
    'file_category' => [
        [
            "label" => "Tidak Diketahui",
            "value" => 1,
        ],
        [
            "label" => "Jadwal",
            "value" => 2,
        ],
        [
            "label" => "Juknis",
            "value" => 3,
        ],
        [
            "label" => "Wiring",
            "value" => 4,
        ],
    ],
    'inventory_transactions_status' => [
        [
            "label" => "Keluar",
            "value" => 0,
            "list" => [
                [
                    "label" => "Pinjam",
                    "value" => 1,
                ],
                [
                    "label" => "Serahkan ke Transmisi",
                    "value" => 2,
                ],
                [
                    "label" => "Serahkan ke Pihak Ketiga",
                    "value" => 3,
                ]
            ]
        ],
        [
            "label" => "Masuk",
            "value" => 1,
            "list" => [
                [
                    "label" => "Kembalikan",
                    "value" => 4,
                ],
                [
                    "label" => "Alat Baru",
                    "value" => 5,
                ],
                [
                    "label" => "Alat dari Transmisi Lain",
                    "value" => 6,
                ],
            ]
        ]
    ],
    'inventory_transactions_status_name' => [
        [
            "label" => "Pinjam",
            "value" => 1,
        ],
        [
            "label" => "Serahkan ke Transmisi",
            "value" => 2,
        ],
        [
            "label" => "Serahkan ke Pihak Ketiga",
            "value" => 3,
        ],
        [
            "label" => "Kembalikan",
            "value" => 4,
        ],
        [
            "label" => "Alat Baru",
            "value" => 5,
        ],
        [
            "label" => "Alat dari Transmisi Lain",
            "value" => 6,
        ],
    ],
];