document.querySelector('#register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const role = document.querySelector('input[name="role"]:checked').value;

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const result = await response.json();
    alert(result.message);
  } catch (err) {
    console.error('❌ Erreur :', err);
    alert("Erreur lors de l'inscription");
  }
});
