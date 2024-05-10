import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import { PedidoNaoLocalizadoErro } from 'src/domain/pedido/exceptions/pedido.exception';
import { IPagamentoService } from 'src/domain/pedido/interfaces/pagamento.service.port';
import { IPedidoDTOFactory } from 'src/domain/pedido/interfaces/pedido.dto.factory.port';
import { IPedidoFactory } from 'src/domain/pedido/interfaces/pedido.factory.port';
import { IPedidoRepository } from 'src/domain/pedido/interfaces/pedido.repository.port';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { CriaClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
    @Inject(IPagamentoService)
    private readonly pagamentoService: IPagamentoService,
    @Inject(IPedidoDTOFactory)
    private readonly pedidoDTOFactory: IPedidoDTOFactory,
  ) {}

  private async validarPedidoPorId(
    idPedido: string,
  ): Promise<PedidoEntity | null> {
    const pedidoEncontrado = await this.pedidoRepository.buscarPedido(idPedido);
    if (!pedidoEncontrado) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }
    return pedidoEncontrado;
  }

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const listaPedidos = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO =
      this.pedidoDTOFactory.criarListaPedidoDTO(listaPedidos);
    return listaPedidosDTO;
  }
  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const listaPedidosRecebidos =
      await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO = this.pedidoDTOFactory.criarListaPedidoDTO(
      listaPedidosRecebidos,
    );
    return listaPedidosDTO;
  }

  async buscarPedido(idPedido: string): Promise<PedidoDTO> {
    const pedidoEncontrado = await this.validarPedidoPorId(idPedido);
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedidoEncontrado);
    return pedidoDTO;
  }

  async criarPedido(
    criaClienteDTO: CriaClienteDTO,
    criaPedidoDTO: CriaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>> {
    const pedido = await this.pedidoFactory.criarEntidadePedido(criaPedidoDTO);
    const cliente =
      await this.pedidoFactory.criarEntidadeCliente(criaClienteDTO);
    const clienteCriadoOuAtualizado =
      await this.criarOuAtualizarCliente(cliente);
    pedido.cliente = clienteCriadoOuAtualizado;
    pedido.clientePedido = this.copiarDadosCliente(clienteCriadoOuAtualizado);

    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedido);
    const pagamentoQRCode =
      await this.pagamentoService.gerarPagamento(pedidoDTO);
    pedidoDTO.qrCode = pagamentoQRCode.qrCode;
    await this.pedidoRepository.criarPedido(pedido);

    return {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTO,
    };
  }

  private copiarDadosCliente(
    clienteOrigem: ClienteEntity,
  ): ClienteEntity | null {
    const clienteCopia = new ClienteEntity(
      clienteOrigem.nome,
      clienteOrigem.email,
      clienteOrigem.cpf,
    );
    return clienteCopia;
  }

  private async criarOuAtualizarCliente(
    cliente: ClienteEntity,
  ): Promise<ClienteEntity | null> {
    const clienteAntigoEncontrado =
      await this.clienteRepository.buscarClientePorCPF(cliente.cpf);
    let clientePedido: ClienteEntity | null;
    if (clienteAntigoEncontrado) {
      if (
        cliente.cpf !== clienteAntigoEncontrado.cpf ||
        cliente.email !== clienteAntigoEncontrado.email ||
        cliente.nome !== clienteAntigoEncontrado.nome
      ) {
        clientePedido = await this.clienteRepository.editarCliente(
          clienteAntigoEncontrado.id,
          cliente,
        );
      } else {
        clientePedido = clienteAntigoEncontrado;
      }
    } else {
      clientePedido = await this.clienteRepository.criarCliente(cliente);
    }
    return clientePedido;
  }

  async editarPedido(
    idPedido: string,
    atualizaPedidoDTO: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>> {
    await this.validarPedidoPorId(idPedido);

    if (atualizaPedidoDTO.statusPagamento !== undefined) {
      await this.pedidoRepository.editarStatusPagamento(
        idPedido,
        atualizaPedidoDTO.statusPagamento,
      );
    }

    const pedidoEditado = await this.pedidoRepository.editarStatusPedido(
      idPedido,
      atualizaPedidoDTO.statusPedido,
    );

    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedidoEditado);
    return {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTO,
    };
  }
}
