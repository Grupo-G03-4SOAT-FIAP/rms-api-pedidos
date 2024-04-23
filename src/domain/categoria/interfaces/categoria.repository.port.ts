import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaRepository {
  buscarCategoriaPorId(categoriaId: string): Promise<CategoriaEntity | null>;
  buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null>;
  listarCategorias(): Promise<CategoriaEntity[] | []>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
