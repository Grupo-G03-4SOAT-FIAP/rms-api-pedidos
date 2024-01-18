import { Inject, Injectable } from '@nestjs/common';
import {
  CriaClienteDTO,
  ClienteDTO,
  AtualizaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente/cliente.entity';
import {
  ClienteNaoLocalizadoErro,
  ClienteDuplicadoErro,
  CPFInvalidoErro,
} from 'src/domain/exceptions/cliente.exception';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { IClienteUseCase } from 'src/domain/ports/cliente/cliente.use_case.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';

import {validate as uuidValidate} from 'uuid'

@Injectable()
export class ClienteUseCase implements IClienteUseCase {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async criarCliente(
    cliente: CriaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email, cpf } = cliente;

    if (email) {
      const buscaCliente =
        await this.clienteRepository.buscarClientePorEmail(email);
      if (buscaCliente) {
        throw new ClienteDuplicadoErro('Existe um cliente com esse email');
      }
    }

    if (cpf) {
      const buscaCliente =
        await this.clienteRepository.buscarClientePorCPF(cpf);
      if (buscaCliente) {
        throw new ClienteDuplicadoErro('Existe um cliente com esse cpf');
      }
    }

    const clienteEntity = new ClienteEntity(nome, email, cpf);
    const result = await this.clienteRepository.criarCliente(clienteEntity);

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.cpf = result.cpf;

    return {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTO,
    };
  }

  async editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    if(!uuidValidate(clienteId)) {
      throw new CPFInvalidoErro("ID inválido")
    }
    
    const { nome, email } = cliente;  

    if(nome == undefined) {
      throw new CPFInvalidoErro("Imformações não preenchidas")
    }

    const buscarClientePorId =
      await this.clienteRepository.buscarClientePorId(clienteId);
    if (!buscarClientePorId) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    const buscarClientePorEmail = 
      await this.clienteRepository.buscarClientePorEmail(email)
    if(buscarClientePorEmail) {
      throw new ClienteDuplicadoErro("Email informado já está em uso")
    }

    const clienteEntity = new ClienteEntity(nome, email);
    const result = await this.clienteRepository.editarCliente(
      clienteId,
      clienteEntity,
    );

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.email = result.email;
    clienteDTO.cpf = result.cpf;

    return {
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTO,
    };
  }

  async excluirCliente(
    clienteId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    if(!uuidValidate(clienteId)) {
      throw new CPFInvalidoErro("ID inválido")
    }

    const buscaCliente =
      await this.clienteRepository.buscarClientePorId(clienteId);
    if (!buscaCliente) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    await this.clienteRepository.excluirCliente(clienteId);
    return {
      mensagem: 'Cliente excluído com sucesso',
    };
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteDTO> {
    if(!uuidValidate(clienteId)) {
      throw new CPFInvalidoErro("ID inválido")
    }

    const result = await this.clienteRepository.buscarClientePorId(clienteId);
    if (!result) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.email = result.email;
    clienteDTO.cpf = result.cpf;

    return clienteDTO;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO> {
    const result = await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (!result) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.email = result.email;
    clienteDTO.cpf = result.cpf;

    return clienteDTO;
  }

  async listarClientes(): Promise<ClienteDTO[] | []> {
    const result = await this.clienteRepository.listarClientes();
    const listaClienteDTO = result.map((cliente: ClienteModel) => {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = cliente.id;
      clienteDTO.nome = cliente.nome;
      clienteDTO.email = cliente.email;
      clienteDTO.cpf = cliente.cpf;
      return clienteDTO;
    });
    return listaClienteDTO;
  }
}
