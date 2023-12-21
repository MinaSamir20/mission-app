import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) {}

  getAllMissions(filter:any) {
    let params = new HttpParams()
    Object.entries(filter).forEach(([key, value] : any) =>{
      if (value) {
        params = params.append(key, value)
      }
    })
    if (filter.keyword) {
      params = params.append('keyword', filter.keyword)
    }
    return this.http.get(environment.baseApi + 'Missions/GetAllMissions/', {params});
  }

  createMission(model: any) {
    return this.http.post(environment.baseApi + 'Missions/CreateMission/', model);
  }

  updateMission(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Missions/UpdateMission/' + id, model);
  }

  deleteMission(id: any) {
    return this.http.delete(environment.baseApi + 'Missions/RemoveMission/' + id);
  }

  getAllGovernments(filter:any) {
    let params = new HttpParams()
    Object.entries(filter).forEach(([key, value] : any) =>{
      if (value) {
        params = params.append(key, value)
      }
    })
    if (filter.keyword) {
      params = params.append('keyword', filter.keyword)
    }
    return this.http.get(environment.baseApi + 'Governments/GetAllGovernments/', {params});
  }

  getAllAddresses(filter:any) {
    let params = new HttpParams()
    Object.entries(filter).forEach(([key, value] : any) =>{
      if (value) {
        params = params.append(key, value)
      }
    })
    if (filter.keyword) {
      params = params.append('keyword', filter.keyword)
    }
    return this.http.get(environment.baseApi + 'Addresses/GetAllAddress/', {params});
  }

  createAddress(model: any) {
    return this.http.post(environment.baseApi + 'Addresses/CreateAddress/', model);
  }

  updateAddress(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Addresses/UpdateAddress/' + id, model);
  }

  deleteAddress(id: any) {
    return this.http.delete(environment.baseApi + 'Addresses/RemoveAddress/' + id);
  }
}
