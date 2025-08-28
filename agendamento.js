// Dados dos serviços disponíveis
const servicos = {
    'trancas-com-material': [
        { id: 'tranca-chanel', nome: 'Chanel', preco: 110.00 },
        { id: 'tranca-feixo', nome: 'Até o feixo', preco: 215.00 },
        { id: 'tranca-cintura', nome: 'Até a Cintura', preco: 237.00 },
        { id: 'tranca-bumbum', nome: 'Até o Bumbum', preco: 310.00 }
    ],
    'trancas-sem-material': [
        { id: 'tranca-boxeadora', nome: 'Boxeadora', preco: 120.00 },
        { id: 'tranca-ghana', nome: 'Ghana Braids', preco: 180.00 },
        { id: 'tranca-rabo-cavalo', nome: 'Rabo de Cavalo', preco: 180.00 },
        { id: 'tranca-fulani', nome: 'Fulani Braids', preco: 180.00 },
        { id: 'tranca-gypsy', nome: 'Gypsy Braids', preco: 180.00 },
        { id: 'tranca-boho', nome: 'Boho Braids', preco: 180.00 },
        { id: 'tranca-box', nome: 'Box Braids', preco: 180.00 }
    ],
    'estilos-especiais': [
        { id: 'nago-tira', nome: 'Nagô Tira', preco: 40.00 },
        { id: 'lateral-topo', nome: 'Lateral ou Topo', preco: 25.00 },
        { id: 'nago-lateral', nome: 'Nagô Lateral', preco: 25.00 },
        { id: 'nago-bolhas', nome: 'Nagô Bolhas', preco: 50.00 },
        { id: 'nago-topo', nome: 'Nagô Topo', preco: 50.00 },
        { id: 'nago-diademas', nome: 'Nagô Diademas', preco: 100.00 },
        { id: 'nago-coracao', nome: 'Nagô Coração', preco: 5.00 },
        { id: 'nago-coracao-tira', nome: 'Nagô Coração | C/ Tira', preco: 100.00 }
    ],
    'mega-hair': [
        { id: 'mega-hair-entrelace', nome: 'Mega Hair Entrelace (Sem Material)', preco: 190.00 },
        { id: 'mega-hair-organico', nome: 'Mega Hair Entrelace | Cabelo Orgânico', preco: 375.00 },
        { id: 'mega-hair-humano', nome: 'Mega Hair Entrelace | Cabelo Humano', preco: 840.00 }
    ]
};

// Inicialização do calendário
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let diasSelecionaveis = [];

// Função para inicializar o calendário
function inicializarCalendario() {
    // Configurar os botões de navegação do calendário
    document.getElementById('mes-anterior').addEventListener('click', function() {
        mesAtual--;
        if (mesAtual < 0) {
            mesAtual = 11;
            anoAtual--;
        }
        renderizarCalendario(mesAtual, anoAtual);
    });
    
    document.getElementById('proximo-mes').addEventListener('click', function() {
        mesAtual++;
        if (mesAtual > 11) {
            mesAtual = 0;
            anoAtual++;
        }
        renderizarCalendario(mesAtual, anoAtual);
    });
    
    // Gerar dias selecionáveis (exemplo: próximos 60 dias, exceto domingos)
    const hoje = new Date();
    for (let i = 1; i <= 60; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        
        // Excluir domingos (0 = domingo, 6 = sábado)
        if (data.getDay() !== 0) {
            diasSelecionaveis.push(data);
        }
    }
    
    // Renderizar o calendário inicial
    renderizarCalendario(mesAtual, anoAtual);
}

