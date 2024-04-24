import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoUseCase } from './produto.use_case';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { IProdutoFactory } from 'src/domain/produto/interfaces/produto.factory.port';
import { IProdutoDTOFactory } from 'src/domain/produto/interfaces/produto.dto.factory.port';
import { ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import {
  produtoDTOFactoryMock,
  produtoDTOMock,
  produtoFactoryMock,
  produtoModelMock,
  produtoRepositoryMock,
} from 'src/mocks/produto.mock';
import {
  categoriaModelMock,
  categoriaRepositoryMock,
} from 'src/mocks/categoria.mock';

describe('ProdutoUseCase', () => {
  let produtoUseCase: ProdutoUseCase;
  let produtoId: string;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoUseCase,
        {
          provide: IProdutoRepository,
          useValue: produtoRepositoryMock,
        },
        {
          provide: ICategoriaRepository,
          useValue: categoriaRepositoryMock,
        },
        {
          provide: IProdutoFactory,
          useValue: produtoFactoryMock,
        },
        {
          provide: IProdutoDTOFactory,
          useValue: produtoDTOFactoryMock,
        },
      ],
    }).compile();

    produtoUseCase = module.get<ProdutoUseCase>(ProdutoUseCase);
    produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar um produto por id', async () => {
    produtoRepositoryMock.buscarProdutoPorId.mockReturnValue(produtoModelMock);
    produtoDTOFactoryMock.criarProdutoDTO.mockReturnValue(produtoDTOMock);

    const result = await produtoUseCase.buscarProduto(produtoId);

    expect(produtoRepositoryMock.buscarProdutoPorId).toHaveBeenCalledWith(
      produtoId,
    );
    expect(produtoDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      produtoModelMock,
    );
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve retornar erro ao buscar um produto que não existe', async () => {
    produtoRepositoryMock.buscarProdutoPorId.mockReturnValue(null);

    await expect(produtoUseCase.buscarProduto(produtoId)).rejects.toThrow(
      new ProdutoNaoLocalizadoErro('Produto informado não existe'),
    );
    expect(produtoRepositoryMock.buscarProdutoPorId).toHaveBeenCalledWith(
      produtoId,
    );
  });

  it('deve listar todos os produtos', async () => {
    produtoRepositoryMock.listarProdutos.mockReturnValue([produtoModelMock]);
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([
      produtoDTOMock,
    ]);

    const result = await produtoUseCase.listarProdutos();

    expect(produtoRepositoryMock.listarProdutos).toHaveBeenCalledWith();
    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith([
      produtoModelMock,
    ]);
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve retornar uma lista vazia de produtos', async () => {
    produtoRepositoryMock.listarProdutos.mockReturnValue([]);
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([]);

    const result = await produtoUseCase.listarProdutos();

    expect(produtoRepositoryMock.listarProdutos).toHaveBeenCalledWith();
    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });

  it('deve listar todos os produtos por categoria', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    produtoRepositoryMock.listarProdutosPorCategoria.mockReturnValue([
      produtoModelMock,
    ]);
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([
      produtoDTOMock,
    ]);

    const result = await produtoUseCase.listarProdutosPorCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(
      produtoRepositoryMock.listarProdutosPorCategoria,
    ).toHaveBeenCalledWith(categoriaId);
    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith([
      produtoModelMock,
    ]);
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve retornar erro ao listar todos os produtos por categoria que não existe', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(
      produtoUseCase.listarProdutosPorCategoria(categoriaId),
    ).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve retornar uma lista vazia de produtos por categoria', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    produtoRepositoryMock.listarProdutosPorCategoria.mockReturnValue([]);
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([]);

    const result = await produtoUseCase.listarProdutosPorCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(
      produtoRepositoryMock.listarProdutosPorCategoria,
    ).toHaveBeenCalledWith(categoriaId);
    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });
});
