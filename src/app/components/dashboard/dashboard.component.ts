import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MessageService]
})
export class DashboardComponent implements OnInit {

    constructor(private messageService: MessageService) {
    }

    ngOnInit() {
    }
    onUpload(event: UploadEvent) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
}
