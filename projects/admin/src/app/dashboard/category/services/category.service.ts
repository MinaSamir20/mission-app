import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.baseApi + 'Categories/GetAllCategories/');
  }

  createCategory(model: any) {
    return this.http.post(environment.baseApi + 'Categories/CreateCategory/', model);
  }

  updateCategory(model: any, id: any) {
    return this.http.put(environment.baseApi + 'Categories/UpdateCategory/' + id, model);
  }

  deleteCategory(id: any) {
    return this.http.delete(environment.baseApi + 'Categories/RemoveCategory/' + id);
  }
}
