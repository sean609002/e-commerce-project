import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OauthRedirectComponent } from './components/oauth-redirect/oauth-redirect.component';

const routes: Routes = [
  {path: 'oauth-redirect', component: OauthRedirectComponent},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'profile', component: ProfileComponent },
  {path: 'order-details/:id', component: OrderDetailsComponent },
  {path: 'order-history', component: OrderHistoryComponent },
  {path : 'checkout', component : CheckoutComponent},
  {path : 'cart-details', component : CartDetailsComponent},
  {path : 'product/:id', component : ProductDetailsComponent},
  {path : 'search/:keyword',component : ProductListComponent},
  {path : 'category/:id',component : ProductListComponent},
  {path : 'category', component : ProductListComponent},
  {path : 'products', component : ProductListComponent},
  {path : '', redirectTo : '/products', pathMatch : 'full'},
  {path : '**', redirectTo : '/products', pathMatch : 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
