import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import {
  categoriaDTOMock,
  categoriaUseCaseMock,
} from 'src/mocks/categoria.mock';

describe('Categoria', () => {
  let categoriaController: CategoriaController;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: ICategoriaUseCase,
          useValue: categoriaUseCaseMock,
        },
      ],
    }).compile();

    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar uma categoria', async () => {
    categoriaUseCaseMock.buscarCategoria.mockReturnValue(categoriaDTOMock);

    const result = await categoriaController.buscar(categoriaId);

    expect(categoriaUseCaseMock.buscarCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(categoriaDTOMock);
  });

  it('deve buscar uma categoria e retornar NotFoundError', async () => {
    categoriaUseCaseMock.buscarCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(categoriaController.buscar(categoriaId)).rejects.toThrow(
      new NotFoundException('Categoria informada não existe'),
    );
    expect(categoriaUseCaseMock.buscarCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve listar as categorias', async () => {
    categoriaUseCaseMock.listarCategorias.mockReturnValue([categoriaDTOMock]);

    const result = await categoriaController.listar();

    expect(categoriaUseCaseMock.listarCategorias).toHaveBeenCalledWith();
    expect(result).toStrictEqual([categoriaDTOMock]);
  });
});
