import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ChannelsModule } from "./channels/channels.module";
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, ChannelsModule, MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
