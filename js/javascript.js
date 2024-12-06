const formasPagamento = document.getElementById('formasPagamento');
const cartaoFields = document.getElementById('cartaoFields');
const boletoFields = document.getElementById('boletoFields');
const btnEnviar = document.getElementById('btnEnviar');

// Exibir ou ocultar campos com base na forma de pagamento
formasPagamento.addEventListener('change', () => {
    const valor = formasPagamento.value;

    cartaoFields.classList.toggle('hidden', valor !== 'cartao');
    boletoFields.classList.toggle('hidden', valor !== 'boleto');
    btnEnviar.classList.toggle('hidden', valor === '');
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
        `Vencimento Fatura: ${document.getElementById('diaVencimentoCartao').value || 'DD'}`;

    document.getElementById('cardCPFPreview').textContent =
        `CPF: ${document.getElementById('cpfCartao').value || '000.000.000-00'}`;
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

