document.addEventListener("DOMContentLoaded", async function () {
    try {
        const rawToken = getCookie('token');

        if (!rawToken) {
            console.warn("token not found");
            window.location.href = "/";
            return;
        }
    } catch (error) {
        console.error('Error:', error);

        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/";
            } else {
                console.error('Terjadi kesalahan', error.response.data.message);
            }
        }
    }

    const logoutButton = document.querySelectorAll("#logoutBtn")
    logoutButton.forEach((button) => {
        button.addEventListener('click', logout);
    });
})

async function logout() {
    try {
        const rawToken = getCookie('token');

        if (!rawToken) {
            console.warn("token not found for logout attempt");
            performActionLogout();
            return;
        }

        const decodedToken = decodeURIComponent(rawToken);

        const response = await axios.post('/api/panel-control/logout', {}, {
           headers: {
           'Authorization': `Bearer ${decodedToken}`
           },
            withCredentials: true
        });

        Swal.fire({
            icon: 'success',
            title: response.data.message || 'Logout Berhasil',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });

        setTimeout(() => {
            performActionLogout();
        }, 2000);
    } catch (error) {
        console.error("Logout error:", error);

        let errorMessage = 'Logout Gagal, silakan coba lagi';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: errorMessage,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        setTimeout(() => {
            performActionLogout();
        }, 2000);
    }
}

function performActionLogout() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/";
}
