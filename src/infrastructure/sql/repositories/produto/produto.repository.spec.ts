import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoRepository } from './produto.repository';
import { ProdutoModel } from '../../models/produto.model';
import {
  produtoSQLDTOFactoryMock,
  produtoEntityNotIdMock,
  produtoModelMock,
  produtoTypeORMMock,
} from 'src/mocks/produto.mock';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';
import { ILike } from 'typeorm';

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let produtoId: string;
  let categoriaId: string;
  let nomeProduto: string;
  let relations: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        {
          provide: getRepositoryToken(ProdutoModel),
          useValue: produtoTypeORMMock,
        },
        {
          provide: SQLDTOFactory,
          useValue: produtoSQLDTOFactoryMock,
        },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
    produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    nomeProduto = 'Produto X';
    relations = ['categoria'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar um produto por id', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );
    produtoSQLDTOFactoryMock.criarProdutoDTO.mockReturnValue(
      produtoEntityNotIdMock,
    );

    const result = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: relations,
    });
    expect(produtoSQLDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      produtoModelMock,
    );
    expect(result).toStrictEqual(produtoEntityNotIdMock);
  });

  it('deve buscar um produto por id e retornar nulo', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: relations,
    });
    expect(result).toBe(null);
  });

  it('deve buscar um produto por nome', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );
    produtoSQLDTOFactoryMock.criarProdutoDTO.mockReturnValue(
      produtoEntityNotIdMock,
    );

    const result = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: ILike(nomeProduto) },
      relations: relations,
    });
    expect(produtoSQLDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      produtoModelMock,
    );
    expect(result).toStrictEqual(produtoEntityNotIdMock);
  });

  it('deve buscar um produto por nome e retornar nulo', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: ILike(nomeProduto) },
      relations: relations,
    });
    expect(result).toBe(null);
  });

  it('deve listar todos produtos', async () => {
    const listaProdutoModel = [
      produtoModelMock,
      produtoModelMock,
      produtoModelMock,
    ];
    const listaProdutoEntity = [
      produtoEntityNotIdMock,
      produtoEntityNotIdMock,
      produtoEntityNotIdMock,
    ];
    produtoTypeORMMock.find.mockResolvedValue(
      Promise.resolve(listaProdutoModel),
    );
    produtoSQLDTOFactoryMock.criarProdutoDTO.mockReturnValue(
      produtoEntityNotIdMock,
    );

    const result = await produtoRepository.listarProdutos();

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      relations: relations,
    });
    expect(produtoSQLDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      produtoModelMock,
    );
    expect(result).toStrictEqual(listaProdutoEntity);
  });

  it('deve retornar uma lista vazia de produtos', async () => {
    const listaProdutos = [];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado = await produtoRepository.listarProdutos();

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      relations: relations,
    });
    expect(resultado).toStrictEqual(listaProdutos);
  });

  it('deve listar produtos por categoria', async () => {
    const listaProdutoModel = [
      produtoModelMock,
      produtoModelMock,
      produtoModelMock,
    ];
    const listaProdutoEntity = [
      produtoEntityNotIdMock,
      produtoEntityNotIdMock,
      produtoEntityNotIdMock,
    ];
    produtoTypeORMMock.find.mockResolvedValue(
      Promise.resolve(listaProdutoModel),
    );
    produtoSQLDTOFactoryMock.criarProdutoDTO.mockReturnValue(
      produtoEntityNotIdMock,
    );

    const result =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: relations,
    });
    expect(produtoSQLDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      produtoModelMock,
    );
    expect(result).toStrictEqual(listaProdutoEntity);
  });

  it('deve retornar uma lista vazia de produtos por categoria', async () => {
    const listaProdutos = [];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const result =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: relations,
    });
    expect(result).toStrictEqual(listaProdutos);
  });
});
