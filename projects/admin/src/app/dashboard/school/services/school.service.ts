import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';
import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(private http: HttpClient) {}

  // let params = new HttpParams()
  // Object.entries(filter).forEach(([key, value] : any) =>{
  //   if (value) {
  //     params = params.append(key, value)
  //   }
  // })
  // if (filter.keyword) {
  //   params = params.append('keyword', filter.keyword)
  // }
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(environment.baseApi + 'Schools/GetAllSchools');
  }

  createShool(model: any, authToken: string) {
    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.post(environment.baseApi + 'Schools/CreateSchool', model, { headers });
  }

  updateSchool(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Schools/UpdateSchool/' + id, model);
  }

  deleteSchool(id: any) {
    return this.http.delete(environment.baseApi + 'Schools/RemoveSchool/' + id);
  }

  getAddressById(id:any) {
    return this.http.get(environment.baseApi + 'Addresses/GetAddressById?' + id);
  }
}
