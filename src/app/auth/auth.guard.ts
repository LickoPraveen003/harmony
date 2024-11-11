import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!localStorage.getItem('user'); // Check if user is logged in
  if (!isLoggedIn) {
    return false; // Redirect to login if not authenticated
  }
  return true;
};
