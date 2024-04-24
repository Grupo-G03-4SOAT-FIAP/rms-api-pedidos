import { ApiProperty } from '@nestjs/swagger';

export class CategoriaDTO {
  @ApiProperty({ description: 'ID da categoria' })
  id: string;

  @ApiProperty({ description: 'Nome da categoria' })
  nome: string;

  @ApiProperty({ description: 'Descrição da categoria' })
  descricao: string;
}
