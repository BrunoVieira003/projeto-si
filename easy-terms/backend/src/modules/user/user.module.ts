import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UniqueEmailValidator } from "./validation/UniqueEmail.validation";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { HistoryModule } from "../history/history.module";
import { TermEntity } from "../term/entities/term.entity";
import { UserAcceptedCustomFieldEntity } from "../acceptance/entities/user-accepted-custom-fields.entity";
import { TermCustomFieldEntity } from "../term/entities/term-custom-field.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, 
      UserTermAcceptanceEntity, 
      TermEntity, 
      TermCustomFieldEntity, 
      UserAcceptedCustomFieldEntity
    ]),
    HistoryModule,
  ],  
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator],
  exports: [UserService],
})

export class UserModule {}
