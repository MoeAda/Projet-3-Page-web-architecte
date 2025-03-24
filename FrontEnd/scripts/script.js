const login = document.getElementById("login");
const logout = document.getElementById("logout");
const editor = document.getElementById("editeur");
const token = window.localStorage.getItem("token");
const modify = document.querySelector(".modifier");
const categories = document.querySelector("#selectCategory");
const formBtn = document.querySelector("#modal-valider");
const formInput = document.querySelector(".workForm");
const modalGallery = document.getElementById("modalGallery");
const modalForm = document.getElementById("modalForm");

window.onload = function () {
  getToken(); // Exécute ton code une fois que tout le DOM est chargé
};

logout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  getToken();
});

const checkFormValidity = () => {
  const image = formInput.querySelector("#image").files[0];
  const titleInput = formInput.querySelector("#title-input");
  const categorySelect = formInput.querySelector("#selectCategory");
  const addSubmitButton = formInput.querySelector("#modal-valider");
  const labelPhoto = formInput.querySelector("#labelPhoto")

  addSubmitButton.disabled = false;

  if (!image || !["image/jpeg", "image/png"].includes(image.type) || image.size > 4 * 1024 * 1024) {
    //("Veuillez sélectionner une image au format .jpg ou .png.");
    labelPhoto.style.border = "red solid 1px";
    addSubmitButton.disabled = true;
  } else {
    labelPhoto.style.border = "none";
  }

  const title = titleInput.value.trim();
  if (!title) {
    //("Veuillez entrer un titre.");
    titleInput.style.border = "red solid 1px";
    addSubmitButton.disabled = true;
  } else {
    titleInput.style.border = "none";
  }

  const category = categorySelect.value;
  if (!category) {
    //("Veuillez sélectionner une catégorie.");
    categorySelect.style.border = "red solid 1px";
    addSubmitButton.disabled = true;
  } else {
    categorySelect.style.border = "none";
  } 
}

formInput.addEventListener("change", checkFormValidity);

function getToken() {
  const token = window.localStorage.getItem("token");
  if (token) {
    login.style.display = "none";
    editor.style.display = "flex";
    logout.style.display = "block";
    modify.style.display = "flex";
  } else {
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
      const option = document.createElement("option");
      categorieButton.type = "button";
      categorieButton.className = "btn-styled";
      categorieButton.value = item.id;
      categorieButton.innerText = item.name;
      filters.appendChild(categorieButton);

      option.value = item.id;
      option.text = item.name;
      option.selected = false;
      categories.appendChild(option);
    });

    categories.value = null;

    filters.addEventListener("click", (event) => {
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
    getWorksForModal(data);

    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";
    data
      .filter(
        (item) =>
          item.categoryId.toString() === categoryId || categoryId === "0"
      )
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

async function deleteWork(id) {
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

let modal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "flex";
  target.removeAttribute("aria-hidden");
  modal = target;

  modalGallery.style.display = "flex";
  modalForm.style.display = "none";

  modal.querySelectorAll(".js-close-modal").forEach(function (closeButton) {
    closeButton.addEventListener("click", closeModal);
  });

  modal
    .querySelector("#js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  console.log(e);
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", true);
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector("#js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
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
      button.className = "trash-styled";
      button.innerHTML =
        '<i class="fa-solid fa-trash-can fa-xs" style="color: #ffffff;"></i>';
      button.value = item.id;

      figure.appendChild(button);
      figure.appendChild(img);

      modalGallery.appendChild(figure);

      button.addEventListener("click", () => {
        deleteWork(button.value);
      });
    });
  } catch (error) {
    console.log(
      "Erreur lors de la récupération des works pour la modale :",
      error
    );
  }
}

function nextModal() {
  console.log(modalGallery.style.display);
  modalGallery.style.display = "none";
  modalForm.style.display = "flex";
}

function previousModal() {
  console.log(modalGallery.style.display);
  modalGallery.style.display = "flex";
  modalForm.style.display = "none";
}

const addPictureBtn = document.getElementById("add-picture");
const returnModal = document.querySelector(".js-return-modal");

addPictureBtn.addEventListener("click", function (e) {
  e.preventDefault();
  nextModal();
});

returnModal.addEventListener("click", function (e) {
  e.preventDefault();
  previousModal();
});

function formSubmit() {
  const image = formInput.querySelector("#image").files[0];
  const title = formInput.querySelector("#title-input").value;
  const category = formInput.querySelector("#selectCategory").value;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Photo ajoutée avec succès");

        getWorks();
      } else {
        throw new Error("Echec de l'ajout de la photo");
      }
    })
    .catch((err) => {
      console.error("Erreur : ", err);
      alert("Erreur lors de l'ajout de la photo : " + err.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const workPreview = document.getElementById("workPreview");
  const fileImage = document.getElementById("file-image");

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        workPreview.style.display = "flex"; // Affiche la prévisualisation
        fileImage.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      workPreview.style.display = "none"; // Cache la prévisualisation si aucun fichier
    }
  });
});

// On créer un eventListener pour récupérer les informations une fois le bouton de soumission clicker
formBtn.addEventListener("click", function (e) {
  e.preventDefault();
  formSubmit();
});

getCategories();
getWorks();
getToken();
