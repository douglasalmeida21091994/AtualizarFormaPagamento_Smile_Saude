const formasPagamento = document.getElementById('formasPagamento');
const cartaoFields = document.getElementById('cartaoFields');
const boletoFields = document.getElementById('boletoFields');
const btnEnviar = document.getElementById('btnEnviar');

// Função para limpar campos do Boleto
function limparCamposBoleto() {
    // Limpar os campos relacionados ao boleto
    document.getElementById('nomeCompleto').value = '';
    document.getElementById('nomeMae').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('dataNascimento').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('vencMensalidadeBoleto').value = '';
    // Limpar campos Pro Rata
    document.getElementById('retornoProRata').textContent = '';
    document.getElementById('confirmProRata').checked = false;

}

// Função para limpar campos do Cartão
function limparCamposCartao() {
    // Limpar os campos relacionados ao cartão
    document.getElementById('nomeCartao').value = '';
    document.getElementById('numeroCartao').value = '';
    document.getElementById('validadeCartao').value = '';
    document.getElementById('codigoSeguranca').value = '';
    document.getElementById('diaVencimentoCartao').value = '';
    document.getElementById('cpfCartao').value = '';

    // Limpar dados do cartão virtual
    document.getElementById('cardHolderPreview').textContent = 'Nome do Titular';
    document.getElementById('cardNumberPreview').textContent = 'Número: ';
    document.getElementById('cardValidadePreview').textContent = 'Validade: ';
    document.getElementById('cardCvvPreview').textContent = 'CVV: ';
    document.getElementById('diaVencimentoCartaoPreview').textContent = 'Vencimento Fatura: ';
    document.getElementById('cardCPFPreview').textContent = 'CPF: ';
    document.getElementById('cardFlagPreview').src = '';

}

// Exibir ou ocultar campos com base na forma de pagamento
formasPagamento.addEventListener('change', () => {
    const valor = formasPagamento.value;

    // Exibir ou ocultar campos de acordo com a forma de pagamento selecionada
    cartaoFields.classList.toggle('hidden', valor !== 'cartao');
    boletoFields.classList.toggle('hidden', valor !== 'boleto');
    btnEnviar.classList.toggle('hidden', valor === '');

    // Limpar os dados do formulário dependendo da forma de pagamento selecionada
    if (valor === 'boleto') {
        limparCamposCartao(); // Limpar os campos do cartão
    } else if (valor === 'cartao') {
        limparCamposBoleto(); // Limpar os campos do boleto
    }
    
});


// Função para atualizar a imagem da bandeira do cartão
function updateCardFlag() {
    const bandeira = document.querySelector('input[name="bandeira"]:checked')?.value || '';
    const bandeiras = {
        diners: 'img/diners.png',
        elo: 'img/elo.png',
        hiper: 'img/hiper.png',
        master: 'img/master.png',
        visa: 'img/visa.png',
    };

    const cardFlagPreview = document.getElementById('cardFlagPreview');
    const cardFlagPreviewImage = document.getElementById('cardFlagPreview');

    if (bandeiras[bandeira]) {
        cardFlagPreview.src = bandeiras[bandeira];
        cardFlagPreviewImage.style.width = (bandeira === 'hiper' || bandeira === 'master' || bandeira === 'visa') ? '50px' : '30px';
    } else {
        cardFlagPreview.src = '';
    }
    updateCardPreview();
}

// Função para formatar CPF
function formatCPF(input) {
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = valor;
    updateCardPreview();
}

// Função para formatar a validade do cartão
function formatCardValidity(input) {
    let valor = input.value.replace(/\D/g, '').slice(0, 6);
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    input.value = valor;

    if (valor.length === 7) {
        const [mes, ano] = valor.split('/').map(Number);
        const dataAtual = new Date();
        if (ano < dataAtual.getFullYear() || (ano === dataAtual.getFullYear() && mes < dataAtual.getMonth() + 1)) {
            alert('Validade do cartão inválida!');
        }
    }
    updateCardPreview();
}

// Função para formatar o número do cartão
function formatCardNumber() {
    const numeroCartao = document.getElementById('numeroCartao');
    let valor = numeroCartao.value.replace(/\D/g, '').slice(0, 16);
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    numeroCartao.value = valor;
    updateCardPreview();
}

// Atualiza a pré-visualização do cartão
function updateCardPreview() {
    document.getElementById('cardHolderPreview').textContent =
        document.getElementById('nomeCartao').value || 'Nome do Titular';

    document.getElementById('cardNumberPreview').textContent =
        document.getElementById('numeroCartao').value || '**** **** **** ****';

    document.getElementById('cardValidadePreview').textContent =
        `Validade: ${document.getElementById('validadeCartao').value || 'MM/AAAA'}`;

    document.getElementById('cardCvvPreview').textContent =
        `CVV: ${document.getElementById('codigoSeguranca').value || '***'}`;

    document.getElementById('diaVencimentoCartaoPreview').textContent =
        `Venc. Fatura: ${document.getElementById('diaVencimentoCartao').value}`;

    document.getElementById('cardCPFPreview').textContent =
        `CPF: ${document.getElementById('cpfCartao').value}`;
}

