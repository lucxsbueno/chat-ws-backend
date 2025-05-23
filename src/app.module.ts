import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ChannelsModule } from "./channels/channels.module";

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, ChannelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
