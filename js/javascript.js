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
    document.getElementById('cardNumberPreview').textContent =
        document.getElementById('numeroCartao').value || '#### #### #### ####';
    document.getElementById('cardCvvPreview').textContent =
        `CVV: ${document.getElementById('codigoSeguranca').value || '###'}`;
}
