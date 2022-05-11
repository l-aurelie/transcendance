import { UserDetails } from "src/auth/utils/types";
import { User } from "src/typeorm";
export interface AuthenticationProvider {
    validateUser(details: UserDetails): any;
    createUser(details: UserDetails): any;
    findUser(discordId: string): Promise<User> | undefined;
}
