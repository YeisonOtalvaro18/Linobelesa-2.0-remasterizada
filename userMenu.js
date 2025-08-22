// userMenu.js
// Muestra el nombre del usuario y botón de salir en el menú si está logueado

document.addEventListener('DOMContentLoaded', function() {
  const userMenu = document.getElementById('userMenu');
  const loginBtn = document.getElementById('loginBtn');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const authToken = localStorage.getItem('authToken');
  if (userMenu) {
    if (userData && authToken) {
      userMenu.style.display = 'inline-block';
        userMenu.innerHTML = `<a href='bienvenida.html' id='userNameMenu' style='color:inherit; text-decoration:none;'><i class="bi bi-person-circle"></i> ${userData.nombre}</a> <button id='logoutBtn' style='margin-left:10px; background:#6a0dad; color:#fff; border:none; border-radius:10px; padding:5px 12px; cursor:pointer;'>Salir</button>`;
      if (loginBtn) loginBtn.style.display = 'none';
      setTimeout(() => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.onclick = function() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.reload();
          };
        }
      }, 100);
    } else {
      userMenu.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-block';
    }
    }
  });
