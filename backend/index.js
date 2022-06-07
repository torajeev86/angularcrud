const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
const mime = require('mime');

const app = express();
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
app.use(bodyparser.json());
app.use('/images', express.static('images'));

// database Connection
const db = mysql.createConnection({
host:"localhost",
user:'root',
password:'',
database:'cruddb',
port:'3306'
})

db.connect(err=>{
    if(err){
        console.log(err,'database err'); 
        } else { console.log('database connected');
    }
});

app.get('/user',(req,res)=>{
    let query = 'select * from user';
    db.query(query,(err,result)=>{
        if(err){
            console.log(err,'err');
        }
        if(result.length>0){
            res.send({
                message:'all data',
                data : result
            })
        }

    });
});

app.get('/user/:id',(req,res)=>{
    let uid = req.params.id;
    let query = `select * from user where id = ${uid}`;
    db.query(query,(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result.length>0)
        {
            res.send({
                message:'single data',
                data:result
            });
        } else {
            res.send({
                message:"data not found"
            });
        }
    });
});


const uploadImage = async (req, res, next) => {
// to declare some path to store your converted image
var matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
response = {};
 
if (matches.length !== 3) {
return new Error('Invalid input string');
}
 
response.type = matches[1];
response.data = new Buffer(matches[2], 'base64');
let decodedImg = response;
let imageBuffer = decodedImg.data;
let type = decodedImg.type;
let extension = mime.extension(type);

try {
let ts = Date.now();
let fileName = "profile_image"+ts+'.'+ extension;
fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
res.body = fileName;

  //next();
// return res.send({"status":"success",
//     "fileName":fileName
// });
//response.write({"fileName":fileName});
} catch (e) {
next(e);
}
}


app.post('/user',(req,res)=>{
      
    let fullname = req.body.fullname;
    let email = req.body.email;
    let mobile = req.body.mobile;
     
    uploadImage(req, res); 
  let imageName= res; 
     let query = `insert into user(fullname,email, mobile,image_name)
                values('${fullname}','${email}','${mobile}','${imageName.body}')`;
//console.log(query);
    db.query(query,(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            res.send({
                message:'Data inserted successfully'
            })
        } else{
            res.send({
                message:'something went wrong'
            })
        }
    })
    
})

app.delete('/user/:id',(req,res)=>{
    
    let uid = req.params.id;
    let query = `delete from user where id = '${uid}'`;
    db.query(query,(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            res.send({
                message:"data deleted successfully"
            });
        } else {
            res.send({
                message:"wrong"
            })
        }
    })
});

app.put('/user/:id',(req,res)=>{
    
    let uid = req.params.id;
    let name = req.body.fullname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let query = `update user set fullname = '${name}', email = '${email}', mobile = '${mobile}' where id = '${uid}'`;
    db.query(query, (err, result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            res.send({
                message:"data update successfully"
            });
        } else {
            res.send({
                message:"data not updated"
            })
        }
    })
});


app.listen(3000,(req,res)=>{
   
    console.log('server is running ..');
})
