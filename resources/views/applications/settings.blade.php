@extends('master')

@section('title', 'Settings')

@section('head')
    @vite(['resources/apps/settings/index.js', 'resources/apps/settings/index.css'])
@endsection

@section('content')
    <div id="app"></div>
@endsection
