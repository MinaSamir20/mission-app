import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getAllTasks(/*filter:any,*/ coordinatorId: any | null): Observable<any> {
    // let params = new HttpParams()
    // Object.entries(filter).forEach(([key, value] : any) =>{
    //   if (value) {
    //     params = params.append(key, value)
    //   }
    // })
    // if (filter.keyword) {
    //   params = params.append('keyword', filter.keyword)
    // }
    if (coordinatorId) {
      return this.http.get<any>(
        `${environment.baseApi}Missions/AllMissions?CoordinatorId=${coordinatorId}`
      );
    }
    return this.http.get<any>(`${environment.baseApi}Missions/AllMissions`);
  }

  loadContent(id: any) {
    return this.http.get<any>(
      `${environment.baseApi}ContentDetails/AllContentById`
    );
  }

  createDetails(model: any) {
    return this.http.post(
      `${environment.baseApi}ContentDetails/CreateContent`,
      model
    );
  }
  createTask(model: any) {
    return this.http.post(
      environment.baseApi + 'Missions/CreateMission',
      model
    );
  }

  updateTask(model: any, id: any) {
    return this.http.put(
      environment.baseApi + 'Missions/UpdateMission' + id,
      model
    );
  }

  deleteTask(id: any) {
    return this.http.delete(environment.baseApi + 'Missions/RemoveMission', id);
  }
}
