import { Inject, Injectable } from '@nestjs/common';
import { IProdutoFactory } from '../interfaces/produto.factory.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import {} from 'src/presentation/rest/v1/presenters/produto/produto.dto';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criarEntidadeCategoria(categoriaId: string): Promise<CategoriaEntity> {
    const categoria =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!categoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    return new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );
  }
}
