@extends('components.master')

@section('content')
<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ url('/dashboard') }}">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Officers</li>
    </ol>
</nav>

<!-- Tombol Tambah -->
<button type="button" class="btn btn-primary mb-3" id="addOfficerBtn" data-bs-toggle="modal" data-bs-target="#createOfficerModal">
    Tambah Officer
</button>

<!-- Tabel Officers -->
<table class="table table-striped" id="officersTable">
    <thead class="bg-primary text-white">
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Badge Number</th>
            <th>Rank</th>
            <th>Assigned Area</th>
            <th>Option</th>
        </tr>
    </thead>
    <tbody id="officersTableBody">
        {{-- Data diisi oleh JS --}}
    </tbody>
</table>

<!-- Modal Create -->
<div class="modal fade" id="createOfficerModal" tabindex="-1" aria-labelledby="createOfficerModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="createOfficerForm">
                <div class="modal-header">
                    <h5 class="modal-title">Create New Officer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    @foreach (['Name', 'BadgeNumber', 'Rank', 'AssignedArea'] as $field)
                    <div class="mb-3">
                        <label for="create{{ $field }}" class="form-label">{{ str_replace('Number', ' Number', $field) }}</label>
                        <input type="text" class="form-control" id="create{{ $field }}">
                        <small id="create{{ $field }}Error" class="text-danger"></small>
                    </div>
                    @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Save Officer</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal Edit -->
<div class="modal fade" id="editOfficerModal" tabindex="-1" aria-labelledby="editOfficerModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="editOfficerForm">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Officer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editOfficerId">
                    @foreach (['Name', 'BadgeNumber', 'Rank', 'AssignedArea'] as $field)
                    <div class="mb-3">
                        <label for="edit{{ $field }}" class="form-label">{{ str_replace('Number', ' Number', $field) }}</label>
                        <input type="text" class="form-control" id="edit{{ $field }}">
                        <small id="edit{{ $field }}Error" class="text-danger"></small>
                    </div>
                    @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Update Officer</button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection
