//extraire l'id du produit à partir de l'url de la page
function getProductId() {
    return new URL(location.href).searchParams.get("id");
}
let product_Id = getProductId();
//accéder graçe a l'envoie d'une requête get aux informations du produit ciblé par son id
fetch("http://localhost:3000/api/products/" + product_Id)
    .then((response) => response.json())
    .then((product) => {
        getProductData(product); //insérer les informations du produit dans le DOM

        getColorsProduct(product); //ajouter d'une façon dynamique les couleurs disponibles
    })
    .catch((error) => alert("Erreur" + error));
//cibler les élements du DOM où on va injecter d'une façon dynamique les informations du produit
const productImg = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const colorSelector = document.getElementById("colors");
const quantitySelector = document.getElementById("quantity");
const colorDiv = document.querySelector(".item__content__settings__color");
const quantityDiv = document.querySelector(
    ".item__content__settings__quantity"
);
//insérer les informations du produit dans le DOM
function getProductData(product) {
    productImg.innerHTML = `<div class="item__img"><img src="${product.imageUrl}" alt="${product.altTxt}"></div>`;
    productTitle.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
}
//ajouter d'une façon dynamique les couleurs disponibles
function getColorsProduct(product) {
    for (i = 0; i < product.colors.length; i++)
        colorSelector.innerHTML += `<option value= ${product.colors[i]}>${product.colors[i]}</option>`;
}
//ajout dans le DOM du message si la couleur n'est pas selectionnée
let addColorMsg = document.createElement("div");
let textColorMsg = document.createTextNode(
    "Veuillez sélectionner une couleur s'il vous plait"
);
addColorMsg.setAttribute("style", "display:none");
colorDiv.append(addColorMsg);
addColorMsg.appendChild(textColorMsg);
//ajout dans le DOM du message si la quantité est invalide
let addQuantityMsg = document.createElement("div");
let textQuantityMsg = document.createTextNode(
    "Veuillez sélectionner une quantité valide s'il vous plait (entre 1 et 100 ) "
);
addQuantityMsg.setAttribute("style", "display:none");
quantityDiv.append(addQuantityMsg);
addQuantityMsg.appendChild(textQuantityMsg);
// Accéder sur le bouton 'ajouter au panier'
const btnAddToBasket = document.getElementById("addToCart");
//cibler le localstorage: un objet va recevoir le contenu du localstorage après être converti en valeur JS
let showLocalStorage = JSON.parse(localStorage.getItem("product"));
// *****Début de l'écoute du clic sur le bouton 'ajouter au panier
btnAddToBasket.addEventListener("click", (event) => {
    //création de l'objet produit et l'ajouter au localStorage
    creatProductObject(); //vérifier si les caractéristiques du produit sont valides et les ajouter en forme d'objet qui sera ajouté au localstorage
    successMsg(); //apparition/disparition des messages d'erreur après l'apparition d'une fenêtre pop-up indiquant le succès/l'echec de l'ajout du produit dans le panier
});
//*****fin de l'écoute du bouton ajouter au panier ****/
//vérifier si les caractéristiques du produit sont valides et les ajouter en forme d'objet qui sera ajouté au localstorage
function creatProductObject() {
    colorValue = colorSelector.value;
    quantityValue = quantitySelector.value;
    if (colorValue != "" && quantityValue > 0 && quantityValue < 101) {
        productArray = {
            _id: product_Id,
            color: colorValue,
            quantity: quantityValue,
        };
        productAdd(productArray); //Ajouter le produit au localstorage
    } else {
        errorMsgShow(); //Montrer les messages d'erreur selon la situation
    }
}
//Ajouter le produit au localstorage
function productAdd(productArray) {
    if (showLocalStorage === null) {
        showLocalStorage = [];
        showLocalStorage.push(productArray);
        localStorage.setItem("product", JSON.stringify(showLocalStorage));
    } else {
        repeatedArticleNumber(productArray);
    }
}
//vérifier si le produit ajouté est déjà présent dans le localstorage, et additionner la quantité si c'est le cas
function repeatedArticleNumber(productArray) {
    let repeatedArticle = showLocalStorage.find(
        (storedProduct) =>
            productArray._id == storedProduct._id &&
            productArray.color == storedProduct.color
    );
    if (repeatedArticle) {
        let totalArticles =
            Number(productArray.quantity) + Number(repeatedArticle.quantity);
        repeatedArticle.quantity = totalArticles; //mettre à jour la quantité de l'article répété
        localStorage.setItem("product", JSON.stringify(showLocalStorage));
    } else {
        showLocalStorage.push(productArray);
        localStorage.setItem("product", JSON.stringify(showLocalStorage));
    }
}
//Montrer les messages d'erreur selon la situation
function errorMsgShow() {
    if ((quantityValue < 1 || quantityValue > 100) && colorValue != "") {
        addQuantityMsg.setAttribute(
            "style",
            "display:block; color:#292929; font-size:0.8rem; font-weight:bold"
        );
    } else if (colorValue == "" && quantityValue > 0 && quantityValue < 101) {
        addColorMsg.setAttribute(
            "style",
            "display:block; color:#292929;text-shadow:none; font-size:0.8rem !important; font-weight:bold"
        );
    } else {
        addColorMsg.setAttribute(
            "style",
            "display:block; color:#292929;text-shadow:none; font-size:0.8rem !important; font-weight:bold"
        );
        addQuantityMsg.setAttribute(
            "style",
            "display:block; color:#292929; font-size:0.8rem; font-weight:bold"
        );
    }
}
//cacher les messages d'erreur
function errorMsgHide() {
    addColorMsg.setAttribute(
        "style",
        "display:none; color:#292929;text-shadow:none; font-size:0.8rem !important; font-weight:bold"
    );
    addQuantityMsg.setAttribute(
        "style",
        "display:none; color:#292929; font-size:0.8rem; font-weight:bold"
    );
}
//apparition/disparition des messages d'erreur après l'apparition d'une fenêtre pop-up indiquant le succès/l'echec de l'ajout du produit dans le panier
function successMsg() {
    if (colorValue != "" && quantityValue >= 1 && quantityValue <= 100) {
        alert("Produit ajouté au panier avec succès");
        errorMsgHide();
    } else {
        alert(
            "Produit non ajouté au panier, veuillez vérifier vos champs de sélection"
        );
        errorMsgShow();
    }
}
