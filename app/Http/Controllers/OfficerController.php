<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Officer;
use Illuminate\Support\Facades\Auth;


class OfficerController extends Controller
{
    public function index()
    {
        $officers = Officer::all();

        return response()->json(
            [
                'status' => 'success',
                'message' => 'Data petugas ditemukan',
                'data' => $officers,
            ],
            200,
        );
    }

    public function store(Request $request)
    {
        $request->validate(
            [
                'name' => 'required|string|max:255',
                'badge_number' => 'required|string|max:50|unique:officers',
                'rank' => 'required|string|max:50',
                'assigned_area' => 'required|string|max:255',
            ],
            [
                'name.required' => 'Nama petugas wajib diisi',
                'badge_number.required' => 'Nomor badge wajib diisi',
                'badge_number.unique' => 'Nomor badge sudah terdaftar',
                'rank.required' => 'Pangkat wajib diisi',
                'assigned_area.required' => 'Area penugasan wajib diisi',
            ],
        );

        $officer = Officer::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'badge_number' => $request->badge_number,
            'rank' => $request->rank,
            'assigned_area' => $request->assigned_area,
        ]);

        return response()->json(
            [
                'status' => 'success',
                'message' => 'Data petugas berhasil ditambahkan',
                'data' => $officer,
            ],
            201,
        );
    }
    public function show($id)
    {
        $officer = Officer::findOrFail($id);

        return response()->json(
            [
                'status' => 'success',
                'message' => 'Data petugas ditemukan',
                'data' => $officer,
            ],
            200,
        );
    }

    public function update(Request $request, $id)
    {
        $officer = Officer::findOrFail($id);

        $request->validate(
            [
                'name' => 'string',
                'badge_number' => 'string|unique:officers,badge_number,' . $officer->id,
                'rank' => 'string',
                'assigned_area' => 'string',
            ],
            [
                'badge_number.unique' => 'Nomor badge sudah terdaftar',
            ],
        );

        $officer->update($request->only('name', 'badge_number', 'rank', 'assigned_area'));

        return response()->json(
            [
                'status' => 'success',
                'message' => 'Data petugas berhasil diubah',
                'data' => $officer,
            ],
            200,
        );
    }

    public function destroy($id)
    {
        $officer = Officer::findOrFail($id);
        $officer->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data petugas berhasil dihapus',
            'data' => [],
        ]);
    }

    public function indexPage()
    {
        return view('officers.index');
    }
}
