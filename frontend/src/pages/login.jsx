app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "email et password sont obligatoires" });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  // Vérifie le mot de passe hashé
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  return res.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
});