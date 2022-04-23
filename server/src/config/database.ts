import { SequelizeModule } from "@nestjs/sequelize"
import Article             from "src/models/Article";
import ArticleHasTag       from "src/models/ArticleHasTag";
import Tag                 from "src/models/Tag";
import User                from "src/models/User";
import config              from ".";
import Task                from './../models/Task';
import TaskType            from "./../models/TaskType";


export default SequelizeModule.forRoot({
    dialect : 'mysql',
    host    : config.db.host,
    port    : config.db.port,
    password: config.db.password,
    database: config.db.name,
    username: config.db.user,
    models  : [
        Task, 
        TaskType, 
        Tag, 
        Article, 
        ArticleHasTag, 
        User,
    ],
    // logging : true,
});

