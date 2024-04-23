import { CategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

export interface ICategoriaUseCase {
  listarCategorias(): Promise<CategoriaDTO[] | []>;
  buscarCategoria(idCategoria: string): Promise<CategoriaDTO>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
