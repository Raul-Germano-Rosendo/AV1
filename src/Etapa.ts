import { StatusEtapa } from './enums';
import { Funcionario } from './Funcionario';
import * as fs from 'fs';
import * as path from 'path';

export class Etapa {
    public funcionarios: Funcionario[] = [];

    constructor(
        public nome: string,
        public prazo: Date,
        public status: StatusEtapa
    ) {}

    iniciar(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            this.salvar();
        }
    }

    finalizar(): void {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            this.salvar();
        }
    }

    associarFuncionario(funcionario: Funcionario): void {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
            this.salvar();
        }
    }

    listarFuncionarios(): Funcionario[] {
        return this.funcionarios;
    }

    salvar(): void {
        const data = {
            nome: this.nome,
            prazo: this.prazo.toISOString(),
            status: this.status,
            funcionarios: this.funcionarios.map(f => f.id)
        };
        const filePath = path.join(__dirname, '..', 'data', 'etapas.json');
        let etapas: any[] = [];
        if (fs.existsSync(filePath)) {
            etapas = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        const index = etapas.findIndex(e => e.nome === this.nome);
        if (index >= 0) {
            etapas[index] = data;
        } else {
            etapas.push(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(etapas, null, 2));
    }

    static carregar(nome: string): Etapa | null {
        const filePath = path.join(__dirname, '..', 'data', 'etapas.json');
        if (!fs.existsSync(filePath)) return null;
        const etapas: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const data = etapas.find(e => e.nome === nome);
        if (!data) return null;
        const etapa = new Etapa(
            data.nome,
            new Date(data.prazo),
            data.status
        );
        etapa.funcionarios = data.funcionarios.map((id: number) => Funcionario.carregar(id)).filter((f: Funcionario | null): f is Funcionario => f !== null);
        return etapa;
    }

    static carregarTodas(): Etapa[] {
        const filePath = path.join(__dirname, '..', 'data', 'etapas.json');
        if (!fs.existsSync(filePath)) return [];
        const etapas: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return etapas.map((data: any) => {
            const etapa = new Etapa(
                data.nome,
                new Date(data.prazo),
                data.status
            );
            etapa.funcionarios = data.funcionarios.map((id: number) => Funcionario.carregar(id)).filter((f: Funcionario | null): f is Funcionario => f !== null);
            return etapa;
        });
    }
}
