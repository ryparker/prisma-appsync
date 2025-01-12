---
sidebarDepth: 2
---

# Client Types

The Prisma-AppSync Client Types reference:

## Constructor

### Options

```typescript
export type Options = {
    connectionUrl: string
    debug?: boolean
    sanitize?: boolean
    defaultPagination?: number | false
}
```

## Hooks

### BeforeResolveProps

```typescript
export type BeforeResolveProps = {
    args: RequestProps
    authIdentity: AuthIdentityProps
    fields: string[]
    operation: Operation
    requestSetPaths: any
    subject: string
}
```

### AfterResolveProps

```typescript
export type AfterResolveProps = {
    args: RequestProps
    authIdentity: AuthIdentityProps
    fields: string[]
    operation: Operation
    requestSetPaths: any
    subject: string
    result: any
}
```

### RequestProps

```typescript
export type RequestProps = {
    data?: any
    select?: any
    include?: any
    where?: any
    orderBy?: any
    skip?: number
    take?: number
    skipDuplicates?: boolean
    [key:string]: any
}
```

## Custom resolvers

### CustomResolverProps

```typescript
export type CustomResolverProps = {
    args?: RequestProps
    authIdentity?: AuthIdentityProps
}
```

## Access-control

### AuthRule

```typescript
export type AuthRule = {
    action: AuthAction|AuthAction[]
    subject: string|string[]
    fields?: string[]
    condition?: any|any[]
    reason?:string
}
```

### AuthActions

```typescript
export const AuthActions = {
    all: 'all', // alias to: everything
    manage: 'manage', // alias to: everything
    access: 'access', // alias to: get + list
    modify: 'modify', // alias to: upsert + update + delete
    custom: 'custom',
    get: 'get',
    list: 'list',
    create: 'create',
    upsert: 'upsert',
    update: 'update',
    delete: 'delete',
    createMany: 'createMany',
    updateMany: 'updateMany',
    deleteMany: 'deleteMany',
    count: 'count',
} as const
```

### AuthAction

```typescript
export type AuthAction = typeof AuthActions[keyof typeof AuthActions]
```

## Authorization

### AuthIdentityProps

```typescript
export type AuthIdentityProps = {
    authorization: AuthType
    [key:string]: any
}
```

### AuthType

```typescript
export type AuthType = typeof AuthModes[keyof typeof AuthModes]
```

### AuthModes

```typescript
export const AuthModes = {
    API_KEY: 'API_KEY',
    AWS_IAM: 'AWS_IAM',
    AMAZON_COGNITO_USER_POOLS: 'AMAZON_COGNITO_USER_POOLS'
} as const
```
