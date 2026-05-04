import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()

        // assume JWT decoded middleware already attached user
        return !!request.user
    }
}
