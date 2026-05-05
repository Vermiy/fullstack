import { defineConfig } from 'prisma/config';
import { existsSync, readFileSync } from 'node:fs';

function getDatabaseUrl(): string {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    if (!existsSync('.env')) {
        return '';
    }

    const envContent = readFileSync('.env', 'utf8');
    const line = envContent
        .split(/\r?\n/)
        .find((entry) => entry.trim().startsWith('DATABASE_URL='));

    if (!line) {
        return '';
    }

    const value = line.slice(line.indexOf('=') + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }

    return value;
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: getDatabaseUrl(),
    },
});
