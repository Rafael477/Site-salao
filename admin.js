document.addEventListener('DOMContentLoaded', function () {
    // Configuração inicial
    inicializarAdmin();

    // Configurar eventos
    configurarLogin();
    configurarAbas();
    configurarFormularios();
    configurarLogout();
});

// Objeto para armazenar as configurações do salão
const configSalao = {
    nome: 'Salão de Beleza Rute Assis',
    telefone: '(11) 98765-4321',
    email: 'contato@salaorute.com.br',
    endereco: 'Rua Exemplo, 123 - São Paulo/SP',
    horarios: {
        segunda: { abertura: '09:00', fechamento: '19:00', fechado: false },
        terca: { abertura: '09:00', fechamento: '19:00', fechado: false },
        quarta: { abertura: '09:00', fechamento: '19:00', fechado: false },
        quinta: { abertura: '09:00', fechamento: '19:00', fechado: false },
        sexta: { abertura: '09:00', fechamento: '20:00', fechado: false },
        sabado: { abertura: '08:00', fechamento: '18:00', fechado: false },
        domingo: { abertura: '', fechamento: '', fechado: true }
    },
    sistema: {
        intervaloAgendamento: 60,
        diasAntecedencia: 60,
        notificacaoEmail: true,
        notificacaoWhatsApp: true
    },
    // Credenciais de acesso (em produção, isso deve ser armazenado no servidor)
    credenciais: {
        usuario: 'admin',
        senha: 'admin123'
    }
};

/**
 * Inicializa a área administrativa
 */
function inicializarAdmin() {
    // Verificar se há configurações salvas no localStorage
    const configSalva = localStorage.getItem('configSalao');
    if (configSalva) {
        // Mesclar as configurações salvas com as padrões
        const configCarregada = JSON.parse(configSalva);
        Object.assign(configSalao, configCarregada);
    }

    // Preencher os formulários com as configurações atuais
    preencherFormularios();
}

/**
 * Configura o formulário de login
 */
function configurarLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        // Verificar credenciais
        if (usuario === configSalao.credenciais.usuario && senha === configSalao.credenciais.senha) {
            // Login bem-sucedido
            document.getElementById('login-area').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';

            // Limpar campos de login
            loginForm.reset();
        } else {
            // Credenciais inválidas
            alert('Usuário ou senha incorretos. Por favor, tente novamente.');
        }
    });
}

/**
 * Configura as abas do painel administrativo
 */
function configurarAbas() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remover classe ativa de todos os botões
            tabBtns.forEach(b => b.classList.remove('active'));

            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');

            // Ocultar todos os conteúdos de abas
            tabContents.forEach(content => content.style.display = 'none');

            // Exibir o conteúdo da aba selecionada
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
}

/**
 * Preenche os formulários com as configurações atuais
 */
function preencherFormularios() {
    // Preencher formulário de contato
    if (document.getElementById('nome-salao')) {
        document.getElementById('nome-salao').value = configSalao.nome;
        document.getElementById('telefone-salao').value = configSalao.telefone;
        document.getElementById('email-salao').value = configSalao.email;
        document.getElementById('endereco-salao').value = configSalao.endereco;
    }

    // Preencher formulário de horários
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    diasSemana.forEach(dia => {
        const horario = configSalao.horarios[dia];
        if (horario && document.getElementById(`${dia}-abertura`)) {
            document.getElementById(`${dia}-abertura`).value = horario.abertura;
            document.getElementById(`${dia}-fechamento`).value = horario.fechamento;
            document.getElementById(`${dia}-fechado`).checked = horario.fechado;

            // Desabilitar campos de horário se estiver fechado
            if (horario.fechado) {
                document.getElementById(`${dia}-abertura`).disabled = true;
                document.getElementById(`${dia}-fechamento`).disabled = true;
            }
        }
    });

    // Preencher formulário de sistema
    if (document.getElementById('intervalo-agendamento')) {
        document.getElementById('intervalo-agendamento').value = configSalao.sistema.intervaloAgendamento;
        document.getElementById('dias-antecedencia').value = configSalao.sistema.diasAntecedencia;
        document.getElementById('notificacao-email').checked = configSalao.sistema.notificacaoEmail;
        document.getElementById('notificacao-whatsapp').checked = configSalao.sistema.notificacaoWhatsApp;
    }
}

