export interface Transaction {
    originOwner: string;
    destinationOwner: string;
    transferredAmount: number;
    transactionDate: Date;
};