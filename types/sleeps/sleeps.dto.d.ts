export declare class GetSleepsRequest {
    start: Date;
    end: Date;
}
export declare class CreateSleepRequest {
    start: Date;
    end: Date;
    segmentedSleeps: SegmentedSleep[];
}
declare class SegmentedSleep {
    start: Date;
    end: Date;
}
export {};
