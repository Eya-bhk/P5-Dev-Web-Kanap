//appel du localstorage +traduire la chaîne de caractères JSON en objet JavaScript
let storedProducts = JSON.parse(localStorage.getItem("product"));
//définir le tableau dans lequel on va récupéré les données du produit à partir de l'API et du localstorage
let productsFromApi = [];
// Récupérer les infos manquantes des produits si le localstorage n'est pas vide:
getApiData(storedProducts);
async function getApiData(storedProducts) {
    if (storedProducts === null || storedProducts == 0) {
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";
        return null;
    }
    try {
        // extraire de l'api les informations des produits présents dans le localstorage
        for (let i = 0; i < storedProducts.length; i++) {
            let apiData = null;
            await fetch(
                `http://localhost:3000/api/products/` + storedProducts[i]._id
            )
                .then((response) => response.json()) // Transforme les informations obtenues en fichier json
                .then((data) => (apiData = data));
            //modifier les valeurs de couleur et quantité par celles stockées dans le localstorage
            apiData.color = storedProducts[i].color;
            apiData.quantity = storedProducts[i].quantity;
            //ajout des informations du produit dans le tableau
            productsFromApi.push(apiData);
            // console.log(productsAPI);
        }
        displayProducts(); // Création du code produits et ajout des infos à partir du tableau des données
    } catch (err) {
        console.error(err);
    }
}
// Création du code produits et ajout des infos à partir du tableau des données
function displayProducts() {
    //cibler l'endroit d'injection du code dans le DOM
    let cart_items = document.querySelector("#cart__items");
    //Ajout du code avec les données de chaque produit dans le panier
    cart_items.innerHTML = productsFromApi
        .map((product) => {
            return `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" >Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
        })
        .join("");
    calculPrixTotal();
    calculTotalQtt();
    supprimerProduit();
    quantiyModify(); //changer la quantité et le prix totaux en cas de modification de la quantité d'un produit
}
//calcul du prix total des articles dans le panier
function calculPrixTotal() {
    let prixTotal = [];
    for (let j = 0; j < storedProducts.length; j++) {
        let prixUnitaire = productsFromApi[j].price;
        let quantiteProduit = storedProducts[j].quantity;
        let prixTotalProduit = prixUnitaire * quantiteProduit;
        prixTotal.push(prixTotalProduit);
    }
    const reducer = (accumulateur, valeurActuelle) =>
        accumulateur + valeurActuelle;
    const prixTotalProduits = prixTotal.reduce(reducer, 0);
    // injecter le prix total dans le DOM
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = `${prixTotalProduits}`;
}
//calcul de la quantité totale des articles dans le panier
function calculTotalQtt() {
    let totalqtt = 0;
    for (let k = 0; k < storedProducts.length; k++) {
        let quantityUnitaire = storedProducts[k].quantity;
        totalqtt += +quantityUnitaire;
        // injecter la quantité totale dans le DOM
        let totalQtt = document.getElementById("totalQuantity");
        totalQtt.textContent = `${totalqtt}`;
    }
}
//changer la quantité et le prix totaux en cas de modification de la quantité d'un produit
const quantiyModify = async (displayProducts) => {
    await displayProducts;
    let quantityInput = document.querySelectorAll(".itemQuantity");
    quantityInput.forEach((quantity) => {
        quantity.addEventListener("change", (c) => {
            let theArticle = quantity.closest("article");
            let theId = theArticle.getAttribute("data-id");
            let theColor = theArticle.getAttribute("data-color");
            for (let n = 0; n < storedProducts.length; n++) {
                if (
                    storedProducts[n]._id === theId &&
                    storedProducts[n].color === theColor
                ) {
                    // console.log(storedProducts[n].quantity);
                    storedProducts[n].quantity = c.target.value;
                    localStorage.setItem(
                        "product",
                        JSON.stringify(storedProducts)
                    );
                    calculTotalQtt();
                    calculPrixTotal();
                }
            }
        });
    });
};
//-----------------suppression d'un item du panier----------------------
function supprimerProduit() {
    let deleteBtn = document.querySelectorAll(".deleteItem");
    let selectedArticle = document.querySelectorAll(".cart__item");
    for (let l = 0; l < deleteBtn.length; l++) {
        deleteBtn[l].addEventListener("click", (event) => {
            // bloquer le comportement par défaut du bouton
            event.preventDefault();
            let articleForDelete = selectedArticle[l];
            let idForDelete = articleForDelete.getAttribute("data-id");
            let colorForDelete = articleForDelete.getAttribute("data-color");
            for (let o = 0; o < storedProducts.length; o++) {
                if (
                    storedProducts[o]._id == idForDelete &&
                    storedProducts[o].color == colorForDelete
                ) {
                    //suppression du tableau
                    storedProducts.splice(o, 1);
                    //mise à jour du localstorage
                    localStorage.setItem(
                        "product",
                        JSON.stringify(storedProducts)
                    );
                    //alerte et rechargement de la page après suppression de l'article
                    alert("le produit a été supprimé du panier");
                    window.location.href = "cart.html";
                }
            }
        });
    }
}
//*************Début partie formulaire*****************/
//---------------Accéder au données du formulaire----------------------------------
let form = document.querySelector(".cart__order__form");
//Accéder aux messages d'erreur-------
let fnErrorMsg = document.getElementById("firstNameErrorMsg");
let lnErrorMsg = document.getElementById("lastNameErrorMsg");
let adressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");
//----------accéder au bouton commander----------
let btnSubmit = document.querySelector("#order");
// -----------écouter le click sur le bouton commander------
btnSubmit.addEventListener("click", (event) => {
    // bloquer le comportement par défaut du bouton
    event.preventDefault();
    //------------- Récupérer les inputs du formulaire pour les tester ---
    let prénom = form.firstName.value;
    let nom = form.lastName.value;
    let adresse = form.address.value;
    let ville = form.city.value;
    let email = form.email.value;
    //-------------Validation Prénom---------------------------------------
    function validationFn() {
        let nameRe = /^[A-Za-z]{3,15}$/;
        let testFn = nameRe.test(prénom);
        if (testFn) {
            fnErrorMsg.textContent = "";
            return true;
        } else {
            fnErrorMsg.textContent =
                "le prénom doit comporter de 3 à 15 lettres, sans espaces ni chiffres ni caractères spéciaux ";
            return false;
        }
    }
    let validFn = validationFn();
    //-------------Validation nom---------------------------------------
    function validationLn() {
        let nameRe = /^[A-Za-z]{3,15}$/;
        let testLn = nameRe.test(nom);
        console.log(testLn);
        if (testLn) {
            lnErrorMsg.textContent = "";
            return true;
        } else {
            lnErrorMsg.textContent =
                "le nom doit comporter de 3 à 15 lettres, sans espaces ni chiffres ni caractères spéciaux ";
            return false;
        }
    }
    let validLn = validationLn();
    //-------------Validation ville---------------------------------------
    function validationCity() {
        let nameRe = /^[A-Za-z.-_]{3,100}$/;
        let testcity = nameRe.test(ville);
        console.log(testcity);
        if (testcity) {
            cityErrorMsg.textContent = "";
            return true;
        } else {
            cityErrorMsg.textContent = "le nom de la ville est invalide";
            return false;
        }
    }
    let validCity = validationCity();

    //-------------Validation adresse---------------------------------------
    function validationAdress() {
        let nameRe = /^[0-9]+\ [A-Za-z.-_]{3,100}$/;
        let testAdress = nameRe.test(adresse);
        console.log(testAdress);
        if (testAdress) {
            adressErrorMsg.textContent = "";
            return true;
        } else {
            adressErrorMsg.textContent = "l'adresse est invalide";
            return false;
        }
    }
    let validAdress = validationAdress();

    //-------------Validation Email---------------------------------------
    function validationEmail() {
        let nameRe = /^[A-Za-z0-9.-_]+@{1}[A-Za-z0-9.-_]+[.]{1}[a-z]{2,10}$/;
        let testEmail = nameRe.test(email);
        console.log(testEmail);
        if (testEmail) {
            emailErrorMsg.textContent = "";
            return true;
        } else {
            emailErrorMsg.textContent = "l'adresse email est invalide";
            return false;
        }
    }
    let validEmail = validationEmail();

    //vérifier la validité du formulaire pour l'envoi
    if (
        !validFn ||
        !validLn ||
        !validCity ||
        !validAdress ||
        !validEmail ||
        storedProducts.length == 0
    ) {
        alert(
            "Impossible d'envoyer le formulaire, veuillez vérifier que le panier n'est pas vide et que les champs de saisie sont valides"
        );
    } else {
        // création de l’objet contact à envoyer à l'API
        let contact = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
        };
        // création de l’objet products qui comporte les id à envoyer à l'API
        const products = [];
        for (let m = 0; m < storedProducts.length; m++) {
            products.push(storedProducts[m]._id);
        }
        // ------------envoie de la requete post------------------
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify({
                //transforme l'objet js en format json
                contact,
                products,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (rep) => {
            try {
                const rep_post = await rep.json(); // oblige le Script à attendre que la promesse soit consommée puis transforme la reponse au format json
                let orderId = rep_post.orderId;
                location.assign("confirmation.html?id=" + orderId); //redirection à la page confirmation
            } catch (error) {
                alert("Erreur" + error);
            }
        });
    }
});
