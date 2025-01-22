import db from './db';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path'

var migrated = false

export const runMigration = async () => {
    const config = useRuntimeConfig()
    if (migrated) {
        return
    }
    if (config.APP_MIGRATION_ENABLE !== 'true') {
        console.log('⏩ Migration skipped')
        return
    }
    var migrationDir = config.APP_MIGRATION_DIR
    migrationDir = path.join(migrationDir ? migrationDir : process.cwd(), 'server', 'db', 'drizzle')
    console.log('🔄 Migration starting',)

    await migrate(db(process.env, true), { migrationsFolder: migrationDir });

    migrated = true
    console.log('✅ Migration success')
}
