document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

<<<<<<< HEAD
    // Verifica se o usuário está logado
=======
    // Verifica se o token existe, se não redireciona para a página de login
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
    if (!token) {
        alert("Você precisa estar logado para ver as reservas.");
        window.location.href = "login.html"; 
        return;
    }

<<<<<<< HEAD
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
=======
    // Função para carregar as reservas do cliente
    async function carregarReservas() {
        try {
            const response = await fetch('http://localhost:5000/api/reservas', {
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

<<<<<<< HEAD
            // Verifica o status da resposta
=======
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
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

<<<<<<< HEAD
    // Exibir as reservas
=======
    // Função para mostrar as reservas na página
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
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
<<<<<<< HEAD
=======
                <p>Status: <strong>${reserva.status}</strong></p>
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
                <button class="confirmar-btn" data-id="${reserva._id}">Confirmar Reserva</button>
            `;
            listaReservas.appendChild(reservaItem);
        });

<<<<<<< HEAD
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
=======
        // Adicionando o evento de clique para cada botão de confirmar
        const buttons = document.querySelectorAll(".confirmar-btn");
        buttons.forEach(button => {
            button.addEventListener("click", confirmarReserva);
        });
    }

    async function confirmarReserva(event) {
        const reservaId = event.target.getAttribute("data-id");
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch(`http://localhost:5000/api/reservas/${reservaId}/confirmar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            console.log("Status da resposta:", response.status);
            const data = await response.json();
    
            if (response.ok) {
                alert("Reserva confirmada com sucesso!");
                carregarReservas(); // Atualiza a lista de reservas
            } else {
                alert(`Erro ao confirmar reserva: ${data.message || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao confirmar reserva:", error);
            alert("Erro ao confirmar reserva.");
        }
    }

    // Carregar reservas ao iniciar a página
    carregarReservas();
>>>>>>> 4a5615fea743f58e5a086da4aae1be7572f888f5
});
