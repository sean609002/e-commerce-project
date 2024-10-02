import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../../common/data-send-to-backend/order-item';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderDetailsService } from '../../services/member-services/order-details.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit{
  orderItemList: OrderItem[] = [];
  id: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private orderDetailsService: OrderDetailsService){}
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        this.id = Number(params.get('id'));
        if(this.id) {
          this.handleOrderDetails(this.id);
        }
      }
    );
  }
  handleOrderDetails(id: number) {
    this.orderDetailsService.getOrderItemsPaginate(this.pageNumber - 1, this.pageSize, id).subscribe(
      data => {
        this.orderItemList = data._embedded.orderItems;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    );
  }

  updatePageSize(size: string) {
    this.pageSize = +size;
    this.pageNumber = 1;
    this.handleOrderDetails(this.id);
  }

}
