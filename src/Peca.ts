import { TipoPeca, StatusPeca } from './enums';
import * as fs from 'fs';
import * as path from 'path';

export class Peca {
    constructor(
        public nome: string,
        public tipo: TipoPeca,
        public fornecedor: string,
        public status: StatusPeca
    ) {}

    atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus;
        this.salvar();
    }

    salvar(): void {
        const data = {
            nome: this.nome,
            tipo: this.tipo,
            fornecedor: this.fornecedor,
            status: this.status
        };
        const filePath = path.join(__dirname, '..', 'data', 'pecas.json');
        let pecas: any[] = [];
        if (fs.existsSync(filePath)) {
            pecas = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        const index = pecas.findIndex(p => p.nome === this.nome);
        if (index >= 0) {
            pecas[index] = data;
        } else {
            pecas.push(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(pecas, null, 2));
    }

    static carregar(nome: string): Peca | null {
        const filePath = path.join(__dirname, '..', 'data', 'pecas.json');
        if (!fs.existsSync(filePath)) return null;
        const pecas: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const data = pecas.find(p => p.nome === nome);
        if (!data) return null;
        return new Peca(
            data.nome,
            data.tipo,
            data.fornecedor,
            data.status
        );
    }

    static carregarTodas(): Peca[] {
        const filePath = path.join(__dirname, '..', 'data', 'pecas.json');
        if (!fs.existsSync(filePath)) return [];
        const pecas: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return pecas.map(data => new Peca(
            data.nome,
            data.tipo,
            data.fornecedor,
            data.status
        ));
    }
}
