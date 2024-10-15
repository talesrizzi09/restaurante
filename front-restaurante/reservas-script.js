document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    
    if (!token) {
        alert("Você precisa estar logado para ver as reservas.");
        window.location.href = "login.html"; 
        return;
    }

  
    function converterData(data) {
        const partes = data.split('-'); 
        return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    }

    
    async function carregarReservas(data) {
        try {
            
            const dataConvertida = data ? converterData(data) : null;
            const url = dataConvertida ? `http://localhost:5000/api/reservas?date=${dataConvertida}` : 'http://localhost:5000/api/reservas';
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            console.log("Status da resposta:", response.status);
            console.log("Headers da resposta:", response.headers);

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Falha ao buscar reservas: ${errorBody}`);
            }

            const reservas = await response.json();
            console.log("Reservas:", reservas);
            mostrarReservas(reservas);
        } catch (error) {
            console.error("Erro ao listar reservas:", error);
            alert("Erro ao carregar reservas.");
        }
    }

    
    function mostrarReservas(reservas) {
        console.log("Entrando na função mostrarReservas", reservas); 
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
            `;
            listaReservas.appendChild(reservaItem);
        });
    }

    
    document.getElementById("filtrar-btn").addEventListener("click", () => {
        const dataSelecionada = document.getElementById("data-selecionada").value; 
        console.log("Data de filtro selecionada:", dataSelecionada); 
        carregarReservas(dataSelecionada);
    });

    
    carregarReservas(); 
});
