//------extraire l'identifiant de commande à partir de l'url de la page
function getOrderId() {
    return new URL(location.href).searchParams.get("id");
}
let orderId = getOrderId();
//injecter la valeur de l'identifiant de commande dans le DOM
let commandNum = document.getElementById("orderId");
commandNum.textContent = orderId;
//vider le localstorage
localStorage.removeItem("product");
