<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description"
        content="E-DTC - Web Class Academy. Platform pembelajaran online dengan akses ke materi kelas, tinjauan pustaka, dan konten edukatif.">
    <title>E-DTC - Web Class Academy</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <link rel="shortcut icon" type="image/png" href="/images/logo.png">
    <script>
        // Polyfill for draft-js global reference
        if (typeof global === 'undefined') {
            var global = globalThis;
        }
    </script>
    @viteReactRefresh
    @vite('resources/js/App.jsx')
</head>

<body class="antialiased">
    <div id="app"></div>
</body>

</html>