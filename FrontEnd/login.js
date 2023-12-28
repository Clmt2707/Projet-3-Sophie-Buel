//******** Envoi formulaire de login ************

function ajoutListenerLogin() {
    const formulaireLogin = document.querySelector(".formulaireLogin");
    formulaireLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        var email = document.getElementById("email");
        var password = document.getElementById("password");
        
        //vérification de la valdité de l'email via regexp
        let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!(regex.test(email))) {
            alert("L'adresse mail n'est pas valide");
        }


        if (email.value === "" || password.value === "") {
            alert("Veuillez renseigner tous les champs.");
            event.preventDefault();
        }

        //Vérification de l'authentification du user, appel à l'api 
        const rep = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            //création de la charge utile
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });

     //réponse de l'api
     const donnees = await rep.json();
     if(rep.ok) {
        alert("Identification réussie !");
        
        localStorage.setItem("userId", donnees.userId); //on stocke les données dans le localstorage
        localStorage.setItem("token", donnees.token);

        //redirection vers index.html si réussite
        window.location.href = "index.html";
     } else {
        alert("Identifiants non valides.");
     }

});
}

ajoutListenerLogin();