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
  getAllSchools(coordinatorId:any | null): Observable<any> {
    if(coordinatorId){
      return this.http.get<any>(`${environment.baseApi}Schools/AllSchools?CoordinatorId=${coordinatorId}`);
    }
    return this.http.get<any>(`${environment.baseApi}Schools/AllSchools`);
  }

  createShool(schoolData: any, authToken: string) {
    const headers = { Authorization: `Bearer ${authToken}` };
    console.log(schoolData);
    return this.http.post(
      `${environment.baseApi}Schools/CreateSchool`,
      schoolData,
      { headers, responseType: 'text' }
    );
  }

  updateSchool(model: any, id: any) {
    return this.http.put(
      environment.baseApi + 'Schools/UpdateSchool/' + id,
      model
    );
  }

  deleteSchool(id: any) {
    return this.http.delete(environment.baseApi + 'Schools/RemoveSchool/' + id);
  }

  getAddressById(id: any) {
    return this.http.get(
      environment.baseApi + 'Addresses/AddressById?' + id
    );
  }
}
