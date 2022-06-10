import { User } from "..";

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequestStatusInter {
    status ?: FriendRequestStatus;
}

export interface FriendRequest {
    id ?: number;
    sender ?: User;
    receiver ?: User;
    Status ?: FriendRequestStatus;
}