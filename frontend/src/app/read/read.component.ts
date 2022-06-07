import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  constructor( private service:ApiserviceService) { }
  readData:any;
  delMsg:any;
  
  ngOnInit():void {
    this.getAllData();
  }

  deleteUser(id:any){
      let ids = id;
      this.service.deleteData(ids).subscribe((res)=>{
        this.delMsg = res.message
        this.getAllData();
      })
  }

  getAllData(){
    
    this.service.getAllData().subscribe((res)=>{
      console.log(res);
      this.readData = res.data;
    })
  }


}
