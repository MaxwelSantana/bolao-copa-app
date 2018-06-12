import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from "../../../services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit { 

    @Input()
    isOpen = false;
  
    constructor(private loaderService: LoaderService) {}

    ngOnInit() {
        this.loaderService.change.subscribe(isOpen => {
            this.isOpen = isOpen;
        });
    }
}
