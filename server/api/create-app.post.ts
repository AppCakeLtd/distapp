import { count, eq } from 'drizzle-orm'
import { generateId } from '../utils/utils'

export default defineEventHandler(async (event) => {
    const { name, orgId, osType } = await readValidatedBody(event, z.object({
        name: z.string().min(1).max(128).trim(),
        orgId: z.string().min(1).trim(),
        osType: z.enum(['ios', 'android', 'embedded']),
    }).parse)
    const db = event.context.drizzle
    const org = await getUserOrg(event, '', orgId)
    if (await roleEditNotAllowed(event, org.org!.name)) {
        throw createError({
            message: 'Unauthorized',
            statusCode: 401,
        })
    }

    if (process.env.IS_RUNNING_TEST !== '1') {
        const allOrgApps = await db.select({
            count: count(),
        }).from(tables.apps)
            .where(and(
                eq(tables.apps.organizationsId, orgId),
            )).then(takeUniqueOrThrow)
        const { APP_LIMIT_BETA_APPS } = useRuntimeConfig(event)
        if (allOrgApps.count >= APP_LIMIT_BETA_APPS) {
            throw createError({
                message: `Currently we limited creating ${APP_LIMIT_BETA_APPS} apps as we are in beta testing`,
            })
        }
    }

    const now = new Date()
    await db.insert(tables.apps).values({
        id: generateId(),
        displayName: name,
        name: normalizeName(name),
        osType: osType,
        organizationsId: orgId,
        createdAt: now,
        updatedAt: now,
    })
    return {}
})
