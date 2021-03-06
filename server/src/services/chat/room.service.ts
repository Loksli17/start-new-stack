import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import Message     from "src/models/Message";
import Room        from "src/models/Room";
import RoomHasUser from "src/models/RoomHasUser";
import User        from "src/models/User";
import { FileService } from "./file.service";


@Injectable()
export class RoomService {

    constructor(
        private fileService: FileService,
    ) {}
    

    public async createRoom(roomDto: {name: string, userId: number, img?: string}): Promise<Room> {

        roomDto.img = "default.png";

        const room: Room = Room.build(roomDto);

        try {
            await room.save();
        } catch (error) {
            throw new HttpException('Error with saving room', HttpStatus.BAD_REQUEST);
        }
        
        const roomHasUser: RoomHasUser = RoomHasUser.build({
            userId: room.userId,
            roomId: room.id,
        });

        try {
            await roomHasUser.save()
        } catch (error) {
            throw new HttpException('Error with saving room', HttpStatus.BAD_REQUEST);
        }

        return room;
    }


    public async getRooms(userId: number): Promise<Array<Room>> {
        
        const rooms: Array<Room> = await Room.findAll({
            include: [
                {model: User, as: 'users', attributes: ['id', 'login']}, 
                {model: RoomHasUser, where: {userId: userId}, attributes: []},
                {model: Message, order: [['id', 'desc']], limit: 1, include: [{model: User, attributes: ['login']}]},
                {model: User, as: 'user', attributes: ['login', 'id']},
            ],
        });

        return rooms;
    }

    
    public async addUserInRoom(user: {id: number, login: string}, roomId: number): Promise<{id: number, login: string}> {

        const roomHasUser: RoomHasUser = RoomHasUser.build({
            userId: user.id,
            roomId: roomId,
        });

        try {
            await roomHasUser.save()
        } catch (error) {
            throw new HttpException('Error with saving user in room', HttpStatus.BAD_REQUEST);
        }


        return user;
    }


    public async removeUserFromRoom(user: {id: number, login: string}, roomId: number): Promise<{id: number, login: string}> {
        
        try {
            await RoomHasUser.destroy({where: {
                userId: user.id,
                roomId: roomId,
            }});
        } catch (error) {
            console.error(error);
            throw new HttpException('Error with removing user in room', HttpStatus.BAD_REQUEST);
        }
        
        return user;
    }


    public async editRoomName(name: string, id: number) {

        let room: Room;

        try {
            room = await Room.findByPk(id);
            room.set('name', name);
            await room.save();
        } catch (error) {
            console.error(error);
            throw new HttpException('Error with removing user in room', HttpStatus.BAD_REQUEST);
        }

        return room;
    }


    public async imageUpload(req, query, res): Promise<any> {

        if(!req.isMultipart()){
            new HttpException('No files', HttpStatus.BAD_REQUEST);
        }

        const filename: string = await this.fileService.saveFile(req, query.filename, query.roomId, res);

        const room: Room = await Room.findByPk(query.roomId);

        if(await this.fileService.fileExist(`/room-img/${room.get('img')}`)){
            await this.fileService.removeFile(`/room-img/${room.get('img')}`);
        }

        room.set('img', filename);

        try {
            room.save();
        } catch (error) {
            new HttpException('Error with file saving', HttpStatus.BAD_REQUEST);
        }
    }
}