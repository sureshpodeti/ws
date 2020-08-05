import { Component, OnInit, NgZone } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
require("nativescript-websockets");

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html",
    styleUrls: ["./item.css"]
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;

    private socket: any;
    public messages: Array<any>;
    
    constructor(private itemService: ItemService, private zone: NgZone){
        // this.socket = new WebSocket("wss://echo.websocket.org", []);
        this.socket = new WebSocket("ws://127.0.0.1:1234/", []);

        this.messages = [];
    }
    ngOnInit(){
        this.items = this.itemService.getItems();
        this.socket.addEventListener('open', event => {
            this.zone.run(() => {this.messages.push({content: "Welcome to the chat!"})});
        })

        this.socket.addEventListener('message', event => {
            this.zone.run(() => {
                this.messages.push({content: event.data});
                console.log("message received:", event.data);
            })
        })

        this.socket.addEventListener('close', event=>{
            this.zone.run(() => {
                this.messages.push({content: "You have been disconnected!"});
            })
        })

        this.socket.addEventListener('error', event => {
            console.log("The socket had an error", event.error);
        })

    }

    ngOnDestroy(){
        this.socket.close();
    }

    send(){
        let r = Math.random().toString(36).substring(7);
        console.log("sending:", r);
                   
        this.socket.send(r);
        
    }
}
