const nodemailer = require("nodemailer")

async function sendMail({from,to,subject,text,html}){

    let transporter = nodemailer.createTransport({

        service: 'gmail',
        auth: {
          user: from,
          pass: process.env.MAIL_PASS
        }
    })

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html:html
      };

      let info = await transporter.sendMail(mailOptions,function(error,info){

            if (error){
                console.log(error)
            }else{
                console.log("Mail sent!")
            }

      })
      console.log(info)


}

module.exports = sendMail;