import { NivelPermissao } from './enums';
import * as fs from 'fs';
import * as path from 'path';

export class Funcionario {
    constructor(
        public id: number,
        public nome: string,
        public telefone: string,
        public endereco: string,
        public usuario: string,
        public senha: string,
        public nivelPermissao: NivelPermissao
    ) {}

    autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha;
    }

    salvar(): void {
        const data = {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco,
            usuario: this.usuario,
            senha: this.senha,
            nivelPermissao: this.nivelPermissao
        };
        const filePath = path.join(__dirname, '..', 'data', 'funcionarios.json');
        let funcionarios: any[] = [];
        if (fs.existsSync(filePath)) {
            funcionarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        const index = funcionarios.findIndex(f => f.id === this.id);
        if (index >= 0) {
            funcionarios[index] = data;
        } else {
            funcionarios.push(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(funcionarios, null, 2));
    }

    static carregar(id: number): Funcionario | null {
        const filePath = path.join(__dirname, '..', 'data', 'funcionarios.json');
        if (!fs.existsSync(filePath)) return null;
        const funcionarios: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const data = funcionarios.find(f => f.id === id);
        if (!data) return null;
        return new Funcionario(
            data.id,
            data.nome,
            data.telefone,
            data.endereco,
            data.usuario,
            data.senha,
            data.nivelPermissao
        );
    }

    static carregarTodos(): Funcionario[] {
        const filePath = path.join(__dirname, '..', 'data', 'funcionarios.json');
        if (!fs.existsSync(filePath)) return [];
        const funcionarios: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return funcionarios.map(data => new Funcionario(
            data.id,
            data.nome,
            data.telefone,
            data.endereco,
            data.usuario,
            data.senha,
            data.nivelPermissao
        ));
    }
}
