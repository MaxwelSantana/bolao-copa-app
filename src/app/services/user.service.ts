import { UserEndpointService } from "./user-endpoint.service";
import { Injectable } from "@angular/core";
import { EventsService } from "angular4-events/esm/src";

@Injectable()
export class UserService {
    private users: any[] = [];

    constructor(private userEndpointService: UserEndpointService, private events: EventsService){}

    loadUsers() {
        this.userEndpointService.getUsers().subscribe(users => {
            this.users = users;
            this.events.publish('usersLoaded', '');
        });
    }

    getUsers() {
        return this.users;
    }
}