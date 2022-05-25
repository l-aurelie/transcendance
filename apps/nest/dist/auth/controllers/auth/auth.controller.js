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
exports.HomePage = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../guards");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("../../../typeorm");
const typeorm_3 = require("@nestjs/typeorm");
const common_3 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    login() {
        return;
    }
    status() {
        return 'HELLLOOOO';
    }
    VerifyEmail() {
    }
    async Verify(body, res) {
        try {
            const user = await this.userRepo.findOne({
                authConfirmToken: Number.parseInt(body.value),
            });
            if (!user) {
                return false;
            }
            await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });
            return true;
        }
        catch (e) {
            console.log('error catched...');
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
    (0, common_2.UseGuards)(guards_1.AuthenticatedGuard),
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('/verify'),
    (0, common_2.UseGuards)(guards_1.DiscordAuthGuard),
    (0, common_1.Redirect)('http://localhost:4200/Verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "VerifyEmail", null);
__decorate([
    (0, common_1.Post)('/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
let HomePage = class HomePage {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    welcome(id) {
        return (`Welcome ${id} !`);
    }
};
__decorate([
    (0, common_2.UseGuards)(guards_1.AuthenticatedGuard),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomePage.prototype, "welcome", null);
HomePage = __decorate([
    (0, common_2.UseGuards)(guards_1.AuthenticatedGuard),
    (0, common_1.Controller)('home'),
    __param(0, (0, typeorm_3.InjectRepository)(typeorm_2.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], HomePage);
exports.HomePage = HomePage;
//# sourceMappingURL=auth.controller.js.map