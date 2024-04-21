import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: []
})
export class LoginComponent implements OnInit, OnDestroy {
    username: string = '';
    password: string = '';

    constructor() {
    }

    ngOnDestroy(): void {
        localStorage.setItem('userName', JSON.stringify(this.username));
    }

    ngOnInit(): void {
    }

    login() {

        localStorage.setItem('userName', JSON.stringify(this.username));

        if (this.username && this.password) {
            window.open('http://localhost:8089/')
        }

    }
}
