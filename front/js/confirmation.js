const urlSearchParams = new URLSearchParams(location.search);
const orderId = urlSearchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;