// Função para renderizar o calendário
function renderizarCalendario(mes, ano) {
    const diasContainer = document.getElementById('dias-calendario');
    const nomeMes = document.getElementById('nome-mes');
    
    // Limpar o container de dias
    diasContainer.innerHTML = '';
    
    // Atualizar o nome do mês e ano
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    nomeMes.textContent = `${nomesMeses[mes]} ${ano}`;
    
    // Obter o primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    // Adicionar dias vazios para alinhar com o dia da semana correto
    const diaDaSemana = primeiroDia.getDay(); // 0 = domingo, 1 = segunda, etc.
    for (let i = 0; i < diaDaSemana; i++) {
        const diaVazio = document.createElement('div');
        diaVazio.classList.add('dia', 'vazio');
        diasContainer.appendChild(diaVazio);
    }
    
    // Adicionar os dias do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const diaEl = document.createElement('div');
        diaEl.classList.add('dia');
        diaEl.textContent = i;
        
        // Verificar se o dia é selecionável
        const dataAtual = new Date(ano, mes, i);
        const ehSelecionavel = diasSelecionaveis.some(data => 
            data.getDate() === dataAtual.getDate() && 
            data.getMonth() === dataAtual.getMonth() && 
            data.getFullYear() === dataAtual.getFullYear()
        );
        
        if (ehSelecionavel) {
            diaEl.classList.add('selecionavel');
            diaEl.addEventListener('click', function() {
                // Remover seleção anterior
                const diasSelecionados = document.querySelectorAll('.dia.selecionado');
                diasSelecionados.forEach(dia => dia.classList.remove('selecionado'));
                
                // Adicionar seleção ao dia clicado
                diaEl.classList.add('selecionado');
                
                // Atualizar o campo de data
                const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                document.getElementById('data').value = dataFormatada;
                
                // Atualizar horários disponíveis
                atualizarHorariosDisponiveis(dataFormatada);
                
                // Atualizar o resumo
                atualizarResumo();
            });
        } else {
            diaEl.classList.add('indisponivel');
        }
        
        diasContainer.appendChild(diaEl);
    }
}

// Função para atualizar os horários disponíveis
function atualizarHorariosDisponiveis(data) {
    const horarioSelect = document.getElementById('horario');
    const horariosLista = document.getElementById('horarios-lista');
    
    // Limpar opções anteriores no select
    horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    // Limpar a lista de horários
    horariosLista.innerHTML = '';
    
    // Exemplo de horários disponíveis (em uma aplicação real, isso viria do backend)
    const horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    // Adicionar horários disponíveis ao select e à lista
    horarios.forEach(horario => {
        // Adicionar ao select
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horarioSelect.appendChild(option);
        
        // Adicionar à lista visual
        const horarioItem = document.createElement('div');
        horarioItem.classList.add('horario-item');
        horarioItem.textContent = horario;
        horarioItem.addEventListener('click', function() {
            // Remover seleção anterior
            document.querySelectorAll('.horario-item.selecionado').forEach(el => {
                el.classList.remove('selecionado');
            });
            
            // Adicionar seleção ao horário clicado
            horarioItem.classList.add('selecionado');
            
            // Atualizar o select de horário
            horarioSelect.value = horario;
            
            // Disparar evento de change para atualizar o resumo
            const event = new Event('change');
            horarioSelect.dispatchEvent(event);
        });
        
        horariosLista.appendChild(horarioItem);
    });
    
    // Habilitar o select de horário
    horarioSelect.disabled = false;
}

// Função para configurar o formulário
function configurarFormulario() {
    const form = document.getElementById('agendamento-form');
    
    // Adicionar evento de submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar o formulário
        if (validarFormulario()) {
            // Obter os dados do formulário
            const dadosAgendamento = obterDadosAgendamento();
            
            // Enviar por email e WhatsApp
            enviarPorEmail(dadosAgendamento);
            enviarPorWhatsApp(dadosAgendamento);
            
            alert('Agendamento realizado com sucesso! Os detalhes foram enviados para seu email e WhatsApp.');
            form.reset();
        }
    });
    
    // Adicionar eventos de change para atualizar o resumo
    const camposFormulario = ['categoria-servico', 'servico', 'data', 'horario'];
    camposFormulario.forEach(campo => {
        document.getElementById(campo).addEventListener('change', atualizarResumo);
    });
}

