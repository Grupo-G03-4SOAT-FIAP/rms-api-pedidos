import { pedidoDTOMock } from './pedido.mock';

// Mock para simular mensagem de nova-cobranca
export const messageMock = {
  Body: JSON.stringify(pedidoDTOMock),
};
