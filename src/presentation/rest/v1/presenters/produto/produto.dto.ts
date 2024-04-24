import { ApiProperty } from '@nestjs/swagger';
import { CategoriaDTO } from '../categoria/categoria.dto';

export class ProdutoDTO {
  @ApiProperty({ description: 'ID do produto' })
  id: string;

  @ApiProperty({ description: 'Nome do produto' })
  nome: string;

  @ApiProperty({ description: 'Descrição do produto' })
  descricao: string;

  @ApiProperty({ description: 'Valor unitário do produto' })
  valorUnitario: number;

  @ApiProperty({ description: 'URL da imagem do produto' })
  imagemUrl: string;

  @ApiProperty({ description: 'Categoria do produto', type: CategoriaDTO })
  categoria: CategoriaDTO;
}