// Função de validação
function validarCampos() {
    const formaPagamento = formasPagamento.value;
    if (formaPagamento === 'cartao') {
        const camposCartao = [
            'nomeCartao',
            'numeroCartao',
            'validadeCartao',
            'codigoSeguranca',
            'diaVencimentoCartao',
            'cpfCartao'
        ].map(id => document.getElementById(id).value);
        return camposCartao.every(campo => campo.trim() !== '') &&
            !!document.querySelector('input[name="bandeira"]:checked');
    } else if (formaPagamento === 'boleto') {
        const camposBoleto = [
            'nomeCompleto',
            'nomeMae',
            'cpf',
            'dataNascimento',
            'email',
            'telefone'
        ].map(id => document.getElementById(id).value);
        return camposBoleto.every(campo => campo.trim() !== '');
    }
    return false;
}

// Permitir apenas caracteres específicos
function allowSpecificCharacters(input) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9\/\-.]/g, '');
    });
}

// Aplica a restrição em campos específicos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[inputmode="numeric"]').forEach(input => allowSpecificCharacters(input));
});

// Função para enviar o formulário
btnEnviar.addEventListener('click', (e) => {
    e.preventDefault();
    if (validarCampos()) {
        alert('Sua solicitação foi enviada com sucesso! Em breve será atendida.');
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});

// FORMATAÇÃO CPF BOLETOS
document.addEventListener('DOMContentLoaded', () => {
    const numericInputs = document.querySelectorAll('input[inputmode="numeric"]');
    numericInputs.forEach(input => allowSpecificCharacters(input));

    // Adiciona a máscara de CPF BOLETOS ao campo específico
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', () => formatCPF(cpfInput));
    }
});

// Função para formatar CPF BOLETOS
function formatCPF(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara de CPF BOLETOS
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    input.value = valor;
}

// FORMATAÇÃO TELEFONE BOLETO
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona a máscara ao campo de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => formatTelefone(telefoneInput));
    }
});

// Função para formatar o telefone
function formatTelefone(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara de telefone
    if (valor.length <= 2) {
        valor = `(${valor}`;
    } else if (valor.length <= 6) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length <= 10) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 3)} ${valor.slice(3, 7)}-${valor.slice(7)}`;
    }

    input.value = valor;
}

// Função para fechar o modal
// function closeModal() {
//     document.getElementById("modal").style.display = "none";
//     document.body.classList.remove("modal-open");
// }

// Exibe o modal assim que a página carrega  // DESCOMENTAR DEPOIS
// window.onload = function () {
//     document.getElementById("modal").style.display = "flex";
//     document.body.classList.add("modal-open");
// };

// // Adiciona a funcionalidade de envio do formulário, caso necessário
// document.getElementById("form").addEventListener("submit", function (event) {
//     event.preventDefault(); // Impede o envio do formulário para teste
//     closeModal(); // Fecha o modal ao submeter
// });

// FUNÇÃO CHAMANDO API PARA VERIFICAR SE HÁ ALTERAÇÃO DE VENCIMENTO PARA PRO RATA

// Função que será chamada quando o blur for disparado
function chamarAPI(campoId) {
    let valor = document.getElementById(campoId).value;
    // alert(valor);
    // Exemplo de como enviar para a API, adaptando para o que você precisa
    const param1 = '0801117.00';
    const param2 = '5';

    // Construct the URL with query parameters
    const apiUrl = `http://ws.smilesaude.com.br/api/forma-pagamento/pro-rata/${param1}/${param2}`;

    // Make the GET request
    fetch(apiUrl, {
        method: 'GET', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Set the header
        },
        mode: 'no-cors'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log('API Response:', data); // Handle the data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); // Handle errors
        });
}

// Adiciona o evento blur para o campo vencMensalidadeBoleto
document.getElementById('vencMensalidadeBoleto').addEventListener('blur', function () {
    chamarAPI('vencMensalidadeBoleto');
});

// Adiciona o evento blur para o campo diaVencimentoCartao
document.getElementById('diaVencimentoCartao').addEventListener('blur', function () {
    chamarAPI('diaVencimentoCartao');
});

flatpickr("#dataNascimento", {
    dateFormat: "d/m/Y", // Formato de data (dd/mm/aaaa)
    maxDate: "today",    // Limita a data máxima ao dia de hoje
    locale: "pt"         // Idioma em português
});



