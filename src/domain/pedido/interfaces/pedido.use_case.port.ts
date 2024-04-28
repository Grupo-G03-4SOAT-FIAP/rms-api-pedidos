import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { CriaClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

export interface IPedidoUseCase {
  listarPedidos(): Promise<PedidoDTO[] | []>;
  listarPedidosRecebido(): Promise<PedidoDTO[] | []>;
  buscarPedido(idPedido: string): Promise<PedidoDTO>;
  criarPedido(
    criaClienteDTO: CriaClienteDTO,
    criaPedidoDTO: CriaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  editarPedido(
    idPedido: string,
    atualizaPedidoDTO: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
}

export const IPedidoUseCase = Symbol('IPedidoUseCase');
