function getProductId() {
    return new URL(location.href).searchParams.get("id");
}
let product_Id = getProductId();

fetch(`http://localhost:3000/api/products/` + product_Id)
    .then((response) => response.json())
    .then((product) => {
        getProductData(product);
        getColorsProduct(product);
        selectedColor();
    })
    .catch((error) => alert("Erreur" + error));
let productImg = document.querySelector(".item__img");
let productTitle = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");

function getProductData(product) {
    productImg.innerHTML = `<div class="item__img"><img src="${product.imageUrl}" alt="${product.altTxt}"></div>`;
    productTitle.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
}
let colorSelector = document.getElementById("colors");
function getColorsProduct(product) {
    for (i = 0; i < product.colors.length; i++)
        colorSelector.innerHTML += `<option value= ${product.colors[i]}>${product.colors[i]}</option>`;
};


// function selectedColor(colorSelector) {
    colorSelector.addEventListener.oninput = () => {
        theColor = ${this.value}
    };
    console.log(theColor);