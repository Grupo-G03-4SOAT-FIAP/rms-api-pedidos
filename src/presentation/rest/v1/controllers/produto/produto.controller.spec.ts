import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { IProdutoUseCase } from 'src/domain/produto/interfaces/produto.use_case.port';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { produtoDTOMock, produtoUseCaseMock } from 'src/mocks/produto.mock';

describe('Produto', () => {
  let produtoController: ProdutoController;
  let produtoId: string;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoController,
        {
          provide: IProdutoUseCase,
          useValue: produtoUseCaseMock,
        },
      ],
    }).compile();

    produtoController = module.get<ProdutoController>(ProdutoController);
    produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar um produto', async () => {
    produtoUseCaseMock.buscarProduto.mockResolvedValue(produtoDTOMock);

    const result = await produtoController.buscar(produtoId);

    expect(produtoUseCaseMock.buscarProduto).toHaveBeenCalledWith(produtoId);
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve buscar um produto e retornar NotFoundError', async () => {
    produtoUseCaseMock.buscarProduto.mockRejectedValue(
      new ProdutoNaoLocalizadoErro('Produto informado não existe'),
    );

    await expect(produtoController.buscar(produtoId)).rejects.toThrow(
      new NotFoundException('Produto informado não existe'),
    );
    expect(produtoUseCaseMock.buscarProduto).toHaveBeenCalledWith(produtoId);
  });

  it('deve listar os produtos', async () => {
    produtoUseCaseMock.listarProdutos.mockResolvedValue([produtoDTOMock]);

    const result = await produtoController.listar();

    expect(produtoUseCaseMock.listarProdutos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve listar os produtos por categoria', async () => {
    produtoUseCaseMock.listarProdutosPorCategoria.mockResolvedValue([
      produtoDTOMock,
    ]);

    const result = await produtoController.listarPorCategoria(categoriaId);

    expect(produtoUseCaseMock.listarProdutosPorCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve listar os produtos por categoria e retornar NotFoundError', async () => {
    produtoUseCaseMock.listarProdutosPorCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(
      produtoController.listarPorCategoria(categoriaId),
    ).rejects.toThrow(new NotFoundException('Categoria informada não existe'));
    expect(produtoUseCaseMock.listarProdutosPorCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
  });
});
