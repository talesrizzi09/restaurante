document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Verifica se o token existe, se não redireciona para a página de login
    if (!token) {
        alert("Você precisa estar logado para ver as reservas.");
        window.location.href = "login.html"; 
        return;
    }

    // Função para carregar as reservas do cliente
    async function carregarReservas() {
        try {
            const response = await fetch('http://localhost:5000/api/reservas', {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

    // Função para mostrar as reservas na página
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
                <p>Status: <strong>${reserva.status}</strong></p>
                <button class="confirmar-btn" data-id="${reserva._id}">Confirmar Reserva</button>
            `;
            listaReservas.appendChild(reservaItem);
        });

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
});
