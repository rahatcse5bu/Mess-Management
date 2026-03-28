declare class MealEntryDto {
    memberId: string;
    mealCount: number;
    note?: string;
}
export declare class UpsertMealDayDto {
    date: string;
    elements: string[];
    entries: MealEntryDto[];
}
export {};
