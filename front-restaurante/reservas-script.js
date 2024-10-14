document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Verifique se o token está disponível
    if (!token) {
        alert("Você precisa estar logado para ver as reservas.");
        window.location.href = "login.html"; // Redirecione para a página de login
        return;
    }

    // Função para converter data de DD-MM-AAAA para AAAA-MM-DD
    function converterData(data) {
        const partes = data.split('-'); // Divide a string em partes
        return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna no formato AAAA-MM-DD
    }

    // Função para carregar reservas
    async function carregarReservas(data) {
        try {
            // Converte a data se ela estiver definida
            const dataConvertida = data ? converterData(data) : null;
            const url = dataConvertida ? `http://localhost:5000/api/reservas?date=${dataConvertida}` : 'http://localhost:5000/api/reservas';
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Adicionando logs para depuração
            console.log("Status da resposta:", response.status);
            console.log("Headers da resposta:", response.headers);

            if (!response.ok) {
                const errorBody = await response.text(); // Captura a mensagem de erro
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

    // Função para mostrar reservas na página
    function mostrarReservas(reservas) {
        console.log("Entrando na função mostrarReservas", reservas); // Log de entrada na função
        const listaReservas = document.getElementById("lista-reservas");
        listaReservas.innerHTML = ""; // Limpa a lista anterior

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

    // Adicione um evento ao botão de filtrar
    document.getElementById("filtrar-btn").addEventListener("click", () => {
        const dataSelecionada = document.getElementById("data-selecionada").value; // Supondo que você tenha um input de data
        console.log("Data de filtro selecionada:", dataSelecionada); // Log da data selecionada
        carregarReservas(dataSelecionada);
    });

    // Chame a função para carregar as reservas ao iniciar
    carregarReservas(); // Chama a função inicialmente sem data
});
