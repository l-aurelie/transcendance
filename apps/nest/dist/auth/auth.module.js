"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth/auth.controller");
const auth_service_1 = require("./services/auth/auth.service");
const strategies_1 = require("./strategies");
const users_module_1 = require("../users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("../typeorm");
const Serializer_1 = require("./utils/Serializer");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const path_1 = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController, auth_controller_1.HomePage],
        providers: [strategies_1.IntraStrategy,
            Serializer_1.SessionSerializer, auth_service_1.AuthService,
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService,
            },
        ],
        imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([typeorm_2.User]),
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '60s' },
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    service: "gmail",
                    secure: false,
                    auth: {
                        user: 'transcendance42@gmail.com',
                        pass: '42transcendance!',
                    },
                },
                defaults: {
                    from: '"No Reply" transcendance42@gmail.com',
                },
                template: {
                    dir: (0, path_1.join)(__dirname, "../../views/email-templates"),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            })]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map