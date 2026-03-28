export declare class CreateAdjustmentDto {
    date: string;
    memberId: string;
    amount: number;
    type: 'payment' | 'credit' | 'debit';
    note?: string;
}
