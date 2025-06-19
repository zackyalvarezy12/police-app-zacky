
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>App Police</title>
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/images/logo/favicon.png') }}" />

    <!-- Bootstrap 5.3 CDN CSS (for Modal, etc.) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom Styles -->
    <link rel="stylesheet" href="{{ asset('assets/css/styles.min.css') }}" />
    <link rel="stylesheet" href="http://cdn.datatables.net/2.3.1/css/dataTables.dataTables.min.css">
</head>

<body>
    <!-- Body Wrapper -->
    <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">

        <!-- App Topstrip -->
        <div class="app-topstrip bg-dark py-6 px-3 w-100 d-lg-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center justify-content-center gap-5 mb-2 mb-lg-0">
            </div>
        </div>

        <!-- Sidebar Start -->
        @include('components.sidebar')
        <!-- Sidebar End -->

        <!-- Main Wrapper -->
        <div class="body-wrapper">
            <!-- Header Start -->
            @include('components.navbar')
            <!-- Header End -->

            <div class="body-wrapper-inner">
                <div class="container-fluid">
                    <!-- Page Content -->
                    @yield('content')

                    @include('components.footer')
                </div>
            </div>
        </div>
    </div>

    <!-- JS Libraries -->
    <script src="{{ asset('assets/libs/jquery/dist/jquery.min.js') }}"></script>

    <!-- Bootstrap 5.3 CDN JS (for Modal, etc.) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Other Local JS -->
    <script src="{{ asset('assets/js/sidebarmenu.js') }}"></script>
    <script src="{{ asset('assets/js/app.min.js') }}"></script>
    <script src="{{ asset('assets/libs/apexcharts/dist/apexcharts.min.js') }}"></script>
    <script src="{{ asset('assets/libs/simplebar/dist/simplebar.js') }}"></script>
    <script src="{{ asset('assets/js/dashboard.js') }}"></script>



    <script src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js"></script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>


    <script src="https://cdn.datatables.net/2.3.1/js/dataTables.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


    <script src="{{ asset('js/utils.js') }}"></script>
    <script src="{{ asset('js/dashboard.js') }}"></script>
    <script src="{{ asset('js/vehicles.js') }}"></script>
    <script src="{{ asset('js/officers.js') }}"></script>


    @yield('scripts')
</body>

</html>
