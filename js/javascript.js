const formasPagamento = document.getElementById('formasPagamento');
const cartaoFields = document.getElementById('cartaoFields');
const boletoFields = document.getElementById('boletoFields');
const btnEnviar = document.getElementById('btnEnviar');

formasPagamento.addEventListener('change', () => {
    const valor = formasPagamento.value;

    // Exibir campos com base na seleção
    cartaoFields.classList.toggle('hidden', valor !== 'cartao');
    boletoFields.classList.toggle('hidden', valor !== 'boleto');

    // Exibir botão de envio se uma opção foi selecionada
    btnEnviar.classList.toggle('hidden', valor === '');
});

// Função para atualizar a imagem da bandeira do cartão
function updateCardFlag() {

    // Obtém o valor do radio button selecionado
    const bandeira = document.querySelector('input[name="bandeira"]:checked').value;
    
    // Mapeamento das bandeiras para os caminhos das imagens
    const bandeiras = {
        diners: 'img/diners.png',
        elo: 'img/elo.png',
        hiper: 'img/hiper.png',
        master: 'img/master.png',
        visa: 'img/visa.png'
    };
    
    // Atualizar o src da imagem de visualização do cartão
    const cardFlagPreview = document.getElementById('cardFlagPreview');

    if (bandeiras[bandeira]) {
        cardFlagPreview.src = bandeiras[bandeira];
    } else {
        cardFlagPreview.src = ''; // Caso não haja bandeira selecionada
    }

     // Ajustar a largura da imagem dependendo da bandeira selecionada
    const cardFlagPreviewImage = document.getElementById('cardFlagPreview');

    if (bandeira === 'hiper' || bandeira === 'master' || bandeira === 'visa') {
        cardFlagPreviewImage.style.width = '50px'; // Ajusta a largura para 50px
    } else {
        cardFlagPreviewImage.style.width = '30px'; // Ajusta a largura para 30px (Diners, Elo)
    }

}

// Função para formatar CPF
function formatCPF(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara de CPF
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    input.value = valor;

    updateCardPreview();  
}

function formatCardValidity(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 6) valor = valor.slice(0, 6); // Limita a 6 caracteres

    // Aplica a máscara MM/YYYY
    if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    }

    input.value = valor;

    // Verifica se a validade é menor que o mês atual
    if (valor.length === 7) {
        const [mes, ano] = valor.split('/').map(Number);
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth() + 1; // Janeiro é 0
        const anoAtual = dataAtual.getFullYear();

        if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
            alert('Validade do cartão inválida!');
        }
    }
    // Atualiza a visualização do cartão
    updateCardPreview();
}

function formatCardNumber() {
    const numeroCartao = document.getElementById('numeroCartao');
    let valor = numeroCartao.value.replace(/\D/g, '').slice(0, 16);
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    numeroCartao.value = valor;
    updateCardPreview();
}

function updateCardPreview() {
    document.getElementById('cardHolderPreview').textContent =
        document.getElementById('nomeCartao').value || 'Nome do Titular';

    document.getElementById('cardNumberPreview').textContent = ` 
        ${document.getElementById('numeroCartao').value}`;
        
    document.getElementById('cardValidadePreview').textContent = `Validade: 
        ${document.getElementById('validadeCartao').value}`;

    document.getElementById('cardCvvPreview').textContent =
        `CVV: ${document.getElementById('codigoSeguranca').value || '###'}`;

    document.getElementById('diaVencimentoCartaoPreview').textContent =
        `Vencimento Fatura: ${document.getElementById('diaVencimentoCartao').value || '###'}`;

    document.getElementById('cardCPFPreview').textContent =
        `CPF: ${document.getElementById('cpfCartao').value}`;
}
