import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog,} from '@angular/material/dialog';

export interface DialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

    constructor(private modalService: MatDialog) {
    }

    ngOnInit(): void {
        console.log("ngOnInit");
    }

    show() {
        this.modalService.open(SpinnerComponent);
    }

    hide() {
        this.modalService.closeAll();
    }
}
