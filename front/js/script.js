fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
        for (i = 0; i < data.length; i++) {
            let s = document.getElementById("items");

            let myLink = document.createElement("a");
            myLink.setAttribute("href", `./product.html?id=${data[i]._id}&`);
            s.append(myLink);

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
        console.log(data);
    })
    .catch((error) => alert("Erreur" + error));
