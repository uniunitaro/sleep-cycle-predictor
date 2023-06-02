export declare class GetSleepsRequest {
    start: Date;
    end: Date;
}
export declare class CreateSleepRequest {
    sleeps: Sleep[];
}
declare class Sleep {
    start: Date;
    end: Date;
}
export declare class UpdateSleepRequest extends CreateSleepRequest {
}
export {};
