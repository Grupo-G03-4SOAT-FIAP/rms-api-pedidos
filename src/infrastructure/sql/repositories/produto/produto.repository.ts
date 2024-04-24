import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { Repository } from 'typeorm';
import { ProdutoModel } from '../../models/produto.model';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  readonly relations: string[] = ['categoria'];
  constructor(
    private readonly sqlDTOFactory: SQLDTOFactory,
    @InjectRepository(ProdutoModel)
    private readonly produtoRepository: Repository<ProdutoModel>,
  ) {}

  async buscarProdutoPorId(produtoId: string): Promise<ProdutoEntity | null> {
    const produtoModel = await this.produtoRepository.findOne({
      where: { id: produtoId },
      relations: this.relations,
    });
    if (produtoModel) {
      return this.sqlDTOFactory.criarProdutoDTO(produtoModel);
    }
    return null;
  }

  async buscarProdutoPorNome(
    nomeProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoModel = await this.produtoRepository.findOne({
      where: { nome: nomeProduto },
      relations: this.relations,
    });
    if (produtoModel) {
      return this.sqlDTOFactory.criarProdutoDTO(produtoModel);
    }
    return null;
  }

  async listarProdutos(): Promise<ProdutoEntity[] | []> {
    const listaProdutoModel = await this.produtoRepository.find({
      relations: this.relations,
    });
    const produtoEntityList = listaProdutoModel.map((produto: ProdutoModel) => {
      return this.sqlDTOFactory.criarProdutoDTO(produto);
    });

    return produtoEntityList;
  }

  async listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoEntity[] | []> {
    const listaProdutoModel = await this.produtoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: this.relations,
    });
    const produtoEntityList = listaProdutoModel.map((produto: ProdutoModel) => {
      return this.sqlDTOFactory.criarProdutoDTO(produto);
    });

    return produtoEntityList;
  }
}
