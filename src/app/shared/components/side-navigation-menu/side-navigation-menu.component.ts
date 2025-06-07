import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  DxTreeViewModule,
  DxTreeViewComponent,
  DxTreeViewTypes
} from 'devextreme-angular/ui/tree-view';
import { navigation } from '../../../app-navigation';
import * as events from 'devextreme/events';
import { AuthService } from '../../../services/auth.service'; // ✅ adapte le chemin si nécessaire

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss']
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  private _selectedItem!: String;
  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(value);
  }

  private _items: Record<string, unknown>[] = [];
  get items() {
    return this._items;
  }

  private _compactMode = false;
  @Input()
  get compactMode() {
    return this._compactMode;
  }
  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService // ✅ injection correcte
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('token')
      ? JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).role
      : '';

    this._items = navigation.filter(item => {
      if (role === 'CLIENT') {
        return item.path.startsWith('client/');
      } else if (role === 'TECH') {
        return item.path.startsWith('tech/');
      }
      return false;
    });
  }


  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}

@NgModule({
  imports: [DxTreeViewModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent]
})
export class SideNavigationMenuModule {}
