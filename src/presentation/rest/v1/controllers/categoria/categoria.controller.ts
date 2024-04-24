import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaDTO } from '../../presenters/categoria/categoria.dto';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { NotFoundError } from '../../helpers/swagger/status-codes/not_found.swagger';

@Controller('categoria')
@ApiTags('Categoria')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly categoriaUseCase: ICategoriaUseCase,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar uma categoria pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Categoria retornada com sucesso',
    type: CategoriaDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundError,
  })
  async buscar(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.categoriaUseCase.buscarCategoria(id);
    } catch (error) {
      if (error instanceof CategoriaNaoLocalizadaErro) {
        throw new CategoriaNaoLocalizadaErro(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: CategoriaDTO,
    isArray: true,
  })
  async listar() {
    return await this.categoriaUseCase.listarCategorias();
  }
}
