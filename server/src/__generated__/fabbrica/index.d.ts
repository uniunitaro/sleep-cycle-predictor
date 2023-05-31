import type { User } from "@prisma/client";
import type { Sleep } from "@prisma/client";
import type { SegmentedSleep } from "@prisma/client";
import type { Config } from "@prisma/client";
import type { PredictionSrcDuration } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions = {
    readonly seq: number;
};
type UserconfigFactory = {
    _factoryFor: "Config";
    build: () => PromiseLike<Prisma.ConfigCreateNestedOneWithoutUserInput["create"]>;
};
type UserFactoryDefineInput = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    email?: string | null;
    nickname?: string;
    sleeps?: Prisma.SleepCreateNestedManyWithoutUserInput;
    config?: UserconfigFactory | Prisma.ConfigCreateNestedOneWithoutUserInput;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
};
export interface UserFactoryInterface {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}
export declare function defineUserFactory(options?: UserFactoryDefineOptions): UserFactoryInterface;
type SleepuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutSleepsInput["create"]>;
};
type SleepFactoryDefineInput = {
    createdAt?: Date;
    updatedAt?: Date;
    start?: Date;
    end?: Date;
    user: SleepuserFactory | Prisma.UserCreateNestedOneWithoutSleepsInput;
    segmentedSleeps?: Prisma.SegmentedSleepCreateNestedManyWithoutSleepInput;
};
type SleepFactoryDefineOptions = {
    defaultData: Resolver<SleepFactoryDefineInput, BuildDataOptions>;
};
export interface SleepFactoryInterface {
    readonly _factoryFor: "Sleep";
    build(inputData?: Partial<Prisma.SleepCreateInput>): PromiseLike<Prisma.SleepCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.SleepCreateInput>): PromiseLike<Prisma.SleepCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.SleepCreateInput>[]): PromiseLike<Prisma.SleepCreateInput[]>;
    pickForConnect(inputData: Sleep): Pick<Sleep, "id">;
    create(inputData?: Partial<Prisma.SleepCreateInput>): PromiseLike<Sleep>;
    createList(inputData: number | readonly Partial<Prisma.SleepCreateInput>[]): PromiseLike<Sleep[]>;
    createForConnect(inputData?: Partial<Prisma.SleepCreateInput>): PromiseLike<Pick<Sleep, "id">>;
}
export declare function defineSleepFactory(options: SleepFactoryDefineOptions): SleepFactoryInterface;
type SegmentedSleepsleepFactory = {
    _factoryFor: "Sleep";
    build: () => PromiseLike<Prisma.SleepCreateNestedOneWithoutSegmentedSleepsInput["create"]>;
};
type SegmentedSleepFactoryDefineInput = {
    createdAt?: Date;
    updatedAt?: Date;
    start?: Date;
    end?: Date;
    sleep: SegmentedSleepsleepFactory | Prisma.SleepCreateNestedOneWithoutSegmentedSleepsInput;
};
type SegmentedSleepFactoryDefineOptions = {
    defaultData: Resolver<SegmentedSleepFactoryDefineInput, BuildDataOptions>;
};
export interface SegmentedSleepFactoryInterface {
    readonly _factoryFor: "SegmentedSleep";
    build(inputData?: Partial<Prisma.SegmentedSleepCreateInput>): PromiseLike<Prisma.SegmentedSleepCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.SegmentedSleepCreateInput>): PromiseLike<Prisma.SegmentedSleepCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.SegmentedSleepCreateInput>[]): PromiseLike<Prisma.SegmentedSleepCreateInput[]>;
    pickForConnect(inputData: SegmentedSleep): Pick<SegmentedSleep, "id">;
    create(inputData?: Partial<Prisma.SegmentedSleepCreateInput>): PromiseLike<SegmentedSleep>;
    createList(inputData: number | readonly Partial<Prisma.SegmentedSleepCreateInput>[]): PromiseLike<SegmentedSleep[]>;
    createForConnect(inputData?: Partial<Prisma.SegmentedSleepCreateInput>): PromiseLike<Pick<SegmentedSleep, "id">>;
}
export declare function defineSegmentedSleepFactory(options: SegmentedSleepFactoryDefineOptions): SegmentedSleepFactoryInterface;
type ConfiguserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutConfigInput["create"]>;
};
type ConfigFactoryDefineInput = {
    createdAt?: Date;
    updatedAt?: Date;
    predictionSrcDuration?: PredictionSrcDuration;
    user: ConfiguserFactory | Prisma.UserCreateNestedOneWithoutConfigInput;
};
type ConfigFactoryDefineOptions = {
    defaultData: Resolver<ConfigFactoryDefineInput, BuildDataOptions>;
};
export interface ConfigFactoryInterface {
    readonly _factoryFor: "Config";
    build(inputData?: Partial<Prisma.ConfigCreateInput>): PromiseLike<Prisma.ConfigCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ConfigCreateInput>): PromiseLike<Prisma.ConfigCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ConfigCreateInput>[]): PromiseLike<Prisma.ConfigCreateInput[]>;
    pickForConnect(inputData: Config): Pick<Config, "id">;
    create(inputData?: Partial<Prisma.ConfigCreateInput>): PromiseLike<Config>;
    createList(inputData: number | readonly Partial<Prisma.ConfigCreateInput>[]): PromiseLike<Config[]>;
    createForConnect(inputData?: Partial<Prisma.ConfigCreateInput>): PromiseLike<Pick<Config, "id">>;
}
export declare function defineConfigFactory(options: ConfigFactoryDefineOptions): ConfigFactoryInterface;
