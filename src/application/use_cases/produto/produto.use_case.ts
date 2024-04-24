import { Inject, Injectable } from '@nestjs/common';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { IProdutoDTOFactory } from 'src/domain/produto/interfaces/produto.dto.factory.port';
import { IProdutoFactory } from 'src/domain/produto/interfaces/produto.factory.port';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { IProdutoUseCase } from 'src/domain/produto/interfaces/produto.use_case.port';
import { ProdutoDTO } from 'src/presentation/rest/v1/presenters/produto/produto.dto';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoFactory)
    private readonly produtoFactory: IProdutoFactory,
    @Inject(IProdutoDTOFactory)
    private readonly produtoDTOFactory: IProdutoDTOFactory,
  ) {}

  async listarProdutos(): Promise<ProdutoDTO[] | []> {
    const listaProdutos = await this.produtoRepository.listarProdutos();
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(listaProdutos);

    return listaProdutosDTO;
  }

  async listarProdutosPorCategoria(
    idCategoria: string,
  ): Promise<ProdutoDTO[] | []> {
    const categoriaEncontrada =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!categoriaEncontrada) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }
    const listaProdutos =
      await this.produtoRepository.listarProdutosPorCategoria(idCategoria);
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(listaProdutos);
    return listaProdutosDTO;
  }

  async buscarProduto(idProduto: string): Promise<ProdutoDTO> {
    const produtoEncontrado = await this.validarProdutoPorId(idProduto);
    const produtoDTO =
      this.produtoDTOFactory.criarProdutoDTO(produtoEncontrado);
    return produtoDTO;
  }

  private async validarProdutoPorId(
    idProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoEncontrado =
      await this.produtoRepository.buscarProdutoPorId(idProduto);
    if (!produtoEncontrado) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }
    return produtoEncontrado;
  }
}
