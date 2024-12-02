document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const mensagemAlerta = document.getElementById("mensagem-alerta");
    const dataSelecionadaInput = document.getElementById("data-selecionada");
    const filtrarBtn = document.getElementById("filtrar-btn");

    let reservasCache = []; // Armazena as reservas sem filtro aplicado

    // Função para exibir mensagens de erro ou sucesso
    function exibirMensagem(texto, tipo = "erro") {
        mensagemAlerta.textContent = texto;
        mensagemAlerta.className = `mensagem ${tipo}`;
        mensagemAlerta.style.display = "block";
        setTimeout(() => {
            mensagemAlerta.style.display = "none";
        }, 5000);
    }

    if (!token) {
        exibirMensagem("Você precisa estar logado para ver as reservas.");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
        return;
    }

    // Função para carregar todas as reservas do cliente
    async function carregarReservas() {
        try {
            const response = await fetch('https://restaurante-tales.onrender.com/api/reservas', {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Falha ao buscar reservas: ${errorBody}`);
            }

            reservasCache = await response.json(); // Armazena todas as reservas sem filtro
            mostrarReservas(reservasCache); // Exibe todas as reservas inicialmente
        } catch (error) {
            console.error("Erro ao listar reservas:", error);
            exibirMensagem("Erro ao carregar reservas.");
        }
    }

    // Função para formatar a data no formato DD-MM-AAAA
    function formatarData(data) {
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
        const ano = d.getFullYear();
        return `${dia}-${mes}-${ano}`;
    }

    // Função para mostrar as reservas na página
    function mostrarReservas(reservas) {
        const listaReservas = document.getElementById("lista-reservas");
        listaReservas.innerHTML = ""; // Limpa a lista de reservas

        if (reservas.length === 0) {
            listaReservas.innerHTML = "<p>Não há reservas disponíveis.</p>";
            return;
        }

        reservas.forEach((reserva) => {
            const reservaItem = document.createElement("div");
            reservaItem.classList.add("reserva-item");
            reservaItem.innerHTML = `
                <h3>${reserva.name}</h3>
                <p>Telefone: ${reserva.phone}</p>
                <p>Data: ${formatarData(reserva.date)}</p> <!-- Formata a data aqui -->
                <p>Número de Pessoas: ${reserva.num_people}</p>
                <p>Observação: ${reserva.notes}</p>
                <p>Status: <strong>${reserva.status}</strong></p>
                <button class="confirmar-btn" data-id="${reserva._id}">Confirmar Reserva</button>
            `;
            listaReservas.appendChild(reservaItem);
        });

        const buttons = document.querySelectorAll(".confirmar-btn");
        buttons.forEach(button => {
            button.addEventListener("click", confirmarReserva);
        });
    }

    // Função para confirmar a reserva
    async function confirmarReserva(event) {
        const reservaId = event.target.getAttribute("data-id");
    
        try {
            const response = await fetch(`https://restaurante-tales.onrender.com/api/reservas${reservaId}/confirmar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                exibirMensagem("Reserva confirmada com sucesso!", "sucesso");
                carregarReservas();
                
            } else {
                exibirMensagem(`Erro ao confirmar reserva: ${data.message || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao confirmar reserva:", error);
            exibirMensagem("Erro ao confirmar reserva.");
        }
    }

    // Função para filtrar as reservas pela data
    function filtrarReservasPorData() {
        const dataSelecionada = dataSelecionadaInput.value;

        if (!dataSelecionada) {
            exibirMensagem("Por favor, insira uma data para filtrar.");
            return;
        }

        // Formatar a data no formato 'DD-MM-AAAA' para 'YYYY-MM-DD'
        const [dia, mes, ano] = dataSelecionada.split("-"); // Split para separar dia, mês e ano
        const dataFiltro = new Date(`${ano}-${mes}-${dia}`); // Cria um objeto Date com formato ISO 'YYYY-MM-DD'

        const reservasFiltradas = reservasCache.filter(reserva => {
            const reservaData = new Date(reserva.date); // Converte a data da reserva para um objeto Date
            return reservaData.toDateString() === dataFiltro.toDateString(); // Compara as datas
        });

        mostrarReservas(reservasFiltradas);
    }

    

    // Adiciona o evento ao botão de filtro
    filtrarBtn.addEventListener("click", filtrarReservasPorData);

    // Carrega as reservas ao carregar a página
    carregarReservas();
});
