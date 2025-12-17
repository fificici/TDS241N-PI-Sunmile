/* ============================================================
   SEÇÃO 1 — MENU FLUTUANTE + TEMA
============================================================ */

const settingsButton = document.querySelector('.settings');
const settingsMenu   = document.querySelector('.settings-menu');
const darkToggle     = document.querySelector('#darkModeToggle');

settingsButton?.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsMenu.classList.toggle('active');

  if (!settingsMenu.classList.contains('active')) return;

  const rect = settingsButton.getBoundingClientRect();
  const padding = 8;

  let left = rect.right + padding;
  let top  = rect.top;

  if (left + settingsMenu.offsetWidth > window.innerWidth) {
    left = rect.left - settingsMenu.offsetWidth - padding;
  }

  if (top + settingsMenu.offsetHeight > window.innerHeight) {
    top = window.innerHeight - settingsMenu.offsetHeight - padding;
  }

  settingsMenu.style.left = `${left}px`;
  settingsMenu.style.top  = `${top}px`;
});

document.addEventListener('click', (e) => {
  if (!settingsMenu?.contains(e.target) && !settingsButton?.contains(e.target)) {
    settingsMenu?.classList.remove('active');
  }
});

darkToggle?.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme', darkToggle.checked);
  localStorage.setItem('darkMode', darkToggle.checked ? '1' : '0');
});

if (localStorage.getItem('darkMode') === '1') {
  document.body.classList.add('dark-theme');
  if (darkToggle) darkToggle.checked = true;
}


/* ============================================================
   CONFIGURAÇÕES GERAIS
============================================================ */

const API_BASE = "http://localhost:3000/sunmile";
const token = localStorage.getItem("token");

const pageContainer = document.getElementById("page-container");
const links = document.querySelectorAll(".menu a");


/* ============================================================
   USUÁRIO LOGADO
============================================================ */

async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}


/* ============================================================
   NAVEGAÇÃO SPA
============================================================ */

async function carregarPagina(page) {
  try {

    /* POSTS */
    if (page === "posts") {
      const res = await fetch(`../pages/pro-post.html`);
      pageContainer.innerHTML = await res.text();

      await mostrarBotaoCriarPost();
      carregarPosts();
      configurarModalPost();
      return;
    }

    /* PROFISSIONAIS */
    if (page === "professionals") {
      const res = await fetch(`../pages/professionals.html`);
      pageContainer.innerHTML = await res.text();
      carregarProfissionais();
      return;
    }

    /* PERFIL */
    if (page === "account") {
      const user = await getCurrentUser();
      if (!user) return;

      const profilePage = user.role === "pro"
        ? "account-pro"
        : "account-user";

      const res = await fetch(`../pages/${profilePage}.html`);
      pageContainer.innerHTML = await res.text();

      carregarPerfilJS(user);
      return;
    }

    /* OUTRAS */
    const res = await fetch(`../pages/${page}.html`);
    pageContainer.innerHTML = await res.text();

  } catch (err) {
    console.error(err);
    pageContainer.innerHTML = "<p>Erro ao carregar página.</p>";
  }
}

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    carregarPagina(link.dataset.page);
  });
});


/* ============================================================
   POSTS
============================================================ */

async function mostrarBotaoCriarPost() {
  const btn = document.getElementById("create-post-btn");
  if (!btn) return;

  const user = await getCurrentUser();
  btn.style.display = user?.role === "pro" ? "inline-block" : "none";
}

async function carregarPosts() {
  const container = document.getElementById("posts-list");
  if (!container) return;

  container.innerHTML = "<p>Carregando posts...</p>";

  try {
    const res = await fetch(`${API_BASE}/pro-posts`);
    if (!res.ok) throw new Error();

    const posts = await res.json();

    if (!posts.length) {
      container.innerHTML = "<p>Nenhum post encontrado.</p>";
      return;
    }

    container.innerHTML = posts.map(post => `
      <div class="post-card">
        <div class="post-header">
          <div class="post-avatar">
            ${post.professional.user.name.charAt(0)}
          </div>
          <div class="post-author">
            <strong>${post.professional.user.name}</strong>
            <span>@${post.professional.user.username}</span>
          </div>
        </div>
        <div class="post-content">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
        </div>
      </div>
    `).join("");

  } catch {
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

  openBtn.onclick = () => modal.classList.remove("hidden");
  cancelBtn.onclick = () => modal.classList.add("hidden");

  submitBtn.onclick = async () => {
    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content").value.trim();

    if (!title || !content) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/pro-posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) throw new Error();

      modal.classList.add("hidden");
      carregarPosts();

    } catch {
      alert("Erro ao criar post");
    }
  };
}


/* ============================================================
   PROFISSIONAIS
============================================================ */

async function carregarProfissionais() {
  const container = document.getElementById("professionals-list");
  if (!container) return;

  container.innerHTML = "<p>Carregando profissionais...</p>";

  try {
    const res = await fetch(`${API_BASE}/professionals`);
    if (!res.ok) throw new Error();

    const professionals = await res.json();

    container.innerHTML = professionals.map(pro => `
      <div class="professional-card">
        <div class="professional-header">
          <div class="professional-avatar">
            ${pro.user.name.charAt(0)}
          </div>
          <div>
            <strong>${pro.user.name}</strong>
            <span>@${pro.user.username}</span>
          </div>
        </div>
        <div class="professional-info">
          <p><strong>Registro:</strong> ${pro.pro_registration}</p>
          <p><strong>Telefone:</strong> ${pro.phone_number}</p>
          ${pro.bio ? `<p><strong>Bio:</strong> ${pro.bio}</p>` : ""}
        </div>
      </div>
    `).join("");

  } catch {
    container.innerHTML = "<p>Erro ao carregar profissionais.</p>";
  }
}


/* ============================================================
   PERFIL (UPDATE + DELETE)
============================================================ */

function carregarPerfilJS(user) {
  const form = document.getElementById("perfil-form");
  const status = document.getElementById("status");
  const deleteBtn = document.getElementById("delete-account-btn");

  if (!form) return;

  form.name.value = user.name || "";
  form.username.value = user.username || "";
  form.email.value = user.email || "";

  if (user.professional) {
    form.bio.value = user.professional.bio || "";
    form.phone_number.value = user.professional.phone_number || "";
    form.pro_registration.value = user.professional.pro_registration || "";
  }

  if (form.cpf) form.cpf.value = user.cpf || "";
  if (form.birth_date) {
    form.birth_date.value = user.birth_date?.split("T")[0] || "";
  }

  /* UPDATE */
  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.textContent = "Salvando...";
  status.style.color = "#666";

  const body = {
    name: form.name.value,
    username: form.username.value,
    email: form.email.value
  };

  let endpoint = `${API_BASE}/users/${user.id}`;

  if (user.role === "pro") {
    endpoint = `${API_BASE}/pro/${user.id}`;
    body.bio = form.bio.value;
    body.phone_number = form.phone_number.value;
  }

  try {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Erro ao atualizar perfil");
    }

    status.textContent = result.message || "Perfil atualizado com sucesso!";
    status.style.color = "green";

  } catch (err) {
    status.textContent = err.message || "Erro ao atualizar perfil.";
    status.style.color = "red";
  }
});

  /* DELETE */
  deleteBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!confirm("Deseja realmente deletar sua conta?")) return;

    await fetch(`${API_BASE}/users/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.removeItem("token");
    window.location.href = "../pages/index.html";
  });
}


/* ============================================================
   LOGOUT
============================================================ */

document.querySelector(".logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../pages/index.html";
});
