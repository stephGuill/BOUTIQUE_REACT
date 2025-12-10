import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Product.css";
function Product() {
  const { id } = useParams();            // récupère l'id dans l'URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products`)
      .then(res => res.json())
      .then(data => {
        const p = data.find(item => item.id == id);
        setProduct(p);
      })
      .catch(err => console.error("Erreur API :", err));
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  function handleAddToCart() {
    // 1. Récupérer le panier actuel
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Ajouter le produit courant
    const newCart = [...currentCart, product];

    // 3. Sauvegarder
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 4. Feedback simple
    alert("Produit ajouté au panier");
  }

return (
    <div className="product-card">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>{product.price} €</h2>

      <button onClick={ handleAddToCart}>
      Ajouter au panier
      </button>

      
    </div>
  );
}

export default Product;