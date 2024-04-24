import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    private readonly sqlDTOFactory: SQLDTOFactory,
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async buscarCategoriaPorId(
    categoriaId: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaModel = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
    if (categoriaModel) {
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModel);
    }
    return null;
  }

  async buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaModel = await this.categoriaRepository.findOne({
      where: { nome: nomeCategoria },
    });
    if (categoriaModel) {
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModel);
    }
    return null;
  }

  async listarCategorias(): Promise<CategoriaEntity[] | []> {
    const listaCategoriaModel = await this.categoriaRepository.find({});
    const categoriaEntityList = listaCategoriaModel.map(
      (categoria: CategoriaModel) => {
        return this.sqlDTOFactory.criarCategoriaDTO(categoria);
      },
    );

    return categoriaEntityList;
  }
}
