import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaUseCase } from './categoria.use_case';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import {
  categoriaDTOFactoryMock,
  categoriaDTOMock,
  categoriaEntityMock,
  categoriaRepositoryMock,
} from 'src/mocks/categoria.mock';

describe('CategoriaUseCase', () => {
  let categoriaUseCase: CategoriaUseCase;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaUseCase,
        {
          provide: ICategoriaRepository,
          useValue: categoriaRepositoryMock,
        },
        {
          provide: ICategoriaDTOFactory,
          useValue: categoriaDTOFactoryMock,
        },
      ],
    }).compile();

    categoriaUseCase = module.get<CategoriaUseCase>(CategoriaUseCase);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar uma categoria por id com sucesso', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.buscarCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(result).toStrictEqual(categoriaDTOMock);
  });

  it('deve retornar erro ao buscar uma categoria por id que não existe', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(categoriaUseCase.buscarCategoria(categoriaId)).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve listar categorias com sucesso', async () => {
    categoriaRepositoryMock.listarCategorias.mockReturnValue([
      categoriaEntityMock,
    ]);
    categoriaDTOFactoryMock.criarListaCategoriaDTO.mockReturnValue([
      categoriaDTOMock,
    ]);

    const result = await categoriaUseCase.listarCategorias();

    expect(categoriaRepositoryMock.listarCategorias).toHaveBeenCalled();
    expect(categoriaDTOFactoryMock.criarListaCategoriaDTO).toHaveBeenCalledWith(
      [categoriaEntityMock],
    );
    expect(result).toStrictEqual([categoriaDTOMock]);
  });

  it('deve retornar lista vazia ao listar categorias', async () => {
    categoriaRepositoryMock.listarCategorias.mockReturnValue([]);
    categoriaDTOFactoryMock.criarListaCategoriaDTO.mockReturnValue([]);

    const result = await categoriaUseCase.listarCategorias();

    expect(categoriaRepositoryMock.listarCategorias).toHaveBeenCalled();
    expect(categoriaDTOFactoryMock.criarListaCategoriaDTO).toHaveBeenCalledWith(
      [],
    );
    expect(result).toStrictEqual([]);
  });
});
