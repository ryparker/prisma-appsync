import { ResolveParams, PrismaAppSyncOptions, ResolverQuery, PrismaClient, Shield, Authorization } from './defs'
import { UnauthorizedError } from './_debug'
import { parseEvent } from './_adapter'
import { getAuthorization } from './_shield'
import * as queries from './_queries'


export class PrismaAppSync {
    private options: PrismaAppSyncOptions
    private event: ResolveParams['event']
    private resolverQuery: ResolverQuery
    private resolvers: {} | null
    private shield: ResolveParams['shield'] | null
    private hooks: ResolveParams['hooks'] | null
    private isFirstResolve: boolean
    public prismaClient:PrismaClient


    /**
     * Instantiate Prisma-AppSync Client.
     * @param  {PrismaAppSyncOptions} options
     */
    constructor(options:PrismaAppSyncOptions) {
        this.isFirstResolve = true

        this.options = {
            connectionString: typeof options.connectionString !== 'undefined'
                ? options.connectionString
                : String(process.env.DATABASE_URL),
            sanitize: typeof options.sanitize !== 'undefined'
                ? options.sanitize
                : true,
            debug: typeof options.debug !== 'undefined'
                ? options.debug
                : true,
            defaultPagination: typeof options.defaultPagination !== 'undefined'
                ? options.defaultPagination
                : 50,
            maxDepth: typeof options.maxDepth !== 'undefined'
                ? options.maxDepth
                : 3,
        }

        this.prismaClient = new PrismaClient()
        
        return this
    }

    
    /**
     * Resolve the API request, based on the AppSync event received by the Direct Lambda Resolver.
     * @param  {ResolveParams} resolveParams
     * @returns Promise
     */
    public async resolve(resolveParams:ResolveParams):Promise<any> {
        // Core :: only read params other than `event` on first .resolve() call
        if (this.isFirstResolve) {
            this.shield = resolveParams.shield || null
            this.hooks = resolveParams.hooks || null
        }

        // Core :: this is not anymore the first .resolve() call
        this.isFirstResolve = false

        // Core :: parse appsync event
        this.event = resolveParams.event
        this.resolverQuery = parseEvent(this.event, this.resolvers)

        // Shield :: read shield from config
        const shield: Shield = await this.shield(this.resolverQuery)

        // Shield :: get authorization object
        const authorization: Authorization = getAuthorization({ shield, paths: this.resolverQuery.paths })

        // Shield :: if `canAccess` if equal to `false`, we reject the API call
        if (!authorization.canAccess) {
            const reason = typeof authorization.reason === 'string'
                ? authorization.reason
                : authorization.reason()
            new UnauthorizedError(reason)
            return;
        }

        // Shield :: if `prismaFilter` is set, combine with current Prisma query
        if (authorization.prismaFilter) {
            this.prismaClient.$use(async (params, next) => {
                if (typeof params.args.where !== 'undefined' && params.args.where.length > 0) {
                    params.args.where = {
                        AND: [
                            params.args.where,
                            authorization.prismaFilter
                        ]
                    }
                } else {
                    params.args.where = authorization.prismaFilter
                }
                
                return next(params)
            })
        }

        // Hooks :: execute global beforeResolve hook
        // if (this.beforeResolve) {
        //     this.prismaClient.$use(async (params, next) => {
        //         await this.beforeResolve()
        //         return next(params)
        //     })
        // }

        // Shield :: execute local beforeResolve Shield hook
        // const localBeforeResolve:ShieldDirectivePossibleTypes = this.shield
        //     ? getDirectiveParam(
        //         Shield, this.resolverQuery.subject, 'beforeResolve'
        //     ) : null
        // if (localBeforeResolve && typeof localBeforeResolve === 'function') {
        //     this.prismaClient.$use(async (params, next) => {
        //         await localBeforeResolve()
        //         return next(params)
        //     })
        // }

        // Prisma :: resolve query with Prisma Client
        const results = process.env.JEST_WORKER_ID
            ? this.resolverQuery
            : await queries[`${this.resolverQuery.action}Query`](this.prismaClient, this.resolverQuery)

        // Shield :: execute local afterResolve Shield hook

        // Shield :: filter out fields listed in directive

        // Hooks :: execute global afterResolve hook

        // Core :: return results
        return results
    }
}