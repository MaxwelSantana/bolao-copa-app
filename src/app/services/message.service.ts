
import { Injectable, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class MessageService {

    constructor(private toastr: ToastrService){}

    success(message: string, title?: string) {
        this.toastr.success(message, title ? title : 'Sucesso');
    }
}