/* ============================================================
   SEÇÃO 1 — CONFIGURAÇÕES DO MENU E TEMA
============================================================ */

const settingsButton = document.querySelector('.settings');
const settingsMenu   = document.querySelector('.settings-menu');
const darkToggle     = document.querySelector('#darkModeToggle');

settingsButton.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsMenu.classList.toggle('active');

  if (settingsMenu.classList.contains('active')) {
    const rect = settingsButton.getBoundingClientRect();
    const menuWidth  = settingsMenu.offsetWidth;
    const menuHeight = settingsMenu.offsetHeight;
    const padding = 8;

    let left = rect.right + padding;
    let top  = rect.top;

    if (window.innerWidth - rect.right < menuWidth + padding) {
      left = rect.left - menuWidth - padding;
    }
    if (window.innerHeight - rect.top < menuHeight + padding) {
      top = Math.max(8, window.innerHeight - menuHeight - padding);
    }

    settingsMenu.style.left = left + "px";
    settingsMenu.style.top  = top  + "px";
  }
});

document.addEventListener('click', (e) => {
  if (!settingsMenu.contains(e.target) && !settingsButton.contains(e.target)) {
    settingsMenu.classList.remove('active');
  }
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme', darkToggle.checked);
  localStorage.setItem('darkMode', darkToggle.checked ? '1' : '0');
});

if (localStorage.getItem('darkMode') === '1') {
  darkToggle.checked = true;
  document.body.classList.add('dark-theme');
}



/* ============================================================
   SEÇÃO 2 — NAVEGAÇÃO ENTRE PÁGINAS
============================================================ */

const pageContainer = document.getElementById("page-container");
const searchBar = document.querySelector(".search-bar");
const links = document.querySelectorAll(".menu a");

const API_BASE = "http://localhost:3000/sunmile";
const token = localStorage.getItem("token");

async function carregarPagina(page) {
  searchBar.style.display = page === "account" ? "none" : "block";

  try {
    const html = await fetch(`../pages/${page}.html`).then(r => r.text());
    pageContainer.innerHTML = html;

    if (page === "account") carregarPerfilJS();

  } catch (err) {
    pageContainer.innerHTML = "<p>Erro ao carregar página.</p>";
  }
}

links.forEach(link => {
  link.addEventListener("click", () => {
    const page = link.getAttribute("data-page");
    carregarPagina(page);
  });
});



/* ============================================================
   SEÇÃO 3 — PERFIL DO USUÁRIO + UPDATE + DELETE
============================================================ */

function carregarPerfilJS() {
  const form = document.getElementById("perfil-form");
  const statusMsg = document.getElementById("status");
  const deleteBtn = document.getElementById("delete-account-btn");
  let currentUser = null;

  /* ---------- Carregar usuário logado ---------- */
  async function loadUser() {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    currentUser = await res.json();

    form.name.value = currentUser.name;
    form.username.value = currentUser.username;
    form.email.value = currentUser.email;
    form.cpf.value = currentUser.cpf;
    form.birth_date.value = currentUser.birth_date?.split("T")[0] || "";
  }

  loadUser();


  /* ---------- Atualizar perfil ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: form.name.value,
      username: form.username.value,
      email: form.email.value
    };

    const res = await fetch(`${API_BASE}/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();

    statusMsg.textContent = result.message || "Atualizado!";
    statusMsg.style.color = res.ok ? "green" : "red";
  });



  /* ---------- Deletar usuário ---------- */
  deleteBtn.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.");

    if (!confirmar) return;

    try {
      const res = await fetch(`${API_BASE}/users/${currentUser.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        alert("Erro ao deletar conta.");
        return;
      }

      alert("Conta deletada com sucesso!");

      localStorage.removeItem("token");
      window.location.href = "../pages/index.html";

    } catch (err) {
      console.error(err);
      alert("Erro ao tentar deletar conta.");
    }
  });
}



/* ============================================================
   SEÇÃO 4 — LOGOUT VIA API + LIMPAR SESSÃO
============================================================ */

const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {

    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn("Erro ao chamar logout (continuando mesmo assim)");
    }

    localStorage.removeItem("token");
    window.location.href = "../pages/index.html";
  });
}
