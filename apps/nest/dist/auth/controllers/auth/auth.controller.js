"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../guards");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("../../../typeorm");
const typeorm_3 = require("@nestjs/typeorm");
const common_3 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
let AuthController = class AuthController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    login() {
        return;
    }
    redirection() { }
    status() {
        return 'HELLLOOOO';
    }
    VerifyEmail() {
    }
    async Verify(body) {
        console.log(body.code);
        try {
            const user = await this.userRepo.findOne({
                authConfirmToken: Number.parseInt(body.code)
            });
            if (!user) {
                return new common_3.HttpException('Verification code has expired or not found', common_3.HttpStatus.UNAUTHORIZED);
            }
            await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });
            return true;
        }
        catch (e) {
            return new common_3.HttpException(e, common_3.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    logout() { }
};
__decorate([
    (0, common_1.Get)('login'),
    (0, common_2.UseGuards)(guards_1.DiscordAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, common_2.UseGuards)(guards_1.DiscordAuthGuard),
    (0, common_1.Redirect)('/auth/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "redirection", null);
__decorate([
    (0, common_2.UseGuards)(guards_1.AuthenticatedGuard),
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('/verify'),
    (0, common_1.Render)('verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "VerifyEmail", null);
__decorate([
    (0, common_1.Post)('/verify'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('verify')),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Verify", null);
__decorate([
    (0, common_1.Get)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, typeorm_3.InjectRepository)(typeorm_2.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map