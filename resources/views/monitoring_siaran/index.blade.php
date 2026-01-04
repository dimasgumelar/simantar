@extends('layouts.app')

@section('content')
<div class="container">

<h4>Monitoring Siaran</h4>

<form method="GET" class="mb-3">
<select name="id_konten">
<option value="">-- Konten --</option>
<option>TVRI World</option>
<option>TVRI Nasional</option>
<option>TVRI Sport</option>
<option>TVRI Jawa Timur</option>
</select>

<select name="hasil">
<option value="">-- Hasil --</option>
<option>Normal</option>
<option>Gangguan</option>
</select>

<button class="btn btn-secondary btn-sm">Filter</button>
</form>

<hr>

<form method="POST" action="{{ route('monitoring-siaran.store') }}">
@csrf

<input class="form-control mb-2" value="{{ auth()->user()->name }}" readonly>

<select name="id_transmisi" class="form-control mb-2">
<option>TVRI Pusat Jatim</option>
<option>Surabaya</option>
<option>Gn Doek</option>
<option>Oro Oro Ombo</option>
<option>Gn Brengik</option>
<option>Gn Gending</option>
<option>Alas Malang</option>
<option>Besuki</option>
<option>Tuban</option>
<option>Cemorosewu</option>
<option>Gn Pandan</option>
<option>Gn Brengos</option>
<option>Wonogondo</option>
</select>

<select name="id_konten" id="konten" class="form-control mb-2">
<option>TVRI World</option>
<option>TVRI Nasional</option>
<option>TVRI Sport</option>
<option>TVRI Jawa Timur</option>
</select>

<select name="sumber_input" id="sumber" class="form-control mb-2">
<option>Downlink Parabola</option>
<option>MCPC</option>
<option>FO</option>
</select>

<input name="nama_acara" class="form-control mb-2" placeholder="Nama Acara">

<select name="kategori" class="form-control mb-2">
<option>Live</option>
<option>Record</option>
</select>

<input type="time" name="jam_mulai" class="form-control mb-2">

<select name="hasil" id="hasil" class="form-control mb-2">
<option>Normal</option>
<option>Gangguan</option>
</select>

<div id="gangguan" style="display:none">
<select name="jenis_gangguan" class="form-control mb-2">
<option>Video Blank</option>
<option>Video Freeze</option>
<option>Video Glitch</option>
<option>Audio Hilang</option>
<option>Gangguan Lainnya</option>
</select>

<textarea name="penyebab_gangguan" class="form-control mb-2" placeholder="Penyebab"></textarea>
<textarea name="penanganan_gangguan" class="form-control mb-2" placeholder="Penanganan"></textarea>
</div>

<button class="btn btn-primary">Simpan</button>
</form>

<hr>

<table class="table table-bordered mt-3">
<tr>
<th>Pengisi</th>
<th>Konten</th>
<th>Hasil</th>
<th>Aksi</th>
</tr>

@foreach($data as $d)
<tr>
<td>{{ $d->user->name }}</td>
<td>{{ $d->id_konten }}</td>
<td>{{ $d->hasil }}</td>
<td>
<form method="POST" action="{{ route('monitoring-siaran.destroy',$d) }}">
@csrf
@method('DELETE')
<button class="btn btn-danger btn-sm">Hapus</button>
</form>
</td>
</tr>
@endforeach
</table>

</div>

<script>
document.getElementById('konten').onchange = function(){
 let s = document.getElementById('sumber');
 if(this.value !== 'TVRI Jawa Timur'){
   s.value = 'Downlink Parabola';
   s.disabled = true;
 } else {
   s.disabled = false;
 }
};

document.getElementById('hasil').onchange = function(){
 document.getElementById('gangguan').style.display =
   this.value === 'Gangguan' ? 'block' : 'none';
};
</script>
@endsection
