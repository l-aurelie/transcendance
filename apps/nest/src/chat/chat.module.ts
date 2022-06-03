import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
    // before the gateway will start we need to add oit to the providers here
    providers: [ChatGateway]
})
export class ChatModule {}
