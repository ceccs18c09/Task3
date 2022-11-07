const express= require('express');
const mysql= require('mysql2');

var app = express();

app.use(express.json());

var db =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anjana@123',
    database: 'task3'

})

db.connect((err)=>{

    if(!err){

        console.log("Connected to mysql");
    }

    else{

        console.log("Not connected");
    }
})

//authorization

app.use("/", (req, res, next) => {
    const auth = req.headers.authorization;
    const credentials = Buffer.from(auth.split(" ")[1], "base64")
      .toString("ascii")
      .split(":");
  
    if (credentials[0] === "super" && credentials[1] === "super") {
      next();
    } else {
      res.status(401).send({"Message": "Uauthorized user"});
    }
  })



//get all employeee

app.get('/api/employee/',(req,res)=>{

   let sql =`Select * from emp`;
 db.query(sql, (err,result)=>{
    if(err){
        res.status(500).send({"Message": "Internal Server Error"});
        console.log("error: " + err);
    }
    else{
        
        console.log(result)
        res.send(result);
    }



   })
});


//get employee of particular id

app.get('/api/employee/:id',(req,res)=>{

    const id=req.params.id;
    let sql= `Select * from emp where  ${id}=id`; 
    db.query(sql, (err,result)=>{
        if(err){
            res.status(500).send({"Message": "Internal Server Error:" +err});
        }
        
        else{
            console.log(result)
            res.send(result);
            }
        
    
    
    
       })
}
);


//Delete a particular employee

app.delete('/api/employee/:id',(req,res)=>{

    const id=req.params.id;
    let sql1=`Select name,age from emp where id=(?)`;
    let sql=`Delete from emp where id=(?)`;
    db.query(sql1,id,(err,result)=>{

        if(err)
        {
            res.status(500).send({"Message": "Internal Server Error"});
        console.log("error: " + err);
        }
        else
        
        {    db.query(sql,id,(er,rese)=>{
                if(er){
                    res.status(500).send({"Message": "Internal Server Error"});
    
                    console.log("error: " + er);
                }
                else{
                    res.send({result});
                   
                }
            });
        }

    });

}
);    





//Alter name and age

app.put('/api/employee/:id',(req,res)=>{
    console.log("hello0");
 const id=req.params.id;
const employee=req.body;
 if(employee.name&& employee.age){
    let sql = `UPDATE emp
           SET Name = ?,
            Age = ?
             Where Id = ?`

let data = [employee.name, employee.age,id];
    console.log("hello1")
    db.query(sql,data, (err,result)=>{

        if(err)
        { console.log("hello2");
            console.log("error:" + err);
//res.send(err);
        res.status(500).send({"Message": "Internal Server Error"});
        }
        else
        { console.log("hello3");
          //  res.send(result);
            let sql1=`SELECT * FROM emp`;
            db.query(sql1, (er, resu)=>{

                if(!er)
                res.send(resu);

            });
        }
    });

 }

 else if(employee.name){

    let sql = `UPDATE emp
    SET Name = ?
      Where Id = ?`;

    let data=[employee.name,id];
    db.query(sql,data, (err,result)=>{

        if(err)
        { console.log("hello2");
            console.log("error:" + err);
            res.send(err);
        }
        else
        { console.log("hello3");
          //  res.send(result);
          let sql1=`SELECT * FROM emp`;
          db.query(sql1, (er, resu)=>{

              if(!er)
              res.send(resu);

          });
        }
    });


 }

 
else{

    let sql = `UPDATE emp
    SET age = ?
      Where Id = ?`;

    let data=[employee.age,id];
    db.query(sql,data, (err,result)=>{

        if(err)
        { console.log("hello2");
            console.log("error:" + err);
           // res.send(err);
           res.status(500).send({"Message": "Internal Server Error"});
        }
        else
        { console.log("hello3");
            //res.send(result);
            let sql1=`SELECT * FROM emp`;
            db.query(sql1, (er, resu)=>{

                if(!er)
                res.send(resu);

            });
        }
        })



}


});

// To create a new employee
app.post('/api/employee/', (req, res)=>{
    let employee=req.body;
    if(employee.name&&employee.age&& employee.age<100){ 
        let sql = `INSERT INTO emp ( Name, age) VALUES (?,?)`;
        db.query(sql,[employee.name,employee.age], (err,result)=>{
            if(err){
                console.log("hello0");
                res.status(500).send({"Message": "Internal Server Error"});
            }
            else{
               let sql1=`SELECT Id FROM emp WHERE name=? AND age=?`
               console.log("hello1");
               db.query(sql1,[employee.name,employee.age], (err,rese)=>{
                    if(err){
                        console.log("hello2");
                        res.send(err)
                    }
                    else{
                        console.log("hello3");
                res.send(rese);
                    }
               });


           //res.send(result);

            }
        })
    }
    else{
        res.status(400).send({"Message": "Bad Request"});
        console.log("error: " + err);
    }
    });    


//To get distict employee
app.get('/api/distinct/', (req, res)=>{

let sql=`SELECT DISTINCT Name FROM emp`;
db.query(sql,(err,result)=>{

    if(err){
        
        res.send("Error:" + err);
    }
else{

    res.send(result);
}


}); 




});    




app.listen(3000,()=>{
    console.log("The server is listening on port 3000");
})