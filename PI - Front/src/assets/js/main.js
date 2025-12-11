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

async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Não autorizado");

    return await res.json();

  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
    return null;
  }
}

async function carregarPagina(page) {
  searchBar.style.display = page === "account" ? "none" : "block";

  try {
    if (page === "account") {
      const user = await getCurrentUser();
      if (!user) {
        pageContainer.innerHTML = "<p>Erro ao carregar usuário.</p>";
        return;
      }

      const profilePage = user.role === "pro" ? "account-pro" : "account-user";

      const html = await fetch(`../pages/${profilePage}.html`).then(r => r.text());
      pageContainer.innerHTML = html;

      carregarPerfilJS(user);
      return;
    }

    const html = await fetch(`../pages/${page}.html`).then(r => r.text());
    pageContainer.innerHTML = html;

  } catch (err) {
    console.error(err);
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

function carregarPerfilJS(currentUser) {

  const form = document.getElementById("perfil-form");
  const statusMsg = document.getElementById("status");
  const deleteBtn = document.getElementById("delete-account-btn");

  /* ============================================================
     1. Preencher dados do USER
  ============================================================= */

  form.name.value = currentUser.name || "";
  form.username.value = currentUser.username || "";
  form.email.value = currentUser.email || "";

  if (form.cpf) form.cpf.value = currentUser.cpf || "";
  if (form.birth_date) form.birth_date.value = currentUser.birth_date?.split("T")[0] || "";

  /* ============================================================
     2. Preencher dados do PROFESSIONAL
  ============================================================= */

  const pro = currentUser.professional || null;

  if (pro) {
    if (form.phone_number) form.phone_number.value = pro.phone_number || "";
    if (form.bio) form.bio.value = pro.bio || "";
    if (form.pro_registration) form.pro_registration.value = pro.pro_registration || "";
  }

  /* ============================================================
     3. Atualizar perfil (PUT)
  ============================================================= */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Dados do usuário normal
    const bodyUser = {
      name: form.name.value,
      username: form.username.value,
      email: form.email.value
    };

    // Se for PRO -> manda também os dados da tabela Professional
    let endpoint = `${API_BASE}/users/${currentUser.id}`;

    if (currentUser.role === "pro") {
      endpoint = `${API_BASE}/pro/${currentUser.id}`;

      bodyUser.bio = form.bio?.value || "";
      bodyUser.phone_number = form.phone_number?.value || "";
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyUser)
      });

      const result = await res.json();

      if (res.ok) {
        statusMsg.textContent = "Alterações salvas!";
        statusMsg.style.color = "green";

        // Atualiza dados salvos no localStorage
        localStorage.setItem("user", JSON.stringify(result));

      } else {
        statusMsg.textContent = result.message || "Erro ao atualizar.";
        statusMsg.style.color = "red";
      }

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Erro ao atualizar.";
      statusMsg.style.color = "red";
    }
  });



  /* ============================================================
     4. Deletar conta
  ============================================================= */

  deleteBtn.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.");

    if (!confirmar) return;

    try {
      const res = await fetch(`${API_BASE}/users/${currentUser.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
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
      alert("Erro interno ao deletar.");
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
