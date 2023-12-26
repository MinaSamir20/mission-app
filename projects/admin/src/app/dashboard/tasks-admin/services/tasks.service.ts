import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';
import { Mession } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getAllTasks(/*filter:any*/): Observable<Mession[]> {
    // let params = new HttpParams()
    // Object.entries(filter).forEach(([key, value] : any) =>{
    //   if (value) {
    //     params = params.append(key, value)
    //   }
    // })
    // if (filter.keyword) {
    //   params = params.append('keyword', filter.keyword)
    // }
    return this.http.get<Mession[]>(environment.baseApi + 'Missions/GetAllMissions');
  }

  createDetails(model: any) {
    return this.http.post(environment.baseApi + 'ContentDetails/CreateContent', model);
  }
  createTask(model: any) {
    return this.http.post(environment.baseApi + 'Missions/CreateMission', model);
  }

  updateTask(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Missions/UpdateMission' + id, model);
  }

  deleteTask(id: any) {
    return this.http.delete(environment.baseApi + 'Missions/RemoveMission', id);
  }
}
