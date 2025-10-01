import { Aeronave } from './Aeronave';
import * as fs from 'fs';
import * as path from 'path';

export class Relatorio {
    constructor(
        public aeronave: Aeronave,
        public cliente: string,
        public dataEntrega: Date
    ) {}

    gerarRelatorio(): string {
        let report = `Relatório Final da Aeronave\n`;
        report += `==========================\n\n`;
        report += `Dados da Aeronave:\n`;
        report += `Código: ${this.aeronave.codigo}\n`;
        report += `Modelo: ${this.aeronave.modelo}\n`;
        report += `Tipo: ${this.aeronave.tipo}\n`;
        report += `Capacidade: ${this.aeronave.capacidade}\n`;
        report += `Alcance: ${this.aeronave.alcance}\n\n`;

        report += `Cliente: ${this.cliente}\n`;
        report += `Data de Entrega: ${this.dataEntrega.toLocaleDateString()}\n\n`;

        report += `Etapas Realizadas:\n`;
        this.aeronave.etapas.forEach((etapa: import("./Etapa").Etapa) => {
            report += `- ${etapa.nome}: ${etapa.status} (Prazo: ${etapa.prazo.toLocaleDateString()})\n`;
            report += `  Funcionários: ${etapa.listarFuncionarios().map((f: import("./Funcionario").Funcionario) => f.nome).join(', ')}\n`;
        });
        report += `\n`;

        report += `Peças Utilizadas:\n`;
        this.aeronave.pecas.forEach((peca: import("./Peca").Peca) => {
            report += `- ${peca.nome}: ${peca.tipo} (${peca.fornecedor}) - ${peca.status}\n`;
        });
        report += `\n`;

        report += `Testes Realizados:\n`;
        this.aeronave.testes.forEach((teste: import("./Teste").Teste) => {
            report += `- ${teste.tipo}: ${teste.resultado}\n`;
        });
        report += `\n`;

        return report;
    }

    salvarRelatorio(): void {
        const report = this.gerarRelatorio();
        const filePath = path.join(__dirname, '..', 'data', `relatorio_${this.aeronave.codigo}.txt`);
        fs.writeFileSync(filePath, report, 'utf-8');
    }
}
