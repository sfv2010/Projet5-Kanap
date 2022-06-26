// ---Récupérer les donnée par API ---

const callApi = async () => {
    try {
      const products = await fetch("http://localhost:3000/api/products");
      return products.json();
    }
    catch(err){
      document
      .getElementById("items")
      .textContent = " Erreur d'affichage - nous sommes désolés ";
    }
};

 //---Insérer les produits dans la page d'acceuil (Affichage les 8 photos et les textes)---
 
const displayProducts = async () => {
    const kanaps = await callApi();

    kanaps.forEach(kanap => {
        const productA = document.createElement("a");
        document.getElementById("items").appendChild(productA);
        productA.href = `./product.html?id=${kanap._id}`;

        //---<article>---
        const productArticle = document.createElement("article");
        productA.appendChild(productArticle);

        //---<img src alt>---
        const productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = kanap.imageUrl;
        productImg.alt = kanap.altTxt;

        //---<h3 class = "productName">---
        const productH3 = document.createElement("h3");
        productArticle.appendChild(productH3);
        productH3.classList.add("productName");
        productH3.textContent = kanap.name;

        //---<p class = "productDescription">---
        const productP = document.createElement("p");
        productArticle.appendChild(productP);
        productP.classList.add("productDescription");
        productP.textContent = kanap.description;
    })
};

displayProducts();