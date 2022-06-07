import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private service:ApiserviceService, private router:ActivatedRoute) { }
  errormsg:any;
  succmsg:any;
  getParamId:any;
  fileToUpload: any;
  imageUrl: any;
  userData:any;
  ngOnInit() {
    //console.log(this.router.snapshot.paramMap.get('id'),"ssss");
    this.getParamId = this.router.snapshot.paramMap.get('id');
    if(this.getParamId){
    this.service.getSingleData(this.getParamId).subscribe((res)=>{
      this.userForm.patchValue({
        'fullname':res.data[0].fullname,
        'email':res.data[0].email,
        'mobile':res.data[0].mobile,
        
      });
    });
  }
  }
  userForm = new FormGroup({
    'fullname':new FormControl('',Validators.required),
    'email':new FormControl('',Validators.required),
    'mobile':new FormControl('',Validators.required)
  });
  

  userSubmit(){
    if(this.userForm.valid){
     
    const actualUser:any=this.userForm.value;
    const ImageUrlUser:any={'image':this.imageUrl};
    let mergedObj = { ...actualUser, ...ImageUrlUser };   
      this.service.createData(mergedObj).subscribe((res)=>{
        this.succmsg = "Your data has been posted successfully";
        this.userForm.reset();
      });
    } else{
      this.errormsg="all field required";
    }
  }

  userUpdate(){
    if(this.userForm.valid){
        this.service.updateData(this.userForm.value,this.getParamId).subscribe((res)=>{
          this.succmsg = res.message;
        });
    }else {
      this.errormsg = "All fields are required"
    }
  }


  
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      //console.log(this.imageUrl);
    };

    reader.readAsDataURL(this.fileToUpload);
  }
}