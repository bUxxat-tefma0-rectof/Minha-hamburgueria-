// Tema
function toggleTheme() {
    const theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = theme;
}

// Carrinho
let carrinho = [];
let saldo = 0;

function abrirModalItem(nome, preco, descricao, estoque) {
    document.getElementById('modal-descricao').innerHTML = `${nome}<br>${descricao}`;
    document.getElementById('modal-preco').textContent = preco.toFixed(2);
    document.getElementById('modal-estoque').textContent = estoque;
    const btnAdicionar = document.getElementById('btn-adicionar');
    const saldoInsuficiente = document.getElementById('modal-saldo-insuficiente');
    const totalCarrinho = carrinho.reduce((sum, item) => sum + item.preco, 0);
    if (saldo < totalCarrinho + preco) {
        saldoInsuficiente.classList.remove('d-none');
        document.getElementById('modal-falta').textContent = ((totalCarrinho + preco) - saldo).toFixed(2);
        btnAdicionar.disabled = true;
    } else {
        saldoInsuficiente.classList.add('d-none');
        btnAdicionar.disabled = false;
    }
    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    modal.show();
}

function adicionarAoCarrinho() {
    const nome = document.getElementById('modal-descricao').textContent.split('<br>')[0];
    const preco = parseFloat(document.getElementById('modal-preco').textContent);
    carrinho.push({ nome, preco });
    atualizarCarrinho();
    bootstrap.Modal.getInstance(document.getElementById('itemModal')).hide();
    setTimeout(() => location.reload(), 1000); // Recarga automática
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `
            <li class="list-group-item bg-dark text-light">
                ${item.nome} - R$${item.preco.toFixed(2)}
                <button class="btn btn-sm btn-danger float-end" onclick="removerDoCarrinho(${index})">Remover</button>
            </li>
        `;
    });
    document.getElementById('carrinho-total').textContent = total.toFixed(2);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    setTimeout(() => location.reload(), 1000); // Recarga automática
}

function finalizarCompra() {
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    if (saldo < total) {
        alert('Saldo insuficiente! Recarregue seu saldo.');
        abrirModalRecarga();
        return;
    }
    // Integração com API de Pix (placeholder)
    alert('Gerando QR Code para pagamento de R$' + total.toFixed(2));
    document.getElementById('qrcode').innerHTML = `<p>QR Code gerado para R$${total.toFixed(2)} (Expira em 10 min)</p>`;
    setTimeout(() => {
        saldo -= total;
        document.getElementById('saldo').textContent = saldo.toFixed(2);
        carrinho = [];
        atualizarCarrinho();
        location.reload();
    }, 2000); // Simula pagamento
}

function abrirModalRecarga() {
    const modal = new bootstrap.Modal(document.getElementById('recargaModal'));
    modal.show();
}

document.getElementById('recarga-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = parseFloat(document.getElementById('valor-recarga').value);
    if (valor < 10) {
        alert('Valor mínimo de recarga é R$10,00');
        return;
    }
    // Integração com API de Pix
    document.getElementById('qrcode').innerHTML = `<p>QR Code gerado para R$${valor.toFixed(2)} (Expira em 10 min)</p>`;
    setTimeout(() => {
        saldo += valor;
        document.getElementById('saldo').textContent = saldo.toFixed(2);
        bootstrap.Modal.getInstance(document.getElementById('recargaModal')).hide();
        location.reload();
    }, 2000); // Simula recarga
});

function gerarPDF() {
    alert('Gerando PDF do histórico...');
    // Integração com jsPDF no futuro
}
