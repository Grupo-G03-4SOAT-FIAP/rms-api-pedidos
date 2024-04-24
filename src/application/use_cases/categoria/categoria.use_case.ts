import { Inject, Injectable } from '@nestjs/common';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(ICategoriaDTOFactory)
    private readonly categoriaDTOFactory: ICategoriaDTOFactory,
  ) {}

  async listarCategorias(): Promise<CategoriaDTO[] | []> {
    const categorias = await this.categoriaRepository.listarCategorias();
    const listaCategoriasDTO =
      this.categoriaDTOFactory.criarListaCategoriaDTO(categorias);
    return listaCategoriasDTO;
  }

  async buscarCategoria(idCategoria: string): Promise<CategoriaDTO> {
    const categoriaEncontrada = await this.validarCategoriaPorId(idCategoria);
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaEncontrada);
    return categoriaDTO;
  }

  private async validarCategoriaPorId(
    idCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaEncontrada =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!categoriaEncontrada) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }
    return categoriaEncontrada;
  }
}
