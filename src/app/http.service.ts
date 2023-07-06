import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = 'https://localhost:7029/api/Connect';

  constructor(private http : HttpClient) { }

  getClients(){
    return this.http.get(this.url);
  }

  connect(guid : string){
    const data = { guid: guid };
    
    return this.http.post(this.url, data);
  }
}
