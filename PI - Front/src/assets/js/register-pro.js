const form = document.getElementById("register-form");
console.log("register.js carregado!");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const formData = new FormData(form);

  const data = {
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    cpf: formData.get("cpf"),
    birth_date: formData.get("birth_date"),
    password: formData.get("password"),
    pro_registration: formData.get("pro_registration")
  };

  try {
    const response = await fetch("http://localhost:3000/sunmile/pro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert("Erro: " + result.message);
      return;
    }

    alert("Usuário criado com sucesso!");
    console.log(result);

  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor.");
  }
});

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "visibility_off" : "visibility";
});
