import { CanActivate, ExecutionContext } from '@nestjs/common';
declare const DiscordAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class DiscordAuthGuard extends DiscordAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<any>;
}
export declare class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
