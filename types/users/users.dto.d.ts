export declare class CreateUserRequest {
    nickname: string;
}
declare const UpdateUserRequest_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserRequest>>;
export declare class UpdateUserRequest extends UpdateUserRequest_base {
}
export {};
