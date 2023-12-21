import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  getAllCoordinators(/*filter:any*/): Observable<User[]> {
    // let params = new HttpParams()
    // Object.entries(filter).forEach(([key, value] : any) =>{
    //   if (value) {
    //     params = params.append(key, value)
    //   }
    // })
    // if (filter.keyword) {
    //   params = params.append('keyword', filter.keyword)
    // }
    return this.http.get<User[]>(environment.baseApi + 'Coordinators/GetAllCoordinators/', /*{params}*/);
  }

  createCoordinator(model: any) {
    return this.http.post(environment.baseApi + 'Coordinators/CreateCoordinator/', model);
  }

  updateCoordinator(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Coordinators/UpdateCoordinator/' + id, model);
  }

  deleteCoordinator(id: any) {
    return this.http.delete(environment.baseApi + 'Coordinators/RemoveCoordinator/' + id);
  }
}
