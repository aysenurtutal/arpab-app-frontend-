import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {environment} from "../../../environments/environment";


export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // // Fake
  // const username = localStorage.getItem('username');
  // const password = localStorage.getItem('password');
  if (!token) {
    location.href = environment.domain;
    return false;
  }
  return true

  // if (!username && !password) {
  //   window.open('http://localhost:4200/notFound');
  //   return false;
  // }
  // return true
};
