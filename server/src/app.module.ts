import { Module }         from '@nestjs/common';
import { AppController }  from './app.controller';
import { AppService }     from './app.service';
import { TaskController } from './controllers/task.controller';
import database           from './config/database';

@Module({
  imports: [database],
  controllers: [AppController, TaskController],
  providers: [AppService],
})
export class AppModule {}
