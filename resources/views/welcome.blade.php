<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Laravel + React</title>
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