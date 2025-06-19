document.addEventListener("DOMContentLoaded", async function () {
    const token = decodeURIComponent(getCookie('token'));
    if (!token) {
        window.location.href = '/';
        return;
    }


    try {
        const res = await axios.get('/api/panel-control/officers', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        displayOfficers(res.data.data);
    } catch (err) {
        console.error("Load error:", err);
    }

    // Tombol Tambah
    document.getElementById("addOfficerBtn").addEventListener("click", () => {
        document.getElementById("createOfficerForm").reset();
        clearCreateErrors();
    });

    // Submit Tambah
    document.getElementById("createOfficerForm").addEventListener("submit", addOfficer);
    // Submit Edit
    document.getElementById("editOfficerForm").addEventListener("submit", updateOfficer);
});

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function showToast(message, icon = 'success') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: icon,
        title: message
    });
}

function clearCreateErrors() {
    ['Name', 'BadgeNumber', 'Rank', 'AssignedArea'].forEach(field => {
        document.getElementById(`create${field}Error`).textContent = '';
    });
}

function clearEditErrors() {
    ['Name', 'BadgeNumber', 'Rank', 'AssignedArea'].forEach(field => {
        document.getElementById(`edit${field}Error`).textContent = '';
    });
}

function displayOfficers(data) {
    const table = document.getElementById("officersTableBody");
    table.innerHTML = data.length ? "" : `<tr><td colspan="6" class="text-center">No data</td></tr>`;

    window.officerData = data;

    data.forEach((officer, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th>${i + 1}</th>
            <td>${officer.name}</td>
            <td>${officer.badge_number}</td>
            <td>${officer.rank}</td>
            <td>${officer.assigned_area}</td>
            <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editOfficerModal" onclick="showEdit(${i})">Edit</button>
                <button class="btn btn-danger" onclick="confirmDeleteOfficer(${officer.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function addOfficer(e) {
    e.preventDefault();
    clearCreateErrors();

    const token = decodeURIComponent(getCookie('token'));
    const payload = {
        name: document.getElementById("createName").value,
        badge_number: document.getElementById("createBadgeNumber").value,
        rank: document.getElementById("createRank").value,
        assigned_area: document.getElementById("createAssignedArea").value
    };

    try {
        const res = await axios.post('/api/panel-control/officers', payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        $('#createOfficerModal').modal('hide');
        showToast(res.data.message || "Added successfully");
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        if (err.response?.status === 422) {
            const errs = err.response.data.errors;
            Object.keys(errs).forEach(key => {
                const field = key.replace('_', '').replace('badge', 'Badge').replace('number', 'Number');
                document.getElementById(`create${capitalize(field)}Error`).textContent = errs[key][0];
            });
        } else {
            showToast("Add failed", "error");
        }
    }
}

function showEdit(i) {
    const officer = window.officerData[i];
    document.getElementById("editOfficerId").value = officer.id;
    document.getElementById("editName").value = officer.name;
    document.getElementById("editBadgeNumber").value = officer.badge_number;
    document.getElementById("editRank").value = officer.rank;
    document.getElementById("editAssignedArea").value = officer.assigned_area;
    clearEditErrors();
}

async function updateOfficer(e) {
    e.preventDefault();
    clearEditErrors();

    const token = decodeURIComponent(getCookie('token'));
    const id = document.getElementById("editOfficerId").value;
    const payload = {
        name: document.getElementById("editName").value,
        badge_number: document.getElementById("editBadgeNumber").value,
        rank: document.getElementById("editRank").value,
        assigned_area: document.getElementById("editAssignedArea").value
    };

    try {
        const res = await axios.put(`/api/panel-control/officers/${id}`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        $('#editOfficerModal').modal('hide');
        showToast(res.data.message || "Updated successfully");
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        if (err.response?.status === 422) {
            const errs = err.response.data.errors;
            Object.keys(errs).forEach(key => {
                const field = key.replace('_', '').replace('badge', 'Badge').replace('number', 'Number');
                document.getElementById(`edit${capitalize(field)}Error`).textContent = errs[key][0];
            });
        } else {
            showToast("Update failed", "error");
        }
    }
}

async function confirmDeleteOfficer(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) deleteOfficer(id);
}

async function deleteOfficer(id) {
    const token = decodeURIComponent(getCookie('token'));
    try {
        const res = await axios.delete(`/api/panel-control/officers/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        showToast(res.data.message || "Deleted successfully");
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        showToast("Delete failed", "error");
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
