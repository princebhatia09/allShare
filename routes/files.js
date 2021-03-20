const router = require("express").Router();

const multer  = require("multer");
const path = require("path");
const File = require("../models/file")

const {v4:uuid4} = require("uuid");

let storage = multer.diskStorage({

    destination: (req,file,cb)=> cb(null,"uploads/"),
    filename :(req,file,cb)=>{
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniquename);
    }

})

let upload = multer({

    storage,
    limit: {fileSize:1000000*100},

}).single('myfile');


router.post("/",(req,res)=>{
    // validate request

    //file to store to uploads
        upload(req,res,async (err)=>{

            if(!req.file){
                return res.json({error:"All fields are required"})
            }
                    
            if (err){
                return res.status(500).send({error:err.message});
            }

            const file1 = new File({ 
                filename:req.file.filename,
                uuid:uuid4(),
                path:req.file.path,
                size:req.file.size
            });

            const response = await file1.save();
            return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})

        })

    //  store into database


    //response download link


})

router.post("/send",async(req,res)=>{
    //validate request
    console.log(req.body)
    
    const {uuid ,emailto,emailfrom} = req.body;
    if (!uuid || !emailto || !emailfrom){

        return res.status(422).send({error:"All fields are required"})

    } 

    const file = await File.findOne({uuid:uuid});

    if (file.sender){
        return res.status(422).send({error:"Email already sent"})
    }

    file.sender = emailfrom;
    file.receiver= emailto;

    const response = await file.save();

    //save mail

    const sendMail = require("../services/emailservice")
    sendMail({
        from:emailfrom,
        to:emailto,
        subject:"AllShare File sharing",
        text:`${emailfrom} shared a file with you`,
        html: require("../services/emailTemplate")({emailFrom:emailfrom,
        downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size:parseInt(file.size/1000)+" KB",
        expires:'24 Hours'
        })

    });

    return res.send({success:true})



})


module.exports = router;
