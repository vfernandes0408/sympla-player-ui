import { ErrorMessageMap, ErrorMessageTranslator } from './components/errormessageoverlay';
import { MobileV3PlayerErrorEvent, MobileV3SourceErrorEvent } from './mobilev3playerapi';
export declare namespace ErrorUtils {
    const defaultErrorMessages: ErrorMessageMap;
    const defaultMobileV3ErrorMessageTranslator: (error: MobileV3PlayerErrorEvent | MobileV3SourceErrorEvent) => string;
    const defaultWebErrorMessageTranslator: ErrorMessageTranslator;
}
