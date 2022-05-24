/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

@Module({
    imports: [],
    exports: [],
    controllers: [UsersController],
    providers: [],
})
export class UsersModule{

}