const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  try {
    const response = await fetch("http://localhost:3000/sunmile/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    alert("Login realizado!");
    console.log("TOKEN:", result.token);

    localStorage.setItem("token", result.token);

    window.location.href = "main.html";

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
});