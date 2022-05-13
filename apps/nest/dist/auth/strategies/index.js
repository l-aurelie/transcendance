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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let IntraStrategy = class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'intra-oauth') {
    constructor(httpService, authService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.INTRA_CALLBACK_URL,
        });
        this.httpService = httpService;
        this.authService = authService;
    }
    async validate(accessToken) {
        console.log(accessToken);
        const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        }));
        const details = { login: data.login, intraId: data.id, avatar: data.image_url };
        console.log(details.login, details.intraId, details.avatar);
        return this.authService.validateUser(details);
    }
};
IntraStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [axios_1.HttpService, Object])
], IntraStrategy);
exports.IntraStrategy = IntraStrategy;
//# sourceMappingURL=index.js.map