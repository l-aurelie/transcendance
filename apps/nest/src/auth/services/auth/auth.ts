import { UserDetails } from "src/auth/utils/types";
import { User } from "src/typeorm";

export interface AuthenticationProvider {
    validateUser(details: UserDetails);
    createUser(details: UserDetails);
    findUser(intraId: string) : Promise<User> | undefined;
}