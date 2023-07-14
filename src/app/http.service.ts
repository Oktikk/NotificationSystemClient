import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private url = 'https://localhost:7029/api/Connect';

    constructor(private http: HttpClient) {}

    connect(token: string) {
        const data = { FCMToken: token };

        return this.http.post(this.url, data);
    }
}
