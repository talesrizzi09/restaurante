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
        alert("Por favor, selecione um horário para a reserva.");
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
            alert(`Reserva criada com sucesso! ID: ${data._id}`);
            
            document.getElementById('reserva-form').reset();
        } else {
            const errorData = await response.json();
            alert(`Erro ao criar reserva: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar a reserva:', error);
        alert('Erro ao enviar a reserva. Tente novamente mais tarde.');
    }
});


document.addEventListener("DOMContentLoaded", function() {
    
    const hoje = new Date().toISOString().split("T")[0];
    const dataInput = document.getElementById("data");
    dataInput.setAttribute("min", hoje);

    
    const dataMaxima = new Date();
    dataMaxima.setMonth(dataMaxima.getMonth() + 6); 
    const dataMaximaFormatada = dataMaxima.toISOString().split("T")[0]; 
    dataInput.setAttribute("max", dataMaximaFormatada); 

    dataInput.addEventListener('input', function() {
        const dataSelecionada = dataInput.value;
        if (dataSelecionada && (dataSelecionada > dataMaximaFormatada)) {
            dataInput.setCustomValidity("Você só pode fazer reservas até 6 meses a partir de hoje.");
        } else {
            dataInput.setCustomValidity("");
        }
    });
});

function selecionarHorario(horario, botao) {
    // Define o valor do campo oculto de horário
    document.getElementById('horario').value = horario;

    // Remove a classe 'selecionado' de todos os botões
    const botoes = document.querySelectorAll('.horario-opcao');
    botoes.forEach((botao) => {
        botao.classList.remove('selecionado');
    });

    // Adiciona a classe 'selecionado' ao botão clicado
    botao.classList.add('selecionado');
}


document.addEventListener("DOMContentLoaded", function() {
    // Definindo as opções de horário para 19:30 e 21:30
    const horarioInput = document.getElementById('horario');
    horarioInput.setAttribute('min', '19:30');  // Define o horário mínimo
    horarioInput.setAttribute('max', '21:30');  // Define o horário máximo
});

