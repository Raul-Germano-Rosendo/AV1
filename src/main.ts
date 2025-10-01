import * as readline from 'readline';
import { Aeronave } from './Aeronave';
import { Peca } from './Peca';
import { Etapa } from './Etapa';
import { Funcionario } from './Funcionario';
import { Teste } from './Teste';
import { Relatorio } from './Relatorio';
import { TipoAeronave, TipoPeca, StatusPeca, StatusEtapa, NivelPermissao, TipoTeste, ResultadoTeste } from './enums';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentUser: Funcionario | null = null;

function question(prompt: string): Promise<string> {
    return new Promise(resolve => rl.question(prompt, resolve));
}

async function login(): Promise<boolean> {
    const usuario = await question('Usuário: ');
    const senha = await question('Senha: ');
    const funcionarios = Funcionario.carregarTodos();
    for (const func of funcionarios) {
        if (func.autenticar(usuario, senha)) {
            currentUser = func;
            console.log(`Bem-vindo, ${func.nome}!`);
            return true;
        }
    }
    console.log('Credenciais inválidas.');
    return false;
}

async function menuPrincipal() {
    while (true) {
        console.log('\nMenu Principal:');
        console.log('1. Gerenciar Aeronaves');
        console.log('2. Gerenciar Peças');
        console.log('3. Gerenciar Etapas');
        console.log('4. Gerenciar Funcionários');
        console.log('5. Gerenciar Testes');
        console.log('6. Gerar Relatório');
        console.log('7. Sair');
        const opcao = await question('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await menuAeronaves();
                break;
            case '2':
                await menuPecas();
                break;
            case '3':
                await menuEtapas();
                break;
            case '4':
                if (currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
                    await menuFuncionarios();
                } else {
                    console.log('Acesso negado.');
                }
                break;
            case '5':
                await menuTestes();
                break;
            case '6':
                await menuRelatorio();
                break;
            case '7':
                rl.close();
                return;
            default:
                console.log('Opção inválida.');
        }
    }
}

async function menuAeronaves() {
    console.log('\nGerenciar Aeronaves:');
    console.log('1. Cadastrar Aeronave');
    console.log('2. Listar Aeronaves');
    console.log('3. Exibir Detalhes');
    const opcao = await question('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            const codigo = await question('Código: ');
            const modelo = await question('Modelo: ');
            const tipo = await question('Tipo (COMERCIAL/MILITAR): ') as TipoAeronave;
            const capacidade = parseInt(await question('Capacidade: '));
            const alcance = parseInt(await question('Alcance: '));
            const aeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
            aeronave.salvar();
            console.log('Aeronave cadastrada.');
            break;
        case '2':
            const aeronaves = Aeronave.carregarTodas();
            aeronaves.forEach(a => console.log(`${a.codigo}: ${a.modelo}`));
            break;
        case '3':
            const cod = await question('Código da aeronave: ');
            const a = Aeronave.carregar(cod);
            if (a) {
                console.log(a.exibirDetalhes());
            } else {
                console.log('Aeronave não encontrada.');
            }
            break;
    }
}

async function menuPecas() {
    console.log('\nGerenciar Peças:');
    console.log('1. Cadastrar Peça');
    console.log('2. Listar Peças');
    console.log('3. Atualizar Status');
    const opcao = await question('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            const nome = await question('Nome: ');
            const tipoPeca = await question('Tipo (NACIONAL/IMPORTADA): ') as TipoPeca;
            const fornecedor = await question('Fornecedor: ');
            const peca = new Peca(nome, tipoPeca, fornecedor, StatusPeca.EM_PRODUCAO);
            peca.salvar();
            console.log('Peça cadastrada.');
            break;
        case '2':
            const pecas = Peca.carregarTodas();
            pecas.forEach(p => console.log(`${p.nome}: ${p.status}`));
            break;
        case '3':
            const nomeP = await question('Nome da peça: ');
            const status = await question('Novo status (EM_PRODUCAO/EM_TRANSPORTE/PRONTA): ') as StatusPeca;
            const p = Peca.carregar(nomeP);
            if (p) {
                p.atualizarStatus(status);
                console.log('Status atualizado.');
            } else {
                console.log('Peça não encontrada.');
            }
            break;
    }
}

