import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRoles } from '@prisma/client';
import { existsSync, readFileSync } from 'node:fs';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private prismaClient: PrismaClient;
    private readonly defaultAdminName = process.env.DEFAULT_ADMIN_NAME ?? 'admin';
    private readonly defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@gmail.com';
    private readonly defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'adminadmin';

    constructor() {
        const connectionString = this.resolveConnectionString();
        const adapter = new PrismaPg({ connectionString });

        this.prismaClient = new PrismaClient({
            adapter,
        });
    }

    get user() {
        return this.prismaClient.user;
    }

    get book() {
        return this.prismaClient.book;
    }

    async onModuleInit() {
        this.logger.log(`Connecting to database "${this.getDatabaseNameFromConnectionString(this.resolveConnectionString())}"`);
        await this.prismaClient.$connect();
        await this.ensureDefaultAdminUser();
    }

    async onModuleDestroy() {
        await this.prismaClient.$disconnect();
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }

    private async ensureDefaultAdminUser() {
        try {
            const existingAdmin = await this.prismaClient.user.findUnique({
                where: { email: this.defaultAdminEmail },
            });

            if (existingAdmin) {
                return;
            }

            const hashedPassword = await bcryptjs.hash(this.defaultAdminPassword, 10);

            await this.prismaClient.user.create({
                data: {
                    name: this.defaultAdminName,
                    email: this.defaultAdminEmail,
                    password: hashedPassword,
                    role: UserRoles.ADMIN,
                },
            });
        } catch { }
    }

    private resolveConnectionString(): string {
        const envConnectionString = process.env.DATABASE_URL?.trim() ?? '';
        const dotEnvConnectionString = this.readDatabaseUrlFromDotEnv();
        const isProduction = process.env.NODE_ENV === 'production';

        if (envConnectionString && dotEnvConnectionString && envConnectionString !== dotEnvConnectionString) {
            this.logger.warn('DATABASE_URL from shell differs from .env. Using .env in non-production mode.');
        }

        if (!isProduction && dotEnvConnectionString) {
            return dotEnvConnectionString;
        }

        return envConnectionString || dotEnvConnectionString;
    }

    private readDatabaseUrlFromDotEnv(): string {
        if (!existsSync('.env')) {
            return '';
        }

        const envContent = readFileSync('.env', 'utf8');
        const databaseLine = envContent
            .split(/\r?\n/)
            .find((line) => line.trim().startsWith('DATABASE_URL='));

        if (!databaseLine) {
            return '';
        }

        const value = databaseLine.slice(databaseLine.indexOf('=') + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
            return value.slice(1, -1);
        }

        return value;
    }

    private getDatabaseNameFromConnectionString(connectionString: string): string {
        try {
            const url = new URL(connectionString);
            const path = url.pathname.replace(/^\//, '');
            return path || 'unknown';
        } catch {
            return 'unknown';
        }
    }
}
