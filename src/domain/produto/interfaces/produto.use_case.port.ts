import { ProdutoDTO } from 'src/presentation/rest/v1/presenters/produto/produto.dto';

export interface IProdutoUseCase {
  listarProdutos(): Promise<ProdutoDTO[] | []>;
  listarProdutosPorCategoria(idCategoria: string): Promise<ProdutoDTO[] | []>;
  buscarProduto(idProduto: string): Promise<ProdutoDTO>;
}

export const IProdutoUseCase = Symbol('IProdutoUseCase');
