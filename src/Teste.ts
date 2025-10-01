import { TipoTeste, ResultadoTeste } from './enums';
import * as fs from 'fs';
import * as path from 'path';

export class Teste {
    constructor(
        public tipo: TipoTeste,
        public resultado: ResultadoTeste
    ) {}

    salvar(): void {
        const data = {
            tipo: this.tipo,
            resultado: this.resultado
        };
        const filePath = path.join(__dirname, '..', 'data', 'testes.json');
        let testes: any[] = [];
        if (fs.existsSync(filePath)) {
            testes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        testes.push(data);
        fs.writeFileSync(filePath, JSON.stringify(testes, null, 2));
    }

    static carregarTodos(): Teste[] {
        const filePath = path.join(__dirname, '..', 'data', 'testes.json');
        if (!fs.existsSync(filePath)) return [];
        const testes: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return testes.map(data => new Teste(
            data.tipo,
            data.resultado
        ));
    }
}
