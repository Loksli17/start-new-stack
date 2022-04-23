import { Module }         from "@nestjs/common";
import ChatController     from "src/controllers/chat.controller";
import { MessageService } from "src/services/chat/message.servise";
import { RoomService }    from "src/services/chat/room.service";
import { UserService }    from "src/services/user.service";



@Module({

    providers: [
        UserService,
        RoomService,
        MessageService
    ],
    
    controllers: [
        ChatController,
    ],
})
export class ChatModule {}