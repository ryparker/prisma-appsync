export declare const PrismaExclWords: string[];
export declare const AuthModes: {
    readonly API_KEY: "API_KEY";
    readonly AWS_IAM: "AWS_IAM";
    readonly AMAZON_COGNITO_USER_POOLS: "AMAZON_COGNITO_USER_POOLS";
};
export declare const CrudOperations: {
    readonly get: "get";
    readonly list: "list";
    readonly createMany: "createMany";
    readonly create: "create";
    readonly upsert: "upsert";
    readonly updateMany: "updateMany";
    readonly update: "update";
    readonly deleteMany: "deleteMany";
    readonly delete: "delete";
    readonly count: "count";
};
export declare const Operations: {
    readonly get: "get";
    readonly list: "list";
    readonly createMany: "createMany";
    readonly create: "create";
    readonly upsert: "upsert";
    readonly updateMany: "updateMany";
    readonly update: "update";
    readonly deleteMany: "deleteMany";
    readonly delete: "delete";
    readonly count: "count";
} & {
    readonly custom: "custom";
};
export declare const AuthActions: {
    readonly get: "get";
    readonly list: "list";
    readonly createMany: "createMany";
    readonly create: "create";
    readonly upsert: "upsert";
    readonly updateMany: "updateMany";
    readonly update: "update";
    readonly deleteMany: "deleteMany";
    readonly delete: "delete";
    readonly count: "count";
} & {
    readonly custom: "custom";
} & {
    readonly all: "all";
    readonly manage: "manage";
    readonly access: "access";
    readonly modify: "modify";
};
export declare const PrismaAppSyncOperations: any[];
