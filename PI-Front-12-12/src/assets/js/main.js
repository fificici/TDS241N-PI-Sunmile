/* ============================================================
   SEÇÃO 1 — CONFIGURAÇÕES DO MENU E TEMA
============================================================ */

const settingsButton = document.querySelector('.settings');
const settingsMenu   = document.querySelector('.settings-menu');
const darkToggle     = document.querySelector('#darkModeToggle');

settingsButton?.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsMenu.classList.toggle('active');

  if (!settingsMenu.classList.contains('active')) return;

  const btnRect = settingsButton.getBoundingClientRect();
  const menuRect = settingsMenu.getBoundingClientRect();
  const padding = 8;

  let left = btnRect.right + padding;
  let top  = btnRect.top;

  // Se estourar pela direita, joga para a esquerda
  if (left + menuRect.width > window.innerWidth) {
    left = btnRect.left - menuRect.width - padding;
  }

  // Se estourar embaixo, ajusta
  if (top + menuRect.height > window.innerHeight) {
    top = window.innerHeight - menuRect.height - padding;
  }

  settingsMenu.style.left = `${left}px`;
  settingsMenu.style.top  = `${top}px`;
});

document.addEventListener('click', (e) => {
  if (!settingsMenu.contains(e.target) && !settingsButton.contains(e.target)) {
    settingsMenu.classList.remove('active');
  }
});

/* -------- DARK MODE -------- */

darkToggle?.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme', darkToggle.checked);
  localStorage.setItem('darkMode', darkToggle.checked ? '1' : '0');
});

if (localStorage.getItem('darkMode') === '1') {
  document.body.classList.add('dark-theme');
  if (darkToggle) darkToggle.checked = true;
}

/* ============================================================
   SEÇÃO 2 — CONFIGURAÇÕES GERAIS
============================================================ */

const pageContainer = document.getElementById("page-container");
const links = document.querySelectorAll(".menu a");

const API_BASE = "http://localhost:3000/sunmile";
const token = localStorage.getItem("token");


/* ============================================================
   USUÁRIO LOGADO
============================================================ */

async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
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
  btn.style.display = user?.role === "pro" ? "inline-block" : "none";
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
      pageContainer.innerHTML = await res.text();

      carregarPerfilJS(user);
      return;
    }

    /* POSTS */
    if (page === "posts") {
      const res = await fetch(`../pages/pro-post.html`);
      pageContainer.innerHTML = await res.text();

      await mostrarBotaoCriarPost();
      carregarPosts();
      configurarModalPost();
      return;
    }

    /* OUTRAS PÁGINAS */
    const res = await fetch(`../pages/${page}.html`);
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
  link.addEventListener("click", (e) => {
    e.preventDefault();
    carregarPagina(link.dataset.page);
  });
});


/* ============================================================
   CARREGAR POSTS (FEED)
============================================================ */

async function carregarPosts() {
  const container = document.getElementById("posts-list");
  if (!container) return;

  container.innerHTML = "<p>Carregando posts...</p>";

  try {
    const res = await fetch(`${API_BASE}/pro-posts`);
    if (!res.ok) throw new Error("Erro ao buscar posts");

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

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Erro ao criar post");
        return;
      }

      modal.classList.add("hidden");
      carregarPosts();

    } catch (err) {
      console.error(err);
      alert("Erro ao publicar post");
    }
  };
}


/* ============================================================
   PERFIL (UPDATE + DELETE)
============================================================ */

function carregarPerfilJS(currentUser) {
  const form = document.getElementById("perfil-form");
  const statusMsg = document.getElementById("status");
  const deleteBtn = document.getElementById("delete-account-btn");

  if (!form) return;

  form.name.value = currentUser.name || "";
  form.username.value = currentUser.username || "";
  form.email.value = currentUser.email || "";
  form.bio.value = currentUser.professional?.bio || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: form.name.value,
      username: form.username.value,
      email: form.email.value,
      bio: form.bio.value
    };

    try {
      const res = await fetch(`${API_BASE}/pro/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      statusMsg.textContent = res.ok
        ? "Alterações salvas!"
        : result.message || "Erro ao salvar";

      statusMsg.style.color = res.ok ? "green" : "red";

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Erro ao atualizar.";
      statusMsg.style.color = "red";
    }
  });

  deleteBtn?.addEventListener("click", async () => {
    if (!confirm("Deseja deletar sua conta?")) return;

    await fetch(`${API_BASE}/users/${currentUser.id}`, {
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

document.querySelector(".logout-btn")?.addEventListener("click", async () => {
  localStorage.removeItem("token");
  window.location.href = "../pages/index.html";
});
