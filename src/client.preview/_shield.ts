import { Authorization, Shield } from './defs'
import micromatch from 'micromatch'
import merge from 'lodash/merge'


export function sanitize() {

}

export function getAuthorization(
    { shield, paths }: { shield: Shield, paths: string[] }
):Authorization {
    const authorization:Authorization = {
        canAccess: true,
        reason: null,
        prismaFilter: null,
        matcher: null
    }

    for (let i = paths.length - 1; i >= 0; i--) {
        const path:string = paths[i]
        
        for (const globPattern in shield) {
            if (micromatch.isMatch(path, globPattern)) {
                const shieldRule = shield[globPattern]

                if (typeof shieldRule === 'boolean') {
                    authorization.canAccess = shield[globPattern] as boolean
                } else {
                    if (typeof shieldRule.rule === 'undefined') {
                        // Badly formed shield rule
                    }

                    if (typeof shieldRule.rule === 'boolean') {
                        authorization.canAccess = shieldRule.rule
                    } else {
                        authorization.canAccess = true
                        if (!authorization.prismaFilter) {
                            authorization.prismaFilter = {}
                        }
                        authorization.prismaFilter = merge(
                            {}, authorization.prismaFilter, shieldRule.rule
                        )
                    }
                }

                authorization.matcher = globPattern
                authorization.reason = typeof shieldRule !== 'boolean' 
                    && typeof shieldRule.reason !== 'undefined'
                        ? shieldRule.reason
                        : `Matcher: ${authorization.matcher}`
            }
        }
    }

    return authorization
}