async function menuEtapas() {
    console.log('\nGerenciar Etapas:');
    console.log('1. Cadastrar Etapa');
    console.log('2. Listar Etapas');
    console.log('3. Iniciar Etapa');
    console.log('4. Finalizar Etapa');
    console.log('5. Associar Funcionário');
    const opcao = await question('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            const nomeE = await question('Nome: ');
            const prazoStr = await question('Prazo (YYYY-MM-DD): ');
            const prazo = new Date(prazoStr);
            const etapa = new Etapa(nomeE, prazo, StatusEtapa.PENDENTE);
            etapa.salvar();
            console.log('Etapa cadastrada.');
            break;
        case '2':
            const etapas = Etapa.carregarTodas();
            etapas.forEach(e => console.log(`${e.nome}: ${e.status}`));
            break;
        case '3':
            const nomeI = await question('Nome da etapa: ');
            const eI = Etapa.carregar(nomeI);
            if (eI) {
                eI.iniciar();
                console.log('Etapa iniciada.');
            } else {
                console.log('Etapa não encontrada.');
            }
            break;
        case '4':
            const nomeF = await question('Nome da etapa: ');
            const eF = Etapa.carregar(nomeF);
            if (eF) {
                eF.finalizar();
                console.log('Etapa finalizada.');
            } else {
                console.log('Etapa não encontrada.');
            }
            break;
        case '5':
            const nomeA = await question('Nome da etapa: ');
            const idFunc = parseInt(await question('ID do funcionário: '));
            const func = Funcionario.carregar(idFunc);
            const eA = Etapa.carregar(nomeA);
            if (func && eA) {
                eA.associarFuncionario(func);
                console.log('Funcionário associado.');
            } else {
                console.log('Etapa ou funcionário não encontrado.');
            }
            break;
    }
}

async function menuFuncionarios() {
    console.log('\nGerenciar Funcionários:');
    console.log('1. Cadastrar Funcionário');
    console.log('2. Listar Funcionários');
    const opcao = await question('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            const id = parseInt(await question('ID: '));
            const nomeF = await question('Nome: ');
            const telefone = await question('Telefone: ');
            const endereco = await question('Endereço: ');
            const usuario = await question('Usuário: ');
            const senha = await question('Senha: ');
            const nivel = await question('Nível (ADMINISTRADOR/ENGENHEIRO/OPERADOR): ') as NivelPermissao;
            const func = new Funcionario(id, nomeF, telefone, endereco, usuario, senha, nivel);
            func.salvar();
            console.log('Funcionário cadastrado.');
            break;
        case '2':
            const funcs = Funcionario.carregarTodos();
            funcs.forEach(f => console.log(`${f.id}: ${f.nome} - ${f.nivelPermissao}`));
            break;
    }
}

async function menuTestes() {
    console.log('\nGerenciar Testes:');
    console.log('1. Registrar Teste');
    console.log('2. Listar Testes');
    const opcao = await question('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            const tipoT = await question('Tipo (ELETRICO/HIDRAULICO/AERODINAMICO): ') as TipoTeste;
            const resultado = await question('Resultado (APROVADO/REPROVADO): ') as ResultadoTeste;
            const teste = new Teste(tipoT, resultado);
            teste.salvar();
            console.log('Teste registrado.');
            break;
        case '2':
            const testes = Teste.carregarTodos();
            testes.forEach(t => console.log(`${t.tipo}: ${t.resultado}`));
            break;
    }
}

async function menuRelatorio() {
    const codigo = await question('Código da aeronave: ');
    const cliente = await question('Cliente: ');
    const dataStr = await question('Data de entrega (YYYY-MM-DD): ');
    const dataEntrega = new Date(dataStr);
    const aeronave = Aeronave.carregar(codigo);
    if (aeronave) {
        const relatorio = new Relatorio(aeronave, cliente, dataEntrega);
        relatorio.salvarRelatorio();
        console.log('Relatório gerado e salvo.');
    } else {
        console.log('Aeronave não encontrada.');
    }
}

async function main() {
    console.log('Sistema de Produção de Aeronaves');
    while (!currentUser) {
        if (!(await login())) {
            console.log('Tentativa de login falhou.');
        }
    }
    await menuPrincipal();
}

main().catch(console.error);
