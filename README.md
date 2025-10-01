# Sistema de Produção de Aeronaves - Aerocode

Este é um sistema CLI (Command Line Interface) desenvolvido em TypeScript para simular o processo de produção de aeronaves, inspirado na Embraer. O sistema permite gerenciar aeronaves, peças, etapas de produção, funcionários, testes e gerar relatórios finais.

## Funcionalidades

### Cadastro de Aeronaves
- Código único da aeronave
- Modelo, tipo (Comercial ou Militar), capacidade e alcance
- Exibição de detalhes completos

### Gerenciamento de Peças
- Nome, tipo (Nacional ou Importada), fornecedor
- Status: Em Produção, Em Transporte ou Pronta
- Atualização de status

### Etapas da Produção
- Nome, prazo e status (Pendente, Em Andamento, Concluída)
- Controle de ordem lógica (não pode concluir sem finalizar anterior)
- Métodos para iniciar e finalizar etapas
- Associação de funcionários responsáveis (sem duplicidade)

### Cadastro de Funcionários
- ID único, nome, telefone, endereço
- Usuário e senha para autenticação
- Nível de permissão: Administrador, Engenheiro ou Operador
- Restrições de ações por permissão

### Gerenciamento de Testes
- Tipos: Elétrico, Hidráulico, Aerodinâmico
- Resultado: Aprovado ou Reprovado

### Relatório Final da Aeronave
- Dados da aeronave, cliente e data de entrega
- Etapas realizadas, peças utilizadas e testes feitos
- Salvo em arquivo de texto

### Persistência de Dados
- Todos os dados salvos em arquivos JSON na pasta `data/`
- Arquivos separados por entidade (aeronaves.json, pecas.json, etc.)

## Estrutura do Projeto

```
AV1/
├── src/
│   ├── enums.ts          # Definições dos enums
│   ├── Aeronave.ts       # Classe Aeronave
│   ├── Peca.ts           # Classe Peca
│   ├── Etapa.ts          # Classe Etapa
│   ├── Funcionario.ts    # Classe Funcionario
│   ├── Teste.ts          # Classe Teste
│   ├── Relatorio.ts      # Classe Relatorio
│   ├── main.ts           # Ponto de entrada da aplicação CLI
│   └── init.ts           # Script para inicializar dados (admin)
├── data/                 # Pasta para arquivos de dados JSON
├── dist/                 # Arquivos compilados JavaScript
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
└── README.md             # Este arquivo
```

## Como Executar

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Instalação
1. Clone ou baixe o projeto
2. Instale as dependências:
   ```bash
   npm install
   ```

### Compilação
Compile o TypeScript para JavaScript:
```bash
npm run build
```

### Inicialização
Crie o usuário administrador inicial:
```bash
node dist/init.js
```

### Execução
Execute o sistema:
```bash
npm start
```

Ou diretamente:
```bash
node dist/main.js
```

## Uso do Sistema

### Login
- Usuário inicial: `admin`
- Senha inicial: `admin`

### Menus Principais
1. **Gerenciar Aeronaves**: Cadastrar, listar e exibir detalhes
2. **Gerenciar Peças**: Cadastrar, listar e atualizar status
3. **Gerenciar Etapas**: Cadastrar, iniciar/finalizar e associar funcionários
4. **Gerenciar Funcionários**: Cadastrar e listar (apenas administradores)
5. **Gerenciar Testes**: Registrar e listar testes
6. **Gerar Relatório**: Criar relatório final da aeronave

## Classes e Enums

### Enums
- `TipoAeronave`: COMERCIAL, MILITAR
- `TipoPeca`: NACIONAL, IMPORTADA
- `StatusPeca`: EM_PRODUCAO, EM_TRANSPORTE, PRONTA
- `StatusEtapa`: PENDENTE, ANDAMENTO, CONCLUIDA
- `NivelPermissao`: ADMINISTRADOR, ENGENHEIRO, OPERADOR
- `TipoTeste`: ELETRICO, HIDRAULICO, AERODINAMICO
- `ResultadoTeste`: APROVADO, REPROVADO

### Classes
- **Aeronave**: Gerencia dados da aeronave e associações
- **Peca**: Representa componentes da aeronave
- **Etapa**: Fases do processo de produção
- **Funcionario**: Usuários do sistema com permissões
- **Teste**: Registros de testes realizados
- **Relatorio**: Geração de relatórios finais

## Tecnologias Utilizadas
- **TypeScript**: Linguagem principal
- **Node.js**: Ambiente de execução
- **readline**: Para interface CLI
- **fs/path**: Para manipulação de arquivos

## Compatibilidade
- Windows 10+
- Linux Ubuntu 24.04.03+

## Desenvolvimento
O sistema foi desenvolvido seguindo princípios de orientação a objetos, com tipagem estática para maior segurança e manutenibilidade. A persistência é feita em arquivos JSON para simplicidade, simulando um banco de dados.

## Contribuição
Este é um projeto acadêmico para a disciplina de Programação Orientada a Objetos.
