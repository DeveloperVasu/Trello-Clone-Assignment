import { Component, OnChanges } from '@angular/core';
import { DataService } from './data.service';
import { List} from './list.interface';
import { SortablejsOptions } from 'angular-sortablejs';
import { e } from '@angular/core/src/render3';


@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
} )
export class AppComponent  {   
    private lists: Array<List>;
    private addListText: String = "Add New List Here!";
    private dataService: DataService;
    private sortableOptions: SortablejsOptions = {
        group: 'listSortable',
        animation: 150,
        handle: '.handle' ,
        onUpdate: (event: any) => {
            this.dataService.save();
        }
    };
    constructor( dataServ: DataService ) {
        dataServ.subscribeToLists((data) => {
            this.lists = data;
        });
        
        this.dataService = dataServ;
    }
    onSaveNewList() {
        if (this.addListText.trim() !== '') {
            this.dataService.saveNewList(this.addListText.trim());
            this.addListText = '';
        }
        
    }
    
}