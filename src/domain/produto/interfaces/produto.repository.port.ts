import { ProdutoEntity } from '../entities/produto.entity';

export interface IProdutoRepository {
  buscarProdutoPorId(produtoId: string): Promise<ProdutoEntity | null>;
  buscarProdutoPorNome(nomeProduto: string): Promise<ProdutoEntity | null>;
  listarProdutos(): Promise<ProdutoEntity[] | []>;
  listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoEntity[] | []>;
}

export const IProdutoRepository = Symbol('IProdutoRepository');
