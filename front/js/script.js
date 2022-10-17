//cibler l'élement du DOM où on va injecter le code des produits
const sectionSelector = document.getElementById("items");

//envoyer la requête get pour ramener les informations des différents produits
fetch("http://localhost:3000/api/products")
    .then((response) => response.json()) // Transforme la réponse de la promesse au format json
    .then((data) => {
        for (i = 0; i < data.length; i++) {
            //création les élements du DOM pour l'affichage des produits et l'ajout des données dans ces élements HTML
            let myLink = document.createElement("a");
            myLink.setAttribute("href", `./product.html?id=${data[i]._id}&`);
            sectionSelector.append(myLink);
            let myArticle = document.createElement("article");
            myLink.appendChild(myArticle);
            let myImg = document.createElement("img");
            myImg.setAttribute("src", `${data[i].imageUrl}`);
            myImg.setAttribute("alt", `${data[i].altTxt}`);
            myArticle.appendChild(myImg);
            let myHeading = document.createElement("h3");
            myHeading.className = "productName";
            let myHeadingText = document.createTextNode(`${data[i].name}`);
            myHeading.appendChild(myHeadingText);
            myArticle.appendChild(myHeading);
            let myParagraph = document.createElement("p");
            myParagraph.className = "productDescription";
            let myParagraphText = document.createTextNode(
                `${data[i].description}`
            );
            myParagraph.appendChild(myParagraphText);
            myArticle.appendChild(myParagraph);
        }
    })
    .catch((error) => alert("Erreur" + error)); // on traite les erreurs et on affiche l’erreur rencontrée si on en rencontre une.
