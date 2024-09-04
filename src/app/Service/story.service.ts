import { Injectable } from '@angular/core';
import { story , chapter , part } from '../Interface/istory';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  baseUrl : string = "https://localhost:7009/api/";
  constructor(private http:HttpClient) { }

  AddUpdateStory(_story : story , url : string){
    return this.http.post(this.baseUrl + url ,_story).pipe(
      map((response:any)=>response)
    );
  }

  GetStoryDetails(url : string){
    return this.http.get(this.baseUrl + url);
  }

  GetStoryTypes(url : string){
    return this.http.get<any[]>(this.baseUrl + url);
  }

  GetStoryList(url : string){
    return this.http.get<any[]>(this.baseUrl + url);
  }
}
