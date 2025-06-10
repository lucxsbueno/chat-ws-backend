import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ChannelsModule } from "./channels/channels.module";
import { MessagesModule } from "./messages/messages.module";
import { ChatsModule } from "./chats/chats.module";
import { ConnectionsModule } from "./connections/connections.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ChannelsModule,
    MessagesModule,
    ChatsModule,
    ConnectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
