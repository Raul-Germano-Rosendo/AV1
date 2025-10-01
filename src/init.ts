import { Funcionario } from './Funcionario';
import { NivelPermissao } from './enums';

// Criar um administrador inicial
const admin = new Funcionario(1, 'Admin', '123456789', 'Endereço Admin', 'admin', 'admin', NivelPermissao.ADMINISTRADOR);
admin.salvar();

console.log('Administrador inicial criado: usuário: admin, senha: admin');
