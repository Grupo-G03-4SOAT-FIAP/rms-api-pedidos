import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoriaModel } from './categoria.model';
import { ColumnNumericTransformer } from './ColumnNumericTransformer';

@Entity({ name: 'produtos' })
export class ProdutoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false, unique: true })
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  descricao: string;

  @Column({
    name: 'valor_unitario',
    nullable: false,
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  valorUnitario: number;

  @Column({ name: 'imagem_url', length: 2048, nullable: false })
  imagemUrl: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  excluidoEm: string;

  @ManyToOne(() => CategoriaModel, (categoria) => categoria.produtos, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaModel;
}
