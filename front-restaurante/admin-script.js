// Função para fazer login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Login bem-sucedido!');
        // Redirecionar para a página de reservas
        window.location.href = 'reservas.html';
    } else {
        alert('Falha no login. Verifique suas credenciais.');
    }
});

// Função para listar reservas
async function listarReservas() {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const reservas = await response.json();
        const tableBody = document.getElementById('reservas-table').getElementsByTagName('tbody')[0];

        reservas.forEach(reserva => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reserva.nome;
            row.insertCell(1).innerText = new Date(reserva.data).toLocaleDateString();
            row.insertCell(2).innerText = reserva.horario;
            row.insertCell(3).innerText = reserva.pessoas;
            row.insertCell(4).innerText = reserva.observacao;
        });
    } else {
        alert('Falha ao buscar reservas.');
    }
}

// Chama a função listarReservas se estiver na página de reservas
if (document.title === 'Lista de Reservas') {
    listarReservas();
}
