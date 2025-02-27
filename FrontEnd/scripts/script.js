const login = document.getElementById("login");
const logout = document.getElementById("logout");
const editor = document.getElementById("editeur");
const token = window.localStorage.getItem("token");

if (token) {
  login.style.display = "none";
  editor.style.display = "flex";
  logout.style.display = "block";
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    const filters = document.getElementById("categories");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn-styled";
    button.innerText = "Tous";
    button.value = 0;
    filters.appendChild(button);

    data.forEach((item) => {
      const categorieButton = document.createElement("button");
      categorieButton.type = "button";
      categorieButton.className = "btn-styled";
      categorieButton.value = item.id;
      categorieButton.innerText = item.name;
      filters.appendChild(categorieButton);
    });

    filters.addEventListener("click", (event) => {
      console.log("ID de la catégorie :", event.target.value);
      // "Reload" les données
      getWorks(event.target.value);
    });
  } catch (error) {
    console.log(error);
  }
}


async function getWorks(categoryId = "0") {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";
    data
      .filter((item) => item.categoryId.toString() === categoryId || categoryId === "0")
      .forEach((item) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.setAttribute("src", item.imageUrl);
        img.setAttribute("alt", item.title);

        figcaption.innerText = item.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
      });
  } catch (error) {
    console.log(error);
  }
}

getCategories();
getWorks();

// Types de variable
// Nombre ? Chaine de caractères ? Objet ? Tableaux ? Booléan
// let maVariable: String = "Ma chaine de caractères" Dans les langagues typé statiquement, le type de la variable ne peut pas changer
// JS est typé dynamiquement donc on peut changer "à la volée" le type de ma variable 
// === : On check d'abord le type pour il compare les valeurs si c'est les mêmes types, sinon retourne false directement
// == : On s'en fout du type pq il se dérouille tout seul pour faire matcher les types. JS trouve un truc en commun pour pouvoir traduire. ex : 2 == "2" ? -> "2" == "2"; true == "true" -> "true" == "true". À chaque fois (ou presque) JS transforme en chaine de caractères.
