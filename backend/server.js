const express = require('express');
    const cors = require('cors');
    const fs = require('fs');
     //lecture écriture des fichiers JSON
    const path = require('path');

    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    // Lire les produits depuis le fichier JSON
    const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

    // Chemin vers le fichier JSON des produits
    const PRODUCTS_FILE = path.join(__dirname, 'products.json'); 
    // Chemin vers le fichier JSON des utilisateurs
    const USERS_FILE = path.join(__dirname, 'users.json');


    // ---------- UTIL USERS ----------
function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture users.json :', err);
    return [];
  }
}

    // 🔹 Lire les produits depuis le fichier à chaque requête
function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture products.json :', err);
    return [];
  }
}

// 🔹 Écrire les produits dans le fichier (si tu veux ajouter / modifier plus tard)
function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Erreur écriture products.json :', err);
  }
}

    // ROUTE PRODUITS
    
    // ➜ Tous les produits
app.get('/products', (req, res) => {
  // On demande au navigateur de NE PAS mettre en cache
  res.set('Cache-Control', 'no-store');

  const products = readProducts();
  res.json(products);
});

// ➜ Un seul produit par id (utile si tu veux l’utiliser plus tard)
app.get('/products/:id', (req, res) => {
  res.set('Cache-Control', 'no-store');

  const products = readProducts();
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  res.json(product);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "email et password sont obligatoires" });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  return res.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// ➜ Ajouter un produit (pour plus tard si tu veux tester l’écriture)
app.post('/products', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;

  if (!newProduct.name || typeof newProduct.price !== 'number') {
    return res.status(400).json({ error: 'name (string) et price (number) sont obligatoires' });
  }

  // Génération d’un nouvel id
  newProduct.id = products.length
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

    app.listen(port, () => {
      console.log("API running on http://localhost:" + port);
    });