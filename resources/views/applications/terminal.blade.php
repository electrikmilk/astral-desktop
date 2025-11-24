@extends('master')

@section('head')
    @vite(['resources/apps/terminal/index.js', 'resources/apps/terminal/index.css'])
@endsection

@section('content')
    <div class="tty">
        <canvas id="tty"
                width="640"
                height="480"></canvas>
    </div>
@endsection
