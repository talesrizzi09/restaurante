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
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("data").setAttribute("min", hoje);

    if (!horario) {
        exibirMensagem("Por favor, selecione um horário para a reserva.", "erro");
        return;
    }


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
            exibirMensagem(`Reserva criada com sucesso!`, "sucesso");

            document.getElementById('reserva-form').reset();
            await carregarReservas(); // Carrega as reservas novamente
        } else {
            const errorData = await response.json();
            exibirMensagem(`Erro ao criar reserva: ${errorData.message}`, "erro");
        }
    } catch (error) {
        console.error('Erro ao enviar a reserva:', error);
        exibirMensagem('Erro ao enviar a reserva. Tente novamente mais tarde.', "erro");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const hoje = new Date().toISOString().split("T")[0];
    const dataInput = document.getElementById("data");
    dataInput.setAttribute("min", hoje);

    const dataMaxima = new Date();
    dataMaxima.setMonth(dataMaxima.getMonth() + 6);
    const dataMaximaFormatada = dataMaxima.toISOString().split("T")[0];
    dataInput.setAttribute("max", dataMaximaFormatada);

    dataInput.addEventListener('input', function () {
        const dataSelecionada = dataInput.value;
        if (dataSelecionada && dataSelecionada > dataMaximaFormatada) {
            dataInput.setCustomValidity("Você só pode fazer reservas até 6 meses a partir de hoje.");
        } else {
            dataInput.setCustomValidity("");
        }
    });
});

function selecionarHorario(horario, botao) {
    document.getElementById('horario').value = horario;

    const botoes = document.querySelectorAll('.horario-opcao');
    botoes.forEach((botao) => {
        botao.classList.remove('selecionado');
    });

    botao.classList.add('selecionado');
}

document.addEventListener("DOMContentLoaded", function () {
    const horarioInput = document.getElementById('horario');
    horarioInput.setAttribute('min', '19:30');
    horarioInput.setAttribute('max', '21:30');
});

function exibirMensagem(mensagem, tipo) {
    const container = document.getElementById("mensagem-container");
    const novaMensagem = document.createElement("div");

    novaMensagem.className = `mensagem ${tipo}`;
    novaMensagem.textContent = mensagem;

    container.appendChild(novaMensagem);

    setTimeout(() => {
        novaMensagem.remove();
    }, 5000);
}
