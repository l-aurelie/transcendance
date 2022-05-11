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
exports.IntraStrategy = void 0;
const passport_oauth2_1 = require("passport-oauth2");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
let IntraStrategy = class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'intra-oauth') {
    constructor(authService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.INTRA_CALLBACK_URL + '/api/v1/auth/login/intra',
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { username, discriminator, id: discordId, avatar } = profile;
        console.log(username, discriminator, discordId, avatar);
        const details = { username, discriminator, discordId, avatar };
        return this.authService.validateUser(details);
    }
};
IntraStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [Object])
], IntraStrategy);
exports.IntraStrategy = IntraStrategy;
//# sourceMappingURL=index.js.map