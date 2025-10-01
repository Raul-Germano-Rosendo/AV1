import { TipoAeronave } from './enums';
import { Peca } from './Peca';
import { Etapa } from './Etapa';
import { Teste } from './Teste';
import * as fs from 'fs';
import * as path from 'path';

export class Aeronave {
    public pecas: Peca[] = [];
    public etapas: Etapa[] = [];
    public testes: Teste[] = [];

    constructor(
        public codigo: string,
        public modelo: string,
        public tipo: TipoAeronave,
        public capacidade: number,
        public alcance: number
    ) {}

    exibirDetalhes(): string {
        let details = `Aeronave: ${this.modelo} (${this.codigo})\n`;
        details += `Tipo: ${this.tipo}\n`;
        details += `Capacidade: ${this.capacidade}\n`;
        details += `Alcance: ${this.alcance}\n`;
        details += `Peças: ${this.pecas.length}\n`;
        details += `Etapas: ${this.etapas.length}\n`;
        details += `Testes: ${this.testes.length}\n`;
        return details;
    }

    salvar(): void {
        const data = {
            codigo: this.codigo,
            modelo: this.modelo,
            tipo: this.tipo,
            capacidade: this.capacidade,
            alcance: this.alcance,
            pecas: this.pecas.map(p => p.nome),
            etapas: this.etapas.map(e => e.nome),
            testes: this.testes.map(t => ({ tipo: t.tipo, resultado: t.resultado }))
        };
        const filePath = path.join(__dirname, '..', 'data', 'aeronaves.json');
        let aeronaves: any[] = [];
        if (fs.existsSync(filePath)) {
            aeronaves = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        const index = aeronaves.findIndex(a => a.codigo === this.codigo);
        if (index >= 0) {
            aeronaves[index] = data;
        } else {
            aeronaves.push(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(aeronaves, null, 2));
    }

    static carregar(codigo: string): Aeronave | null {
        const filePath = path.join(__dirname, '..', 'data', 'aeronaves.json');
        if (!fs.existsSync(filePath)) return null;
        const aeronaves: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const data = aeronaves.find(a => a.codigo === codigo);
        if (!data) return null;
        const aeronave = new Aeronave(
            data.codigo,
            data.modelo,
            data.tipo,
            data.capacidade,
            data.alcance
        );
        aeronave.pecas = data.pecas.map((nome: string) => Peca.carregar(nome)).filter((p: Peca | null): p is Peca => p !== null);
        aeronave.etapas = data.etapas.map((nome: string) => Etapa.carregar(nome)).filter((e: Etapa | null): e is Etapa => e !== null);
        aeronave.testes = data.testes.map((t: any) => new Teste(t.tipo, t.resultado));
        return aeronave;
    }

    static carregarTodas(): Aeronave[] {
        const filePath = path.join(__dirname, '..', 'data', 'aeronaves.json');
        if (!fs.existsSync(filePath)) return [];
        const aeronaves: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return aeronaves.map((data: any) => {
            const aeronave = new Aeronave(
                data.codigo,
                data.modelo,
                data.tipo,
                data.capacidade,
                data.alcance
            );
            aeronave.pecas = data.pecas.map((nome: string) => Peca.carregar(nome)).filter((p: Peca | null): p is Peca => p !== null);
            aeronave.etapas = data.etapas.map((nome: string) => Etapa.carregar(nome)).filter((e: Etapa | null): e is Etapa => e !== null);
            aeronave.testes = data.testes.map((t: any) => new Teste(t.tipo, t.resultado));
            return aeronave;
        });
    }
}
