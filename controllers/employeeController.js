const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var fs=require('fs');
const { text } = require('body-parser');
var app = express()
var http = require('http').Server(app);


router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Driver Details"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    employee.cname = req.body.cname;
    employee.fullName = req.body.fullName;
    employee.vnn = req.body.vnn;
    employee.oname = req.body.oname;
    employee.lp = req.body.lp;
    employee.latitude = req.body.latitude;
    employee.longitude = req.body.longitude;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Driver Details",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/fulllist', (req, res) => {
    
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/fulllist", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

// serach
router.get('/list', (req, res) => {
    if(req.query.search){
        const regex =new RegExp(escapeRegex(req.query.search),'gi');
        // const regex=req.query.search;
        Employee.find({vnn:regex},(err, docs) => {
            if (!err) {
                res.render("employee/list", {
                    list: docs
                });
            }
            else {
                console.log('Error in retrieving employee list :' + err);
            }
        });
    }else{
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/empty", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}
});

router.get('/allsearch', (req, res) => {
    if(req.query.search){
        const regex=req.query.search;
        Employee.find({"$or":[{vnn:regex},{fullName:regex},{lp      :regex}]},(err, docs) => {
            if (!err) {
                res.render("employee/allsearch", {
                    list: docs
                });
            }
            else {
                console.log('Error in retrieving employee list :' + err);
            }
        });
    }else{
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/empty", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}
});

// maps start
router.get('/new', (req, res) => {
    res.render("employee/new", {
        viewTitle: "Insert Driver Details"
    });
});
// app.get('/index.html', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
//     });

// maps end



function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'vnn':
                body['vnn'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

// // search
// app.get("/search/:vnn",function(req,res){
//     var regrex=new RegExp(req.params.vnn,'i');
//     Employee.find({vnn:regrex}).then((request)=>{
//         res.send(request);
//     })
// })


function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\$]/g,"\\$&");
};

module.exports = router;
