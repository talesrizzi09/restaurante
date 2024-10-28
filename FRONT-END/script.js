// Variável para armazenar o nome do cliente
let nomeCliente = '';

// Função para carregar reservas
async function carregarReservas() {
    if (!nomeCliente) return; // Não faz a busca se o nome não estiver definido

    try {
        const response = await fetch(`http://localhost:5000/api/reservas/${nomeCliente}`);
        if (response.ok) {
            const reservas = await response.json();
            exibirReservas(reservas); // Você deve ter essa função para exibir as reservas
        } else {
            console.error('Erro ao buscar reservas');
        }
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
    }
}

// Adiciona o evento de submit ao formulário de reservas
document.getElementById('reserva-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const pessoas = document.getElementById('pessoas').value;
    const observacao = document.getElementById('observacao').value;

    const reserva = {
        name: nome,
        phone: telefone,
        date: new Date(`${data}T${horario}:00`), 
        num_people: pessoas,
        notes: observacao,
    };

    try {
        const response = await fetch('http://localhost:4000/api/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Reserva criada com sucesso! ID: ${data._id}`);
            nomeCliente = nome; // Armazena o nome do cliente

            document.getElementById('reserva-form').reset();
            await carregarReservas(); // Carrega as reservas novamente
        } else {
            const errorData = await response.json();
            alert(`Erro ao criar reserva: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar a reserva:', error);
        alert('Erro ao enviar a reserva. Tente novamente mais tarde.');
    }
});

// Função para exibir reservas
function exibirReservas(reservas) {
    const listaReservas = document.getElementById('lista-reservas');
    listaReservas.innerHTML = ''; // Limpa a lista antes de exibir

    reservas.forEach(reserva => {
        const li = document.createElement('li');
        li.textContent = `Reserva: ${reserva.date}, Status: ${reserva.status}`; // Exibir detalhes da reserva
        listaReservas.appendChild(li);
    });
}

// Chama carregarReservas ao carregar a página
window.onload = async () => {
    nomeCliente = document.getElementById('nome').value; // Captura o nome do cliente
    await carregarReservas(); // Carrega as reservas na inicialização
};
