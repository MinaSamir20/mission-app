import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  createAddress(model: any, authToken: string) {
    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.post(
      environment.baseApi + 'Addresses/CreateAddress',
      model,
      { headers, responseType: 'text' }
    );
  }
  getAllGovernment(authToken: string) {
    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.get(
      environment.baseApi + 'Governments/AllGovernments',
      { headers }
    );
  }
  getAllSchools(): Observable<any> {
    return this.http.get<any>(environment.baseApi + 'Schools/AllSchools');
  }
}
