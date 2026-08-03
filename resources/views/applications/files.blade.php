@extends('master')

@section('title', 'Files')

@section('head')
    @vite(['resources/apps/files/index.js', 'resources/apps/files/index.css'])
@endsection

@section('content')
    <div id="app"></div>
@endsection
