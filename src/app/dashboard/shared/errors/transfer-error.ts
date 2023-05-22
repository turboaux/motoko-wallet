export type TransferErrorName =
    | 'TRANSFER_ERROR'
    | 'AMOUNT_MUST_BE_GREATER_THAN_ZERO'
    | 'FORBIDDEN_ACCOUNT'
    | 'NOT_ENOUGH_TOKENS'
    | 'NON_EXISTENT_TARGET_ACCOUNT';

export class TransferError extends Error {

    public override name: TransferErrorName;
    public override message: string;

    constructor({name, message}: {name: TransferErrorName; message: string;}) { 
        super();
        
        this.name = name;
        this.message = message;
    }
}