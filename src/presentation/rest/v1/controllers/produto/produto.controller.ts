import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IProdutoUseCase } from 'src/domain/produto/interfaces/produto.use_case.port';
import { ProdutoDTO } from '../../presenters/produto/produto.dto';
import { NotFoundError } from '../../helpers/swagger/status-codes/not_found.swagger';

@Controller('produto')
@ApiTags('Produto')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar um produto pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundError,
  })
  async buscar(@Param('id') id: string) {
    try {
      return await this.produtoUseCase.buscarProduto(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: ProdutoDTO,
    isArray: true,
  })
  async listar() {
    return await this.produtoUseCase.listarProdutos();
  }

  @Get('/categoria/:id')
  @ApiOperation({ summary: 'Listar produtos de uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Produtos retornados com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundError,
  })
  async listarPorCategoria(@Param('id') id: string) {
    try {
      return await this.produtoUseCase.listarProdutosPorCategoria(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
