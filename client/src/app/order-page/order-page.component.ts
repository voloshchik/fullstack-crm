import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  MaterialService,
  MaterialInstance,
} from '../shared/classes/material.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  modal: MaterialInstance;
  constructor(private router: Router, orderService: OrderService) {}

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy() {
    this.modal.destroy();
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }
  submit() {
    this.modal.close();
  }
}
