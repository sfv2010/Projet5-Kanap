// ---Récupérer les donnée par API ---

const callApi = async () => {
    try {
      const products = await fetch("http://localhost:3000/api/products");
      return products.json();
    }
    catch(err){
      document
      .getElementById("items")
      .innerText = " Erreur d'affichage - nous sommes désolés ";
    }
};

 //---Insérer les produits dans la page d'acceuil (Affichage les 8 photos et les textes)---
 
const displayProducts = async () => {
    const result = await callApi();
    //console.log(result);
    for (let i = 0; i < result.length; i++) {
        //---Créer des nouveaux éléments---
        //---<a href>---
        let productA = document.createElement("a");
        document.getElementById("items").appendChild(productA);
        productA.href = `./product.html?id=${result[i]._id}`;

        //---<article>---
        let productArticle = document.createElement("article");
        productA.appendChild(productArticle);

        //---<img src alt>---
        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = result[i].imageUrl;
        productImg.alt = result[i].altTxt;

        //---<h3 class = "productName">---
        let productH3 = document.createElement("h3");
        productArticle.appendChild(productH3);
        productH3.classList.add("productName");
        productH3.innerText = result[i].name;

        //---<p class = "productDescription">---
        let productP = document.createElement("p");
        productArticle.appendChild(productP);
        productP.classList.add("productDescription");
        productP.innerText = result[i].description;
    } 
};

displayProducts();



// ---Récupérer les donnée par API ---
//let kanapData;

// const callApi = async() => {
//     try{
//       const res = await fetch("http://localhost:3000/api/products");
//       kanapData = await res.json();
//     }
//     catch(err){
//       document
//       .getElementById("items")
//       .innerText = " Erreur d'affichage - nous sommes désolés ";
//     }
//   }
// callApi();

// //---Insérer les produits dans la page d'acceuil (Affichage les 8 photos et les textes)---

// const displayProducts = async() => {
//     await callApi();

//     document
//     .getElementById("items")
//     .innerHTML = kanapData.map(value =>
    
//       `<a href="./product.html?id=${value._id}">
//           <article>
//             <img src="${value.imageUrl}" alt="${value.altTxt}">
//             <h3 class="productName">${value.name}</h3>
//             <p class="productDescription">${value.description}</p>
//           </article>
//         </a>`
//     )
//   .join("");
// };
// displayProducts();