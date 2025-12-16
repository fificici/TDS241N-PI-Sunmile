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

/* ============================================================
   CONFIGURAÇÕES GERAIS
============================================================ */

const pageContainer = document.getElementById("page-container");
const searchBar = document.querySelector(".search-bar");
const links = document.querySelectorAll(".menu a");

const API_BASE = "http://localhost:3000/sunmile";
const token = localStorage.getItem("token");

/* ============================================================
   USUÁRIO LOGADO
============================================================ */

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

/* ============================================================
   MOSTRAR BOTÃO CRIAR POST (SOMENTE PRO)
============================================================ */

async function mostrarBotaoCriarPost() {
  const btn = document.getElementById("create-post-btn");
  if (!btn) return;

  const user = await getCurrentUser();

  if (user && user.role === "pro") {
    btn.style.display = "inline-block";
  } else {
    btn.style.display = "none";
  }
}

/* ============================================================
   NAVEGAÇÃO SPA
============================================================ */

async function carregarPagina(page) {
  try {
    /* PERFIL */
    if (page === "account") {
      const user = await getCurrentUser();
      if (!user) {
        pageContainer.innerHTML = "<p>Erro ao carregar usuário.</p>";
        return;
      }

      const profilePage = user.role === "pro" ? "account-pro" : "account-user";
      const res = await fetch(`../pages/${profilePage}.html`);
      if (!res.ok) throw new Error("Erro ao carregar perfil");

      pageContainer.innerHTML = await res.text();
      carregarPerfilJS(user);
      return;
    }

    /* POSTS */
    if (page === "posts") {
      const res = await fetch(`../pages/pro-post.html`);
      if (!res.ok) throw new Error("Erro ao carregar posts");

      pageContainer.innerHTML = await res.text();

      await mostrarBotaoCriarPost();
      carregarPosts();
      configurarModalPost();
      return;
    }

    /* OUTRAS PÁGINAS */
    const res = await fetch(`../pages/${page}.html`);
    if (!res.ok) throw new Error("Erro ao carregar página");

    pageContainer.innerHTML = await res.text();

  } catch (err) {
    console.error(err);
    pageContainer.innerHTML = "<p>Erro ao carregar página.</p>";
  }
}

/* ============================================================
   LINKS DO MENU
============================================================ */

links.forEach(link => {
  link.addEventListener("click", () => {
    const page = link.getAttribute("data-page");
    carregarPagina(page);
  });
});

/* ============================================================
   CARREGAR POSTS
============================================================ */

async function carregarPosts() {
  const container = document.getElementById("posts-list");
  if (!container) return;

  container.innerHTML = "<p>Carregando posts...</p>";

  try {
    const res = await fetch(`${API_BASE}/pro-posts`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    
    console.log("STATUS /pro-posts:", res.status);

    if (!res.ok) {
      throw new Error("Erro ao buscar posts");
    }

    const posts = await res.json();

    console.log("POSTS RECEBIDOS:", posts);

    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = "<p>Nenhum post encontrado.</p>";
      return;
    }

    container.innerHTML = posts.map(post => `
      <div class="post-card">
        <div class="post-header">
          <strong>${post.author.name}</strong>
          <span>@${post.author.username}</span>
        </div>

        <h3>${post.title}</h3>
        <p>${post.content}</p>
      </div>
    `).join("");

  } catch (err) {
    console.error("Erro ao carregar posts:", err);
    container.innerHTML = "<p>Erro ao carregar posts.</p>";
  }
}

/* ============================================================
   MODAL CRIAR POST
============================================================ */

function configurarModalPost() {
  const modal = document.getElementById("post-modal");
  const openBtn = document.getElementById("create-post-btn");
  const cancelBtn = document.getElementById("cancel-post");
  const submitBtn = document.getElementById("submit-post");

  if (!modal || !openBtn || !cancelBtn || !submitBtn) return;

  openBtn.onclick = () => {
    modal.classList.remove("hidden");
  };

  cancelBtn.onclick = () => {
    modal.classList.add("hidden");
  };

  submitBtn.onclick = async () => {
    const titleInput = document.getElementById("post-title");
    const contentInput = document.getElementById("post-content");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/pro-posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Erro ao criar post");
        return;
      }

      titleInput.value = "";
      contentInput.value = "";

      modal.classList.add("hidden");
      carregarPosts();

    } catch (err) {
      console.error(err);
      alert("Erro ao publicar post");
    }
  };
}





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