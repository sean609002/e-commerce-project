import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/member-services/order-history.service';
import { StorageService } from '../../services/member-services/storage.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private orderHistoryService: OrderHistoryService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = this.storageService.getUser().email;
    if(email) {
      this.orderHistoryService.getOrderHistoryPaginate(this.pageNumber - 1, this.pageSize, email).subscribe(
        data => {
          this.orderHistoryList = (data.page.totalElements !== 0) ? data._embedded.orders : [];
          this.pageNumber = data.page.number + 1;
          this.pageSize = data.page.size;
          this.totalElements = data.page.totalElements;
        }
      );
    }
  }

  updatePageSize(size: string) {
    this.pageSize = +size;
    this.pageNumber = 1;
    this.handleOrderHistory();
  }
}
