document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Verifica se o usuário está logado
    if (!token) {
        alert("Você precisa estar logado para ver as reservas.");
        window.location.href = "login.html"; 
        return;
    }

    // Função para converter a data no formato DD-MM-AAAA para o formato esperado pela API
    function converterData(data) {
        const partes = data.split('-'); 
        return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    }

    // Carregar as reservas
    async function carregarReservas(data) {
        try {
            const dataConvertida = data ? converterData(data) : null;
            const url = dataConvertida ? `http://localhost:4000/api/reservas?date=${dataConvertida}` : 'http://localhost:4000/api/reservas';
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Verifica o status da resposta
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Falha ao buscar reservas: ${errorBody}`);
            }

            const reservas = await response.json();
            mostrarReservas(reservas);
        } catch (error) {
            console.error("Erro ao listar reservas:", error);
            alert("Erro ao carregar reservas.");
        }
    }

    // Exibir as reservas
    function mostrarReservas(reservas) {
        const listaReservas = document.getElementById("lista-reservas");
        listaReservas.innerHTML = ""; 

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
                <p>Data: ${new Date(reserva.date).toLocaleDateString()}</p>
                <p>Número de Pessoas: ${reserva.num_people}</p>
                <p>Observação: ${reserva.notes}</p>
                <button class="confirmar-btn" data-id="${reserva._id}">Confirmar Reserva</button>
            `;
            listaReservas.appendChild(reservaItem);
        });

        // Adiciona os eventos para o botão "Confirmar Reserva"
        document.querySelectorAll(".confirmar-btn").forEach((botao) => {
            botao.addEventListener("click", async (event) => {
                const reservaId = event.target.getAttribute("data-id");
                try {
                    const response = await fetch(`http://localhost:4000/api/reservas/${reservaId}/confirmar`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        alert("Sua reserva foi confirmada! Você receberá uma confirmação por SMS.");
                        carregarReservas(); // Recarrega as reservas
                    } else {
                        const errorData = await response.json();
                        alert(`Erro ao confirmar a reserva: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error("Erro ao confirmar a reserva:", error);
                    alert("Erro ao confirmar a reserva. Tente novamente mais tarde.");
                }
            });
        });
    }

    // Evento para filtrar as reservas pela data
    document.getElementById("filtrar-btn").addEventListener("click", () => {
        const dataSelecionada = document.getElementById("data-selecionada").value;
        carregarReservas(dataSelecionada);
    });

    // Carregar todas as reservas ao iniciar
    carregarReservas(); 
});
