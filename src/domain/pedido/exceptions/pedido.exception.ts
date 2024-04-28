import { HttpException, HttpStatus } from '@nestjs/common';

export class PedidoNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Not found',
      statusCode: HttpStatus.NOT_FOUND,
    };
    super(errorResponse, HttpStatus.NOT_FOUND);
  }
}

export class ProcessarPagamentoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    super(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
