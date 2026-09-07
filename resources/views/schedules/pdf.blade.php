<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jadwal Dinas</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 8px;
            color: #111;
        }
        h1 {
            font-size: 14px;
            margin: 0 0 2px 0;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            margin: 0 0 2px 0;
            font-size: 11px;
        }
        .range {
            text-align: center;
            margin: 0 0 12px 0;
            font-size: 9px;
            color: #555;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        table.data th, table.data td {
            border: 1px solid #999;
            padding: 3px 2px;
            text-align: center;
            overflow: hidden;
        }
        table.data th.name, table.data td.name {
            text-align: left;
            width: 90px;
        }
        table.data thead th {
            background-color: #eee;
        }
        h2.month {
            font-size: 11px;
            margin: 14px 0 6px 0;
            border-bottom: 1px solid #333;
            padding-bottom: 3px;
        }
        h2.month:first-of-type {
            margin-top: 0;
        }
        .empty {
            font-size: 10px;
            font-style: italic;
            color: #666;
        }
        .legend {
            margin-top: 10px;
            font-size: 8px;
            color: #444;
        }
        .legend span {
            margin-right: 14px;
        }
        .legend b {
            color: #111;
        }
        .footer {
            margin-top: 16px;
            font-size: 8px;
            color: #666;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>JADWAL DINAS TRANSMISI</h1>
    <div class="subtitle">{{ $transmission->name }}</div>
    <div class="range">
        {{ \Carbon\Carbon::parse($startDate)->format('d-m-Y') }}
        s/d
        {{ \Carbon\Carbon::parse($endDate)->format('d-m-Y') }}
    </div>

    @if ($employees->isEmpty())
        <p class="empty">Belum ada pegawai yang terhubung ke transmisi ini.</p>
    @else
        @foreach ($monthGroups as $monthGroup)
            <h2 class="month">{{ $monthGroup['label'] }}</h2>
            <table class="data">
                <thead>
                    <tr>
                        <th class="name">Pegawai</th>
                        @foreach ($monthGroup['dates'] as $date)
                            <th>{{ \Carbon\Carbon::parse($date)->format('d') }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach ($employees as $employee)
                        <tr>
                            <td class="name">{{ $employee->name }}</td>
                            @foreach ($monthGroup['dates'] as $date)
                                <td>{{ $entries[$employee->user_id][$date] ?? '-' }}</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endforeach

        @if ($shiftLegend)
            <div class="legend">
                @foreach ($shiftLegend as $code => $label)
                    <span><b>{{ $code }}</b> = {{ $label }}</span>
                @endforeach
            </div>
        @endif
    @endif

    <div class="footer">
        Dicetak pada {{ \Carbon\Carbon::now()->format('d-m-Y H:i') }}
    </div>
</body>
</html>