// Função para validar o formulário
function validarFormulario() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const categoria = document.getElementById('categoria-servico').value;
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    
    if (!nome || !telefone || !email || !categoria || !servico || !data || !horario) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de email válido.');
        return false;
    }
    
    // Validar formato de telefone (deve ter pelo menos 14 caracteres com a formatação)
    if (telefone.length < 14) {
        alert('Por favor, insira um número de telefone válido.');
        return false;
    }
    
    return true;
}

// Função para configurar a seleção de serviços
function configurarSelecaoServicos() {
    const categoriaSelect = document.getElementById('categoria-servico');
    const servicoSelect = document.getElementById('servico');
    
    // Adicionar as categorias ao select
    for (const categoria in servicos) {
        const option = document.createElement('option');
        option.value = categoria;
        
        // Formatar o nome da categoria para exibição
        let nomeCategoria = categoria.replace(/-/g, ' ');
        nomeCategoria = nomeCategoria.charAt(0).toUpperCase() + nomeCategoria.slice(1);
        
        option.textContent = nomeCategoria;
        categoriaSelect.appendChild(option);
    }
    
    // Adicionar evento de change para atualizar os serviços disponíveis
    categoriaSelect.addEventListener('change', function() {
        // Limpar opções anteriores
        servicoSelect.innerHTML = '<option value="">Selecione um serviço</option>';
        
        // Obter a categoria selecionada
        const categoriaSelecionada = categoriaSelect.value;
        
        if (categoriaSelecionada && servicos[categoriaSelecionada]) {
            // Adicionar os serviços da categoria selecionada
            servicos[categoriaSelecionada].forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = servico.nome;
                option.dataset.nome = servico.nome;
                option.dataset.preco = servico.preco;
                servicoSelect.appendChild(option);
            });
            
            // Habilitar o select de serviço
            servicoSelect.disabled = false;
        } else {
            // Desabilitar o select de serviço se nenhuma categoria for selecionada
            servicoSelect.disabled = true;
        }
        
        // Atualizar o resumo
        atualizarResumo();
    });
    
    // Adicionar evento de change para o select de serviço
    servicoSelect.addEventListener('change', atualizarResumo);
}

// Função para atualizar o resumo do agendamento
function atualizarResumo() {
    const resumoEl = document.getElementById('resumo-conteudo');
    const precoTotalEl = document.getElementById('preco-total');
    
    const categoriaSelect = document.getElementById('categoria-servico');
    const servicoSelect = document.getElementById('servico');
    const dataInput = document.getElementById('data');
    const horarioSelect = document.getElementById('horario');
    
    // Verificar se todos os campos necessários estão preenchidos
    if (categoriaSelect.value && servicoSelect.value && dataInput.value && horarioSelect.value) {
        const servicoOption = servicoSelect.options[servicoSelect.selectedIndex];
        const nomeServico = servicoOption.dataset.nome;
        const precoServico = parseFloat(servicoOption.dataset.preco);
        
        // Verificar se há um preço selecionado no localStorage
        const precoSelecionado = localStorage.getItem('precoSelecionado');
        const precoFinal = precoSelecionado ? parseFloat(precoSelecionado.replace(',', '.')) : precoServico;
        
        // Formatar a data
        const data = new Date(dataInput.value);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        
        // Atualizar o resumo
        resumoEl.innerHTML = `
            <p><strong>Serviço:</strong> ${nomeServico}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Horário:</strong> ${horarioSelect.value}</p>
        `;
        
        // Atualizar o preço total
        precoTotalEl.innerHTML = `<p>Total: R$ ${precoFinal.toFixed(2)}</p>`;
        
        // Se houver um preço selecionado, destacar essa informação
        if (precoSelecionado) {
            precoTotalEl.innerHTML += `<p class="preco-destaque">Preço selecionado na tabela!</p>`;
        }
    }
}

