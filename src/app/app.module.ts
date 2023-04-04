//our root app component
import {Component, NgModule, ViewChildren, ViewChild, QueryList, ViewContainerRef, Input, ComponentFactoryResolver, ComponentRef} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'my-child',
  template: `Child Component`,
  styles: [
    `:host {
      display: block;
      background-color: orange;
      color: blue;
      padding: 1rem;
    }
    `
  ]
})
export class ChildComponent {

  constructor() {}

  ngOnDestroy() {
    console.log('Boodbye from child component');
  }
}


@Component({
  selector: 'my-container',
  template: `
    <div>{{name}}</div>
    <ng-container #vc></ng-container>
  `,
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ccc;
      padding: 1rem;
      box-sizing: border-box;
      border: 2px solid white;
    }
    `
  ]
})
export class ContainerComponent {

  @Input('name') name: string = "";
  @ViewChild('vc', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  constructor() {}

  ngOnDestroy() {
    console.log('Boodbye from ' + this.name);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Moving Angular component from one parent component to another</h1>
    <p>
      This plunk demonstrates how to detach an Angular component from one parent component
      and attach it to another. With this approach, the
      <a href="https://angular.io/api/core/OnDestroy">ngOnDestroy</a> method of the
      child component is only called by Angular when the parent that the child is currently
      attached to is destroyed.
    </p>
    <div class="demo">
      <div class="col">
        <my-container name="Container 1" *ngIf="containerOneEnabled"></my-container>
      </div>
      <div class="col">
        <my-container name="Container 2" *ngIf="containerTwoEnabled"></my-container>
      </div>
    </div>
    <ol>
      <li>Open browser console to monitor log statements.</li>
      <li><button (click)="moveChild()">Move Child</button></li>
      <li>
        <button (click)="destroyContainerOne()">Destroy Container 1</button>
        Note in console that only container 1 was destroyed, there is no log
        statement from the child component that it was destroyed.
      </li>
      <li>
        <button (click)="destroyContainerTwo()">Destroy Container 2</button>
        Now we get a log statement in the console from both container 2
        <b> and from the child component</b>.
      </li>
      <li>Refresh Plunker to do it again :)</li>
    </ol>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .demo {
      width: 100%;
      height: 200px;
    }
    .col {
      width: 50%;
      height: 100%;
      float: left;
    }
    li {
      padding: 5px;
    }
    `
  ]
})
export class App {

  @ViewChildren(ContainerComponent) containers!: QueryList<ContainerComponent>;

  containerOneEnabled = true;

  containerTwoEnabled = true;

  private childComponentRef!: ComponentRef<any>;

  private childHost!: ViewContainerRef;

  private factory = this.componentFactoryResolver.resolveComponentFactory(ChildComponent);

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    this.attachChildToContainerOne();
  }

  attachChildToContainerOne() {
    this.childHost = this.containers.first.viewContainerRef;
    this.childComponentRef = this.childHost.createComponent(this.factory);
  }

  moveChild() {
    if(this.containers.length != 2) { return; }

    this.childHost.detach(this.childHost.indexOf(this.childComponentRef.hostView));
    this.containers.last.viewContainerRef.insert(this.childComponentRef.hostView);
  }

  destroyContainerOne() {
    this.containerOneEnabled = false;
  }

  destroyContainerTwo() {
    this.containerTwoEnabled = false;
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ App, ContainerComponent, ChildComponent ],
  entryComponents: [ ChildComponent ],
  bootstrap: [ App ]
})
export class AppModule {}
