import { Injectable } from '@angular/core';
import { List } from './list.interface';
import {Task} from './task.interface';

@Injectable( { providedIn: 'root' } )
export class DataService {
    private lists: Array < List > ;
    private subscribers: Array<Function> = [];

    constructor() {
        //setting default lists
        localStorage.setItem( 'lists', JSON.stringify([{"listId":"list-1636977823097-20","name":"To Do","tasks":[{"color":"blue","completed":false,"listId":"list-1636977823097-20","taskId":"task-1636977853415-72","text":"Helpdesk Call AA999"},{"color":"blue","completed":false,"listId":"list-1636977823097-20","taskId":"task-1636977880703-94","text":"Helpdesk Call BB999"}]},{"listId":"list-1636977890317-43","name":"Development","tasks":[{"color":"red","completed":false,"listId":"list-1636977890317-43","taskId":"task-1636977904351-32","text":"Helpdesk Call CC999"},{"color":"blue","completed":false,"listId":"list-1636977890317-43","taskId":"task-1636977932199-35","text":"Helpdesk Call EE999"}]},{"listId":"list-1636977941658-99","name":"Testing","tasks":[{"color":"red","completed":false,"listId":"list-1636977941658-99","taskId":"task-1636977950031-7","text":"Helpdesk Call DD999"}]},{"listId":"list-1636977961213-43","name":"Done","tasks":[{"color":"blue","completed":true,"listId":"list-1636977961213-43","taskId":"task-1636977973111-4","text":"Helpdesk Call FF999"},{"color":"red","completed":false,"listId":"list-1636977961213-43","taskId":"task-1636977985383-45","text":"Helpdesk Call GG999"}]}]) )

        this.load();
    }

    subscribeToLists(cb: Function) {
            this.subscribers.push(cb);
            cb(this.lists)
    }
    runSubscribers() {
        for (const cb of this.subscribers) {
            cb(this.lists)
        }
    }
    save() {
        localStorage.setItem( 'lists', JSON.stringify( this.lists ) )
        console.log('saved to localstorage');
        this.runSubscribers();
        
    }
    load() {
        this.lists = JSON.parse( localStorage.getItem( 'lists' ) ) || [];
    }
    saveNewList( listName: string ) {
        let newList: List = {
            listId: this.generateId( 'list' ),
            name: listName,
            tasks: []
        }
        this.lists.push( newList );
        this.save();
    }
    saveNewTask( taskName: string, list: List ) {
        let newTask = {
            color: 'white',
            completed: false,
            listId: list.listId,
            taskId: this.generateId( 'task' ),
            text: taskName
        }
        let listIndex = this.lists.findIndex(item => item.listId === list.listId)
        this.lists[listIndex].tasks.push(newTask);
        
        this.save();

    }
    generateId( namespace ) {
        return `${namespace}-${Date.now()}-${Math.round(Math.random()*100)}`
    }
    removeList( id: string ) {
       
        let index = this.lists.findIndex( item => item.listId === id)
        this.lists.splice(index,1);
        this.save();
    }

    removeTask(data:Task){
        let indexListId = this.lists.findIndex(item => item.listId === data.listId)
        let indexTaskId = this.lists[indexListId].tasks.findIndex(item => item.taskId === data.taskId);
        this.lists[indexListId].tasks.splice(indexTaskId, 1);
        this.save();
    }
    moveTask(data: Task, newListId: string){
        let indexListId = this.lists.findIndex(item => item.listId === data.listId)
        let indexTaskId = this.lists[indexListId].tasks.findIndex(item => item.taskId === data.taskId);
        this.lists[indexListId].tasks.splice(indexTaskId, 1);

        data.listId = newListId;
        
        let listIndex = this.lists.findIndex(item => item.listId === newListId);
        this.lists[listIndex].tasks.push(data);
        this.save();
    }
    changeListId(taskId: string, newListId: string) {
        const indexListId = this.lists.findIndex(item => item.listId === newListId)
        const indexTaskId = this.lists[indexListId].tasks.findIndex(item => item.taskId === taskId);
        const newTask = { ...this.lists[indexListId].tasks[indexTaskId]}
        newTask.listId = newListId;
        this.lists[indexListId].tasks[indexTaskId] = newTask;
        this.save();
    }
}