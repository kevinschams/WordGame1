import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    // Declare components that belong exclusively to the AuthModule
    /**
     * The declarations array in an Angular module is specifically
     * for components, directives, and pipes that are part of the module.
     * These are the types of classes that Angular needs to know about
     * for template compilation and rendering. Only these types of
     * classes should be included in the declarations array, and each
     * class can be declared in exactly one module.
     */
    LoginComponent,
    RegisterComponent,
  ],  
  imports: [
    /**
     * The imports array is used to include other modules that the 
     * components, directives, and pipes in the current module 
     * depend on. Essentially, it tells Angular about the other sets 
     * of functionalities your module needs to operate correctly.
     */
    CommonModule,
    ReactiveFormsModule,
    FormsModule,     
    HttpClientModule,
    RouterModule,
    AuthRoutingModule
  ],
  exports: [
    // Export any components that might be used or referenced outside of the AuthModule
    /**
     * The exports array in an NgModule is used to make components, directives, 
     * and pipes available to other Angular modules. When you export a 
     * component, directive, or pipe from an Angular module, it means 
     * that these can be used in the templates of components declared 
     * in other Angular modules that import this module.
     */
  ],
  // Do not provide services that are marked as providedIn: 'root' or guards/interceptors here if aiming for loose coupling
  /**
   * For services using providedIn: 'root' or another module, the service 
   * is available application-wide or module-scoped respectively due to 
   * Angular's dependency injection system. This is independent of the 
   * TypeScript export/import system, although you still use TypeScript 
   * import statements to access these services in your components and 
   * other services.
   */
})
export class AuthModule { }
// export { RouterModule, CommonModule, NgFor };

