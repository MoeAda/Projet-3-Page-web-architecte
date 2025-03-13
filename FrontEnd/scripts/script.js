const login = document.getElementById("login");
const logout = document.getElementById("logout");
const editor = document.getElementById("editeur");
const token = window.localStorage.getItem("token");
const modify =document.querySelector(".modifier");

window.onload = function() {
  getToken(); // Exécute ton code une fois que tout le DOM est chargé
};

logout.addEventListener("click", ()=> {
  window.localStorage.removeItem("token")
  getToken();
})


function getToken(){
  const token = window.localStorage.getItem("token");
  if (token) {
    login.style.display = "none";
    editor.style.display = "flex";
    logout.style.display = "block";
    modify.style.display = "flex";
  }else{
    logout.style.display = "none";
    editor.style.display = "none";
    login.style.display = "block";
    modify.style.display = "none";  
  }
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

console.log(token)
async function getWorks(categoryId = "0") {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
 
    getWorksForModal(data)
    

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
getToken()

async function deleteWork(id){
  if (confirm("Voulez-vous supprimer ce travail?")) {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Travail supprimé");
        getWorks();
      } else {
        console.error("Erreur lors de la suppression du travail");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
 
let modal = null

const openModal = function(e){
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "flex";
    target.removeAttribute("aria-hidden");
  modal = target;
  modal.addEventListener("click", closeModal)
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
  modal.querySelector("#js-modal-stop").addEventListener("click", stopPropagation)
  
}

const closeModal = function(e) {
  if (modal === null) return
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", true);
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
  modal.querySelector("#js-modal-stop").removeEventListener("click", stopPropagation)
  modal = null
}

const stopPropagation = function(e) {
  e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal)
});

async function getWorksForModal(data) {
  try {
  
    /*
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    */
    
    const modalGallery = document.querySelector("#modal-gallery"); 
    modalGallery.innerHTML = ""; 

    data.forEach((item) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");

      img.setAttribute("src", item.imageUrl);
      img.setAttribute("alt", item.title);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn-styled";
      button.innerText = "Supprimer";
      button.value = item.id;

      figure.appendChild(button);

      figure.appendChild(img);

      modalGallery.appendChild(figure);

      button.addEventListener("click", () => {
        console.log(button.value)
      deleteWork(button.value)
      })
    });

  } catch (error) {
    console.log("Erreur lors de la récupération des works pour la modale :", error);
  }
}

async function formSubmit(event) {
  event.preventDefault()

  const form = event.target;
  const imageInput = form.querySelector("#image");
  const titleInput = form.querySelector("#title-input");
  const categorySelect = form.querySelector("#selectCategory");
  const image = imageInput.files[0];

  if (!image || !["image/jpeg", "image/png"].includes(image.type)) {
    alert("Veuillez sélectionner une image au format .jpg ou .png.");
    return;
  }

  if (image.size > 4 * 1024 * 1024) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return;
  }

  const title = titleInput.value.trim();
  if (!title) {
    alert("Veuillez entrer un titre.");
    return;
  }

  const category = categorySelect.value;
  if (!category) {
    alert("Veuillez sélectionner une catégorie.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("categoryId", category);
  formData.append("image", image);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      alert("Photo ajoutée avec succès");

      const worls = await getWorks;
    } else {
      throw new Error("Echec de l'ajour de la photo");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo", error);
  }
}




