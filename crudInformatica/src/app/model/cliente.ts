export interface Cliente {
  id: string;
  cpf: string;
  nome: string;
  sobrenome: string;
  dtNascimento: string;
  email: string;
  senha?: string;
}