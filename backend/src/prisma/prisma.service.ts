import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, UserRoles } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private prismaClient: PrismaClient;
    private readonly defaultAdminName = process.env.DEFAULT_ADMIN_NAME ?? 'admin';
    private readonly defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@gmail.com';
    private readonly defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'adminadmin';

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    get user() {
        return this.prismaClient.user;
    }

    get book() {
        return this.prismaClient.book;
    }

    async onModuleInit() {
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
}
