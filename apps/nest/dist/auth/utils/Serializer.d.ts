import { PassportSerializer } from "@nestjs/passport";
import { User } from "../../typeorm";
import { Done } from "./types";
import { AuthenticationProvider } from "../services/auth/auth";
export declare class SessionSerializer extends PassportSerializer {
    private readonly authService;
    constructor(authService: AuthenticationProvider);
    serializeUser(user: User, done: Done): void;
    deserializeUser(user: User, done: Done): Promise<void>;
}
