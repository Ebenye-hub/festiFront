// Vérifie si l'utilisateur est connecté
const token = localStorage.getItem("token");

if (!token) {
  // Si aucun token, redirige vers la page de connexion
  window.location.href = "register.html";
}

// Appelle l'API pour récupérer les infos utilisateur
fetch("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (!data || !data.role) {
      throw new Error("Utilisateur invalide");
    }

    const role = data.role;

    // Active uniquement la section correspondant au rôle
    if (role === "client") {
      document.getElementById("client-section").classList.add("active");
      loadClientEvents(data.events || []);
    } else if (role === "prestataire") {
      document.getElementById("presta-section").classList.add("active");
      loadPrestaClients(data.clients || []);
    } else if (role === "admin") {
      document.getElementById("admin-section").classList.add("active");
    }
  })
  .catch((err) => {
    console.error("Erreur :", err);
    alert("Impossible de charger le tableau de bord.");
    localStorage.removeItem("token");
    window.location.href = "register.html";
  });

// Déconnexion
function logout() {
  localStorage.removeItem("token");
  window.location.href = "register.html";
}

// Fonctions pour afficher les événements du client
function loadClientEvents(events) {
  const container = document.getElementById("client-events");
  if (events.length === 0) {
    container.innerHTML = "<p>Aucun événement encore créé.</p>";
    return;
  }

  container.innerHTML = events.map((e) => `
    <div class="card" style="background: #f8f9fa">
      <h3>${e.eventType}</h3>
      <p><strong>Date :</strong> ${new Date(e.eventDate).toLocaleDateString()}</p>
      <p><strong>Lieu :</strong> ${e.location}</p>
      <p><strong>Prestataire :</strong> ${e.prestataireName || "Non choisi"}</p>
      <p><strong>Prix :</strong> ${e.prix || "À définir"} FCFA</p>
      <p><strong>Nombre de places :</strong> ${e.capacity || "Non spécifié"}</p>
    </div>
  `).join("");
}

// Fonctions pour afficher les clients du prestataire
function loadPrestaClients(clients) {
  const container = document.getElementById("presta-clients");
  if (clients.length === 0) {
    container.innerHTML = "<p>Aucune prestation encore enregistrée.</p>";
    return;
  }

  container.innerHTML = clients.map((c) => `
    <div class="card" style="background: #f9fcff">
      <h3>Client : ${c.name}</h3>
      <p><strong>Événement :</strong> ${c.eventType}</p>
      <p><strong>Date :</strong> ${new Date(c.eventDate).toLocaleDateString()}</p>
      <p><strong>Nombre d'invités :</strong> ${c.capacity}</p>
      <p><strong>Prix :</strong> ${c.prix} FCFA</p>
      <button class="btn-primary" onclick="relancerClient('${c.email}')">Relancer le client</button>
    </div>
  `).join("");
}

function relancerClient(email) {
  alert(`📧 Une relance de paiement a été envoyée à ${email}`);
  // Ici tu pourras appeler une vraie route backend plus tard
}