/**
 * Configura os formulários para salvar as configurações
 */
function configurarFormularios() {
    // Formulário de contato
    const contatoForm = document.getElementById('contato-form');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Atualizar configurações de contato
            configSalao.nome = document.getElementById('nome-salao').value;
            configSalao.telefone = document.getElementById('telefone-salao').value;
            configSalao.email = document.getElementById('email-salao').value;
            configSalao.endereco = document.getElementById('endereco-salao').value;

            // Salvar configurações
            salvarConfiguracoes();
            alert('Informações de contato atualizadas com sucesso!');
        });

        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone-salao');
        if (telefoneInput) {
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
        }
    }

    // Formulário de horários
    const horariosForm = document.getElementById('horarios-form');
    if (horariosForm) {
        // Configurar checkboxes de dias fechados
        const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
        diasSemana.forEach(dia => {
            const checkbox = document.getElementById(`${dia}-fechado`);
            if (checkbox) {
                checkbox.addEventListener('change', function () {
                    const abertura = document.getElementById(`${dia}-abertura`);
                    const fechamento = document.getElementById(`${dia}-fechamento`);

                    if (this.checked) {
                        abertura.disabled = true;
                        fechamento.disabled = true;
                    } else {
                        abertura.disabled = false;
                        fechamento.disabled = false;
                    }
                });
            }
        });

        horariosForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Atualizar configurações de horários
            diasSemana.forEach(dia => {
                configSalao.horarios[dia] = {
                    abertura: document.getElementById(`${dia}-abertura`).value,
                    fechamento: document.getElementById(`${dia}-fechamento`).value,
                    fechado: document.getElementById(`${dia}-fechado`).checked
                };
            });

            // Salvar configurações
            salvarConfiguracoes();
            alert('Horários de funcionamento atualizados com sucesso!');
        });
    }

    // Formulário de sistema
    const sistemaForm = document.getElementById('sistema-form');
    if (sistemaForm) {
        sistemaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Atualizar configurações do sistema
            configSalao.sistema.intervaloAgendamento = document.getElementById('intervalo-agendamento').value;
            configSalao.sistema.diasAntecedencia = document.getElementById('dias-antecedencia').value;
            configSalao.sistema.notificacaoEmail = document.getElementById('notificacao-email').checked;
            configSalao.sistema.notificacaoWhatsApp = document.getElementById('notificacao-whatsapp').checked;

            // Salvar configurações
            salvarConfiguracoes();
            alert('Configurações do sistema atualizadas com sucesso!');
        });
    }
}

/**
 * Salva as configurações no localStorage
 */
function salvarConfiguracoes() {
    // Remover as credenciais antes de salvar (por segurança)
    const configParaSalvar = { ...configSalao };
    delete configParaSalvar.credenciais;

    localStorage.setItem('configSalao', JSON.stringify(configParaSalvar));
    console.log('Configurações salvas:', configParaSalvar);
}

/**
 * Configura o botão de logout
 */
function configurarLogout() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('login-area').style.display = 'block';
        });
    }
}

/**
 * Exporta as configurações do salão para uso em outros arquivos
 */
function obterConfiguracoesSalao() {
    // Verificar se há configurações salvas no localStorage
    const configSalva = localStorage.getItem('configSalao');
    if (configSalva) {
        // Mesclar as configurações salvas com as padrões
        const configCarregada = JSON.parse(configSalva);
        return { ...configSalao, ...configCarregada };
    }

    return configSalao;
}

// Exportar a função para uso global
window.obterConfiguracoesSalao = obterConfiguracoesSalao;