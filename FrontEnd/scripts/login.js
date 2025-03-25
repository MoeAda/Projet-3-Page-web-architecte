// Définition des variables //

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const forms = document.getElementById("forms");
const loginError = document.getElementById("loginError");
const errorEmail = document.getElementById("errorEmail");
const login = document.getElementById("login");

// Vérification du mail et du password //

inputEmail.addEventListener("change", (event) => {
  const emailValue = event.target.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const resultEmail = emailRegex.test(emailValue);

  if (!resultEmail) {
    errorEmail.setAttribute("style", "display:block;");
  } else {
    errorEmail.setAttribute("style", "display:none;");
  }
});

inputPassword.addEventListener("change", (event) => {
  const passwordValue = event.target.value.trim();
  const passwordRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const resultPassword = passwordRegex.test(passwordValue);

  if (!resultPassword) {
    errorPassword.setAttribute("style", "display:block;");
  } else {
    errorPassword.setAttribute("style", "display:none;");
  }
});

// Connexion // 

forms.addEventListener("submit", (event) => {
  event.preventDefault();

  const objectJsonLogin = {
    email: inputEmail.value,
    password: inputPassword.value,
  };

  const bodyRequest = JSON.stringify(objectJsonLogin);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyRequest,
  })
    .then((response) => {
      // SI tout est OK
      if (response.ok) {
        loginError.setAttribute("style", "display:none;");
        logout.setAttribute("style", "display:block;");
        login.setAttribute("style", "display:none");
        return response.json();
      }

      // Si on passe pas dans le IF
      else {
        loginError.setAttribute("style", "display:block;");
      }
    })
    .then(({ token }) => {
      window.localStorage.setItem("token", token);
      window.location.href = './index.html';
    })
    .catch((e) => {
      alert("ERREUR lors de la connexion" + e);
    });
});

