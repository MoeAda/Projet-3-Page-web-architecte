const login = document.getElementById("login");
const logout = document.getElementById("logout");
const editor = document.getElementById("editeur");
const token = window.localStorage.getItem("token");

if (token) {
  login.style.display = "none";
  editor.style.display = "flex";
  logout.style.display = "block";
}

/*
function categories() {
  fetch("http://localhost:5678/api/categories", function (response) {})
    .then(function (response) {
      if(response.ok){
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

categories();

*/

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    const filters = document.getElementById("categories-picture");
    const all = document.createElement("option"); // <option></option>
    all.value = 0;
    all.innerText = 'Tous';
    filters.appendChild(all);

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      filters.appendChild(option);

   

      // 1 : Créer un eventListener sur filters (Change)
      /// ....addEventListener... 
      // 2 : Afficher dans un console.log la catégorie (ID) souhaité
      // console.log(catégorie : 3) / toto = 3
      // 3 : Envoyer l'information dans la fonction getWorks (Ajout d'un params ( ne pas oublier le params par défaut))
      // getWorks($categoryId)
      // 4 : Dans getWorks trier les résultats en fonction de la catégories souhaitée
   



    });
  } catch (error) {
    console.log(error);
  }
}

async function getWorks(categoryId = 0) {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    const gallery = document.getElementsByClassName("gallery");

    console.log(data);

    data.forEach((item) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.setAttribute("src", item.imageUrl);
      img.setAttribute("alt", item.title);

      figcaption.innerText = item.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);

      gallery[0].appendChild(figure);
    });
  } catch (error) {
    console.log(error);
  }
}

getCategories();
getWorks();