// Função para verificar e processar serviço pré-selecionado
function verificarServicoPréSelecionado() {
    // Verificar se há um serviço selecionado no localStorage
    const servicoSelecionado = localStorage.getItem('servicoSelecionado');
    const precoSelecionado = localStorage.getItem('precoSelecionado');
    
    if (servicoSelecionado) {
        console.log('Serviço selecionado:', servicoSelecionado);
        console.log('Preço selecionado:', precoSelecionado);
        // Limpar o localStorage para não persistir a seleção em futuras visitas
        localStorage.removeItem('servicoSelecionado');
        localStorage.removeItem('precoSelecionado');
        
        // Mapeamento de IDs da tabela de preços para IDs no sistema de agendamento
        const idMapping = {
            // Trancas com material
            'tranca-chanel': 'tranca-chanel',
            'tranca-feixo': 'tranca-feixo',
            'tranca-cintura': 'tranca-cintura',
            'tranca-bumbum': 'tranca-bumbum',
            
            // Trancas sem material
            'boxeadora': 'tranca-boxeadora',
            'ghana-braids': 'tranca-ghana',
            'rabo-cavalo': 'tranca-rabo-cavalo',
            'fulani-braids': 'tranca-fulani',
            'gypsy-braids': 'tranca-gypsy',
            'boho-braids': 'tranca-boho',
            'box-braids': 'tranca-box',
            'nago-tira': 'nago-tira',
            'lateral-topo': 'lateral-topo',
            'nago-lateral': 'nago-lateral',
            'nago-bolhas': 'nago-bolhas',
            'nago-topo': 'nago-topo',
            'nago-diademas': 'nago-diademas',
            'nago-coracao': 'nago-coracao',
            'nago-coracao-tira': 'nago-coracao-tira',
            
            // Mega Hair
            'mega-hair-sem-material': 'mega-hair-entrelace',
            'mega-hair-organico': 'mega-hair-organico',
            'mega-hair-humano': 'mega-hair-humano'
        };
        
        // Converter o ID da tabela para o ID do sistema de agendamento, se necessário
        const servicoId = idMapping[servicoSelecionado] || servicoSelecionado;
        
        // Identificar a categoria do serviço
        let categoriaEncontrada = '';
        let servicoEncontrado = null;
        
        // Procurar o serviço nas categorias disponíveis
        for (const categoria in servicos) {
            const servicoArray = servicos[categoria].find(s => s.id === servicoId);
            if (servicoArray) {
                categoriaEncontrada = categoria;
                servicoEncontrado = servicoArray;
                break;
            }
        }
        
        // Se encontrou o serviço, pré-selecionar no formulário
        if (categoriaEncontrada && servicoEncontrado) {
            // Selecionar a categoria
            const categoriaSelect = document.getElementById('categoria-servico');
            categoriaSelect.value = categoriaEncontrada;
            
            // Disparar o evento change para popular o select de serviços
            const event = new Event('change');
            categoriaSelect.dispatchEvent(event);
            
            // Selecionar o serviço específico (com um pequeno delay para garantir que o select foi populado)
            setTimeout(() => {
                const servicoSelect = document.getElementById('servico');
                for (let i = 0; i < servicoSelect.options.length; i++) {
                    const option = servicoSelect.options[i];
                    if (option.value === servicoId) {
                        servicoSelect.selectedIndex = i;
                        
                        // Disparar o evento change para atualizar o resumo
                        const servicoEvent = new Event('change');
                        servicoSelect.dispatchEvent(servicoEvent);
                        break;
                    }
                }
                
                // Rolar a página até o formulário
                document.querySelector('.agendamento-form-container').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            console.log('Serviço não encontrado:', servicoId);
        }
    }
}

// Função para obter todos os dados do agendamento
function obterDadosAgendamento() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const observacoes = document.getElementById('observacoes').value;
    
    const categoriaSelect = document.getElementById('categoria-servico');
    const categoriaNome = categoriaSelect.options[categoriaSelect.selectedIndex].text;
    
    const servicoSelect = document.getElementById('servico');
    const servicoOption = servicoSelect.options[servicoSelect.selectedIndex];
    const nomeServico = servicoOption.dataset.nome;
    
    // Verificar se há um preço selecionado no localStorage
    const precoSelecionado = localStorage.getItem('precoSelecionado');
    const precoServico = parseFloat(servicoOption.dataset.preco);
    const precoFinal = precoSelecionado ? parseFloat(precoSelecionado.replace(',', '.')) : precoServico;
    
    // Formatar a data
    const dataInput = document.getElementById('data').value;
    const data = new Date(dataInput);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    
    const horario = document.getElementById('horario').value;
    
    return {
        nome,
        telefone,
        email,
        observacoes,
        categoriaNome,
        nomeServico,
        precoFinal,
        dataFormatada,
        horario
    };
}

// Função para enviar os dados por email
function enviarPorEmail(dados) {
    // Obter configurações atualizadas do salão
    const configSalao = getConfigSalao();
    
    console.log('Enviando email para cliente:', dados.email);
    console.log('Enviando email para salão:', configSalao.email);
    
    // Preparar os dados para o template do EmailJS (email para o cliente)
    const templateParamsCliente = {
        to_name: dados.nome,
        to_email: dados.email,
        from_name: configSalao.nome,
        from_email: configSalao.email,
        servico: dados.nomeServico,
        categoria: dados.categoriaNome,
        data: dados.dataFormatada,
        horario: dados.horario,
        preco: dados.precoFinal.toFixed(2),
        observacoes: dados.observacoes || 'Nenhuma observação adicional',
        telefone_cliente: dados.telefone,
        telefone_salao: configSalao.telefone,
        endereco_salao: configSalao.endereco
    };
    
    // Preparar os dados para o template do EmailJS (email para o salão)
    const templateParamsSalao = {
        to_name: configSalao.nome,
        to_email: configSalao.email,
        from_name: 'Sistema de Agendamento',
        from_email: 'noreply@sistema.com',
        cliente_nome: dados.nome,
        cliente_email: dados.email,
        cliente_telefone: dados.telefone,
        servico: dados.nomeServico,
        categoria: dados.categoriaNome,
        data: dados.dataFormatada,
        horario: dados.horario,
        preco: dados.precoFinal.toFixed(2),
        observacoes: dados.observacoes || 'Nenhuma observação adicional'
    };
    
    // Enviar email usando EmailJS
    // Você precisa substituir 'service_id' e 'template_id' pelos seus IDs do EmailJS
    // Para usar esta funcionalidade, descomente o código abaixo e configure sua conta EmailJS
    
    /* 
    // Enviar email para o cliente
    emailjs.send('service_id', 'template_cliente_id', templateParamsCliente)
        .then(function(response) {
            console.log('Email enviado para o cliente com sucesso!', response.status, response.text);
        }, function(error) {
            console.error('Falha ao enviar email para o cliente:', error);
        });
        
    // Enviar email para o salão
    emailjs.send('service_id', 'template_salao_id', templateParamsSalao)
        .then(function(response) {
            console.log('Email enviado para o salão com sucesso!', response.status, response.text);
        }, function(error) {
            console.error('Falha ao enviar email para o salão:', error);
        });
    */
    
    // Enquanto o EmailJS não estiver configurado, exibimos apenas no console
    console.log('Dados do agendamento para email do cliente:', templateParamsCliente);
    console.log('Dados do agendamento para email do salão:', templateParamsSalao);
    console.log('Para ativar o envio real de emails, configure sua conta EmailJS e descomente o código acima.');
}

// Obter configurações do salão do sistema de administração
function getConfigSalao() {
    // Verificar se a função global está disponível
    if (typeof window.obterConfiguracoesSalao === 'function') {
        return window.obterConfiguracoesSalao();
    } else {
        // Configurações padrão caso a função não esteja disponível
        return {
            telefone: '11999999999',
            nome: 'Salão de Beleza Rute Assis',
            email: 'contato@salaorute.com.br',
            endereco: 'Rua Exemplo, 123 - São Paulo/SP'
        };
    }
}

// Função para enviar os dados por WhatsApp
function enviarPorWhatsApp(dados) {
    // Obter configurações atualizadas do salão
    const configSalao = getConfigSalao();
    
    // Criar a mensagem para o salão (não enviamos para o cliente, apenas para o salão)
    const mensagemSalao = `*Novo Agendamento Recebido*\n\n` +
        `*Dados do Cliente:*\n` +
        `- Nome: ${dados.nome}\n` +
        `- Telefone: ${dados.telefone}\n` +
        `- Email: ${dados.email}\n\n` +
        `*Detalhes do Agendamento:*\n` +
        `- Serviço: ${dados.nomeServico} (${dados.categoriaNome})\n` +
        `- Data: ${dados.dataFormatada}\n` +
        `- Horário: ${dados.horario}\n` +
        `- Valor: R$ ${dados.precoFinal.toFixed(2)}\n\n` +
        `${dados.observacoes ? '*Observações:* ' + dados.observacoes : 'Sem observações adicionais'}`;
    
    // Codificar a mensagem para URL
    const mensagemSalaoCodificada = encodeURIComponent(mensagemSalao);
    
    // Criar o link do WhatsApp para o salão
    const linkWhatsAppSalao = `https://wa.me/55${configSalao.telefone.replace(/\D/g, '')}?text=${mensagemSalaoCodificada}`;
    
    // Enviar mensagem automaticamente para o salão
    // Usamos uma iframe oculta para enviar a mensagem sem interação do usuário
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow.location.href = linkWhatsAppSalao;
    
    // Registrar no console para fins de depuração
    console.log('Mensagem enviada automaticamente para o salão:', mensagemSalao);
    
    // Exibir mensagem de confirmação para o cliente
    const mensagemConfirmacao = document.createElement('div');
    mensagemConfirmacao.className = 'mensagem-confirmacao';
    mensagemConfirmacao.innerHTML = `
        <div class="confirmacao-conteudo">
            <h3>Agendamento Confirmado!</h3>
            <p>Olá ${dados.nome}, seu agendamento foi confirmado com sucesso!</p>
            <p><strong>Detalhes do agendamento:</strong></p>
            <ul>
                <li>Serviço: ${dados.nomeServico} (${dados.categoriaNome})</li>
                <li>Data: ${dados.dataFormatada}</li>
                <li>Horário: ${dados.horario}</li>
                <li>Valor: R$ ${dados.precoFinal.toFixed(2)}</li>
            </ul>
            ${dados.observacoes ? '<p><strong>Observações:</strong> ' + dados.observacoes + '</p>' : ''}
            <p>Agradecemos pela preferência!</p>
            <p>Em caso de dúvidas, entre em contato conosco pelo telefone ${configSalao.telefone}.</p>
            <button id="fechar-confirmacao">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(mensagemConfirmacao);
    
    // Adicionar estilo para a mensagem de confirmação
    const style = document.createElement('style');
    style.textContent = `
        .mensagem-confirmacao {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .confirmacao-conteudo {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .confirmacao-conteudo h3 {
            color: #ff6b6b;
            margin-top: 0;
        }
        .confirmacao-conteudo ul {
            padding-left: 20px;
            display: block;
        }
        .confirmacao-conteudo li {
            margin-bottom: 5px;
            display: list-item;
        }
        #fechar-confirmacao {
            background-color: #ff6b6b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
        }
        #fechar-confirmacao:hover {
            background-color: #ff5252;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar evento para fechar a mensagem de confirmação
    document.getElementById('fechar-confirmacao').addEventListener('click', function() {
        document.body.removeChild(mensagemConfirmacao);
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o calendário
    inicializarCalendario();
    
    // Configurar os eventos de formulário
    configurarFormulario();
    
    // Configurar a seleção de serviços
    configurarSelecaoServicos();
    
    // Verificar se há um serviço pré-selecionado (vindo da tabela de preços)
    verificarServicoPréSelecionado();
});

const telefoneInput = document.getElementById('telefone');

    telefoneInput.addEventListener('input', function (e) {
        let input = e.target.value.replace(/\D/g, ''); // remove tudo que não for número

        if (input.length > 11) {
            input = input.slice(0, 11); // limita a 11 dígitos
        }

        let formatted = '';

        if (input.length > 0) {
            formatted += '(' + input.substring(0, 2);
        }
        if (input.length >= 3) {
            formatted += ') ' + input.substring(2, 7);
        }
        if (input.length >= 8) {
            formatted += '-' + input.substring(7, 11);
        }

        e.target.value = formatted;
    });