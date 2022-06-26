const orderId = document.getElementById("orderId")
.textContent = localStorage.getItem("orderId");
console.log(orderId);

localStorage.clear();