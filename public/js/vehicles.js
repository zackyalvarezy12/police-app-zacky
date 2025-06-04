if (window.location.pathname.includes('/panel-control/vehicles')) {
    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const token = decodeURIComponent(getCookie('token'));

            if (!token) {
                console.warn("Token tidak ditemukan di cookie.");
                window.location.href = '/';
                return;
            }

            const response = await axios.get('/api/panel-control/vehicles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            displayVehicles(response.data.data)
        } catch (error) {
            console.error("Gagal memuat kendaraan:", error);

            let errorMessage = "Terjadi kesalahan saat memuat data.";
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }

            showErrorToast(errorMessage);

            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                window.location.href = '/';
            }
        }

        document.getElementById("addVehicleBtn").addEventListener("click", function () {
            clearCreateFormErrors();
            document.getElementById("createVehicleForm").reset();
        });

        // create vehicle
        document.getElementById("createVehicleForm").addEventListener("submit", addVehicle);

        // edit vehicle
        document.getElementById("editVehicleForm").addEventListener("submit", updateVehicle);
    });

    function showErrorToast(message) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'error',
            title: message,
        });
    }

    function clearCreateFormErrors() {
        document.getElementById("createLicensePlateError").textContent = "";
        document.getElementById("createTypeError").textContent = "";
        document.getElementById("createBrandError").textContent = "";
        document.getElementById("createColorError").textContent = "";
        document.getElementById("createIsStolenError").textContent = "";
    }

    function clearEditFormErrors() {
        document.getElementById("editLicensePlateError").textContent = "";
        document.getElementById("editTypeError").textContent = "";
        document.getElementById("editBrandError").textContent = "";
        document.getElementById("editColorError").textContent = "";
        document.getElementById("editIsStolenError").textContent = "";
    }


    async function addVehicle(event) {
        event.preventDefault();
        clearCreateFormErrors();

        const token = decodeURIComponent(getCookie('token'));
        const licensePlate = document.getElementById("createLicensePlate").value.trim();
        const type = document.getElementById("createType").value.trim();
        const brand = document.getElementById("createBrand").value.trim();
        const color = document.getElementById("createColor").value.trim();
        const isStolen = document.querySelector('input[name="createIsStolen"]:checked')?.value === '1';

        try {
            const response = await axios.post('/api/panel-control/vehicles', {
                license_plate: licensePlate,
                type: type,
                brand: brand,
                color: color,
                is_stolen: isStolen
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            $('#createVehicleModal').modal('hide');

            setTimeout(() => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'success',
                    title: response.data.message
                });
            }, 300);

            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                if (errors.license_plate) document.getElementById("createLicensePlateError").textContent = errors.license_plate[0];
                if (errors.type) document.getElementById("createTypeError").textContent = errors.type[0];
                if (errors.brand) document.getElementById("createBrandError").textContent = errors.brand[0];
                if (errors.color) document.getElementById("createColorError").textContent = errors.color[0];
                if (errors.is_stolen) document.getElementById("createIsStolenError").textContent = errors.is_stolen[0];
            } else {
                const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menambahkan kendaraan.";
                showErrorToast(errorMessage);
            }
        }
    }

    function displayVehicles(data) {
        const tableBody = document.getElementById("vehiclesTableBody");
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Data not available</td></tr>`;
            return;
        }

        window.vehicleData = data; // menyimpan data pada scope global

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${item.license_plate}</td>
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.color}</td>
                <td>${item.is_stolen ? 'Yes' : 'No'}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#editVehicleModal" onclick="showEditVehicleModal(${item.id}, ${index})">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="confirmDeleteVehicle(${item.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // inisiasi data tables
        $('#vehiclesTable').DataTable({
          responsive: true,
          autoWidth: false,
          pageLenght: 10,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
          language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ Entri",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ entri",
            infoEmpty: "Tidak ada data yang tersedia",
            paginate: {
              first: "Pertama",
              last: "Terakhir",
              next: "Selanjutnya",
              previous: "Sebelumnya",
            },
          }
        });
    }

    function showEditVehicleModal(id, index) {
        clearEditFormErrors();
        const item = window.vehicleData[index];

        document.getElementById("editVehicleId").value = id;
        document.getElementById("editLicensePlate").value = item.license_plate || '';
        document.getElementById("editType").value = item.type || '';
        document.getElementById("editBrand").value = item.brand || '';
        document.getElementById("editColor").value = item.color || '';

        if (item.is_stolen) {
            document.getElementById("editIsStolenYes").checked = true;
        } else {
            document.getElementById("editIsStolenNo").checked = true;
        }
    }
    async function updateVehicle(event) {
        event.preventDefault();
        clearEditFormErrors();

        const id = document.getElementById("editVehicleId").value;
        const license_plate = document.getElementById("editLicensePlate").value.trim();
        const type = document.getElementById("editType").value.trim();
        const brand = document.getElementById("editBrand").value.trim();
        const color = document.getElementById("editColor").value.trim();
        const isStolen = document.getElementById("editIsStolenYes").checked ? 1 : 0;

        const token = decodeURIComponent(getCookie('token'));

        try {
            const response = await axios.put(`/api/panel-control/vehicles/${id}`, {
                license_plate: license_plate,
                type: type,
                brand: brand,
                color: color,
                is_stolen: isStolen
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            $('#editVehicleModal').modal('hide');

            setTimeout(() => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'success',
                    title: response.data.message
                });
            }, 300);

            setTimeout(() => location.reload(), 1000);

        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                if (errors.license_plate) document.getElementById("editLicensePlateError").textContent = errors.license_plate[0];
                if (errors.type) document.getElementById("editTypeError").textContent = errors.type[0];
                if (errors.brand) document.getElementById("editBrandError").textContent = errors.brand[0];
                if (errors.color) document.getElementById("editColorError").textContent = errors.color[0];
                if (errors.is_stolen) document.getElementById("editIsStolenError").textContent = errors.is_stolen[0];
            } else {
                const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat memperbarui kendaraan.";
                showErrorToast(errorMessage);
            }
        }

    }
}

async function confirmDeleteVehicle(id) {
    console.log("Delete vehicle with ID:", id);
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        deleteVehicle(id);
    }
}

async function deleteVehicle(id) {
    try {
        const token = decodeURIComponent(getCookie('token'));
        const response = await axios.delete(`/api/panel-control/vehicles/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });

        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: response.data.message || 'Data deleted successfully.'
        });

        document.getElementById('vehiclesTableBody').innerHTML = '';
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error("Gagal menghapus data:", error);
        const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menghapus data.";
        showErrorToast(errorMessage);
    }
}
