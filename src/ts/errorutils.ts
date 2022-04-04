import { ErrorMessageMap, ErrorMessageTranslator } from './components/errormessageoverlay';
import { ErrorEvent } from 'bitmovin-player';
import { MobileV3PlayerErrorEvent, MobileV3SourceErrorEvent } from './mobilev3playerapi';

export namespace ErrorUtils {

  export const defaultErrorMessages: ErrorMessageMap = {
    1000: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1001: 'Esse é um erro temporário, por favor, faça logoff da sua conta e entre de novo. Se mesmo assim o erro continuar, acesse a nossa central de atendimento.',
    1100: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1101: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1102: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1103: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1104: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1105: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1106: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1107: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1108: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1109: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1110: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1111: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1112: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1113: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro e o nome do vídeo.',
    1200: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1201: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1202: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir de novo. Se o problema continuar, acesse a nossa central de atendimento.',
    1203: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    1204: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    1205: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    1206: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    1207: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro e o nome do vídeo.',
    1208: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1209: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1210: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1211: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1300: 'Se o problema continuar, acesse a nossa central de atendimento e fale com a gente.',
    1301: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1302: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1303: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1304: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    1400: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1401: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1402: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    1403: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    1404: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    2000: 'Esse é um erro temporário, por favor, faça logoff da sua conta e entre novamente. Se mesmo assim o erro continuar, acesse a nossa central de atendimento. ',
    2001: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    2002: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    2003: 'Esse é um erro temporário, por favor, faça logoff da sua conta e entre novamente. Se mesmo assim o erro continuar, acesse a nossa central de atendimento. ',
    2004: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro e o nome do vídeo.',
    2005: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    2006: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    2007: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro e o nome do vídeo.',
    2008: 'Navegador de internet não suportado. Se o erro continuar, acesse a nossa central de atendimento.',
    2009: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    2010: 'Você está usando um sistema operacional não suportado. Clique aqui e confira em quais sistemas você pode assistir ao vídeo. ',
    2011: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    2012: 'Reinicie a sua conexão com a internet, atualize a página e tente assistir ao vídeo novamente. Se o problema continuar, acesse a nossa central de atendimento.',
    2013: 'Dispositivo não suportado. Clique aqui e veja em quais dispositivos você pode assistir ao vídeo.',
    2014: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    2100: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    2101: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    3001: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    3002: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    3003: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    3004: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
    3100: 'Por favor, acesse a nossa central de atendimento e fale com a gente informando o erro.',
  };

  export const defaultMobileV3ErrorMessageTranslator = (error: MobileV3PlayerErrorEvent | MobileV3SourceErrorEvent) => {
    return error.message;
  };

  export const defaultWebErrorMessageTranslator: ErrorMessageTranslator = (error: ErrorEvent) => {
    const errorMessage = ErrorUtils.defaultErrorMessages[error.code];

    if (errorMessage) {
      // Use the error message text if there is one
      return `Código de Erro: 1-${error.code} \n ${errorMessage}`; // default error message style
    } else {
      // Fallback to error code/name if no message is defined
      return `${error.code} ${error.name}`;
    }
  };
}
