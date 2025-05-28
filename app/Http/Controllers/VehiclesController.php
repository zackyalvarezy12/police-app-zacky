<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Auth;

class VehiclesController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::where('user_id', Auth::id())->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan ditemukan',
            'data' => $vehicles
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string|unique:vehicles',
            'type' => 'required|string',
            'brand' => 'required|string',
            'color' => 'required|string',
            'is_stolen' => 'boolean',
        ],[
            'license_plate.required' => 'Nomor plat kendaraan wajib diisi',
            'license_plate.unique' => 'Nomor plat kendaraan sudah terdaftar',
            'type.required' => 'Tipe kendaraan wajib diisi',
            'brand.required' => 'Merek kendaraan wajib diisi',
            'color.required' => 'Warna kendaraan wajib diisi',
        ]);

        $vehicle = Vehicle::create([
            'user_id' => Auth::id(),
            'license_plate' => $request->license_plate,
            'type' => $request->type,
            'brand' => $request->brand,
            'color' => $request->color,
            'is_stolen' => $request->is_stolen ?? false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan berhasil ditambahkan',
            'data' => $vehicle
        ], 201);
    }

    public function show($id)
    {
        $vehicle = Vehicle::where('user_id', Auth::id())->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan ditemukan',
            'data' => $vehicle
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'license_plate' => 'string|unique:vehicles,license_plate,' . $vehicle->id,
            'type' => 'string',
            'brand' => 'string',
            'color' => 'string',
            'is_stolen' => 'boolean',
        ], [
            'license_plate.unique' => 'Nomor plat kendaraan sudah terdaftar',
            'type.required' => 'Tipe kendaraan wajib diisi',
            'brand.required' => 'Merek kendaraan wajib diisi',
            'color.required' => 'Warna kendaraan wajib diisi',
        ]);

        $vehicle->update($request->only('license_plate', 'type', 'brand', 'color', 'is_stolen'));

        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan berhasil diubah',
            'data' => $vehicle
        ], 200);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::where('user_id', Auth::id())->findOrFail($id);
        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan berhasil dihapus',
            'data' => []
        ]);
    }

    public function indexPage()
    {
        return view('vehicles.index');
    }
}
