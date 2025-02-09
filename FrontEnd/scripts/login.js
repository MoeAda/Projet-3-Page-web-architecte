let connexion = document.getElementById("login")
document.addEventListener("submit", function (event) {
    event.preventDefault();

    let mail = document.getElementById("email").value;
    let password = document.getElementById("password").value
    console.log(mail);
    console.log(password);      
})
