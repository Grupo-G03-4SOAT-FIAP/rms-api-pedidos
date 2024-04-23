import { Repository } from 'typeorm';
import {
  categoriaDTOMock,
  categoriaEntityMock,
  categoriaModelMock,
} from './categoria.mock';
import { ProdutoModel } from 'src/infrastructure/sql/models/produto.model';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { ProdutoDTO } from 'src/presentation/rest/v1/presenters/produto/produto.dto';

// Mock para simular dados da tabela produto no banco de dados
export const produtoModelMock = new ProdutoModel();
produtoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModelMock.nome = 'Produto X';
produtoModelMock.descricao = 'Teste Produto X';
produtoModelMock.valorUnitario = 5.0;
produtoModelMock.imagemUrl = 'http://';
produtoModelMock.categoria = categoriaModelMock;
produtoModelMock.criadoEm = new Date().toISOString();
produtoModelMock.atualizadoEm = new Date().toISOString();
produtoModelMock.excluidoEm = new Date().toISOString();

// Mock para simular dados da entidade produto com todos os itens
export const produtoEntityMock = new ProdutoEntity(
  'Produto X',
  categoriaEntityMock,
  5.0,
  'http://',
  'Teste Produto X',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

// Mock para simular dados da entidade produto sem id
export const produtoEntityNotIdMock = new ProdutoEntity(
  'Produto X',
  categoriaEntityMock,
  5.0,
  'http://',
  'Teste Produto X',
);

// Mock para simular dados da entidade produto sem descricao
export const produtoEntityNotDescricaoMock = new ProdutoEntity(
  'Produto X',
  categoriaEntityMock,
  5.0,
  'http://',
);

// Mock para simular o DTO com dados de produto enviados para o usuario ao responder uma requisição
export const produtoDTOMock = new ProdutoDTO();
produtoDTOMock.id = produtoModelMock.id;
produtoDTOMock.nome = produtoModelMock.nome;
produtoDTOMock.descricao = produtoModelMock.descricao;
produtoDTOMock.valorUnitario = produtoModelMock.valorUnitario;
produtoDTOMock.imagemUrl = produtoModelMock.imagemUrl;
produtoDTOMock.categoria = categoriaDTOMock;

// Mock jest das funções do typeORM interagindo com a tabela produto
export const produtoTypeORMMock: jest.Mocked<Repository<ProdutoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  restore: jest.fn(),
} as Partial<jest.Mocked<Repository<ProdutoModel>>> as jest.Mocked<
  Repository<ProdutoModel>
>;

// Mock jest das funções do repository produto
export const produtoRepositoryMock = {
  criarProduto: jest.fn(),
  editarProduto: jest.fn(),
  excluirProduto: jest.fn(),
  buscarProdutoPorId: jest.fn(),
  buscarProdutoPorNome: jest.fn(),
  listarProdutos: jest.fn(),
  listarProdutosPorCategoria: jest.fn(),
};

// Mock jest da função do factory sql dto de produto
export const produtoSQLDTOFactoryMock = {
  criarProdutoDTO: jest.fn(),
};

// Mock jest das funções da factory que cria entidade produto
export const produtoFactoryMock = {
  criarEntidadeCategoria: jest.fn(),
  criarEntidadeProduto: jest.fn(),
};

// Mock jest das funções da factory que cria DTO produto
export const produtoDTOFactoryMock = {
  criarProdutoDTO: jest.fn(),
  criarListaProdutoDTO: jest.fn(),
};

// Mock jest das funções do use case produto
export const produtoUseCaseMock = {
  criarProduto: jest.fn(),
  editarProduto: jest.fn(),
  excluirProduto: jest.fn(),
  buscarProduto: jest.fn(),
  listarProdutos: jest.fn(),
  listarProdutosPorCategoria: jest.fn(),
};
