<?php
$hariIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
$bulanIndo = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatTanggalIndo($date, $hariIndo, $bulanIndo)
{
    return $hariIndo[$date->dayOfWeek] . ', ' . $date->format('d') . ' ' . $bulanIndo[(int) $date->format('n')] . ' ' . $date->format('Y');
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Logbook Siaran</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
            color: #111;
        }
        h1 {
            font-size: 16px;
            margin: 0 0 2px 0;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            margin: 0 0 16px 0;
            font-size: 12px;
        }
        table.info {
            width: 100%;
            margin-bottom: 14px;
        }
        table.info td {
            padding: 2px 0;
            vertical-align: top;
        }
        table.info td.label {
            width: 110px;
            font-weight: bold;
        }
        table.info td.sep {
            width: 10px;
        }
        h2 {
            font-size: 12px;
            margin: 16px 0 6px 0;
            border-bottom: 1px solid #333;
            padding-bottom: 3px;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }
        table.data th, table.data td {
            border: 1px solid #999;
            padding: 4px 6px;
            text-align: left;
            font-size: 10px;
        }
        table.data th {
            background-color: #eee;
        }
        .empty {
            font-size: 10px;
            font-style: italic;
            color: #666;
        }
        .badge {
            display: inline-block;
            border: 1px solid #999;
            border-radius: 3px;
            padding: 1px 6px;
            margin: 0 4px 4px 0;
            font-size: 10px;
        }
        .footer {
            margin-top: 24px;
            font-size: 9px;
            color: #666;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>LOGBOOK SIARAN</h1>
    <div class="subtitle">{{ $logbook->transmission->name }}</div>

    <table class="info">
        <tr>
            <td class="label">Transmisi</td>
            <td class="sep">:</td>
            <td>{{ $logbook->transmission->name }}</td>
        </tr>
        <tr>
            <td class="label">Tanggal</td>
            <td class="sep">:</td>
            <td>{{ formatTanggalIndo($logbook->tanggal, $hariIndo, $bulanIndo) }}</td>
        </tr>
        <tr>
            <td class="label">Petugas</td>
            <td class="sep">:</td>
            <td>
                @if ($logbook->petugasList->isEmpty())
                    <span class="empty">Belum ada yang menandatangani.</span>
                @else
                    @foreach ($logbook->petugasList as $petugas)
                        {{ $petugas->name }} (TTD {{ \Carbon\Carbon::parse($petugas->pivot->signed_at)->format('d-m-Y H:i') }}){{ !$loop->last ? ', ' : '' }}
                    @endforeach
                @endif
            </td>
        </tr>
    </table>

    <h2>Power Transmisi</h2>
    @if ($logbook->powers->isEmpty())
        <p class="empty">Belum ada catatan power.</p>
    @else
        @foreach ($logbook->powers as $power)
            <span class="badge">{{ $power->power }} W &middot; {{ \Carbon\Carbon::parse($power->created_at)->format('d-m-Y H:i') }}</span>
        @endforeach
    @endif

    <h2>Acara</h2>
    @if ($logbook->events->isEmpty())
        <p class="empty">Belum ada acara.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 24px;">No</th>
                    <th style="width: 70px;">Jam Mulai</th>
                    <th style="width: 70px;">Jam Selesai</th>
                    <th>Acara</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($logbook->events as $event)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ substr($event->start_time, 0, 5) }}</td>
                        <td>{{ substr($event->end_time, 0, 5) }}</td>
                        <td>{{ $event->name }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>Keterangan</h2>
    @if ($logbook->notes->isEmpty())
        <p class="empty">Belum ada keterangan.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 24px;">No</th>
                    <th style="width: 60px;">Kategori</th>
                    <th style="width: 70px;">Jam Mulai</th>
                    <th style="width: 70px;">Jam Akhir</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($logbook->notes as $note)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ ucfirst($note->category) }}</td>
                        <td>{{ substr($note->start_time, 0, 5) }}</td>
                        <td>{{ substr($note->end_time, 0, 5) }}</td>
                        <td>{{ $note->notes }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>Buku Tamu</h2>
    @if ($logbook->guestBooks->isEmpty())
        <p class="empty">Belum ada data buku tamu.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 24px;">No</th>
                    <th>Nama</th>
                    <th>Instansi / Asal</th>
                    <th>Keperluan</th>
                    <th>No. Telepon</th>
                    <th style="width: 60px;">Jam Masuk</th>
                    <th style="width: 60px;">Jam Keluar</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($logbook->guestBooks as $guestBook)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $guestBook->name }}</td>
                        <td>{{ $guestBook->institution }}</td>
                        <td>{{ $guestBook->purpose }}</td>
                        <td>{{ $guestBook->phone }}</td>
                        <td>{{ $guestBook->time_in ? substr($guestBook->time_in, 0, 5) : '' }}</td>
                        <td>{{ $guestBook->time_out ? substr($guestBook->time_out, 0, 5) : '' }}</td>
                        <td>{{ $guestBook->notes }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        Dicetak pada {{ \Carbon\Carbon::now()->format('d-m-Y H:i') }}
    </div>
</body>
</html>
