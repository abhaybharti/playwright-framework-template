var nodeoutlook = require("nodejs-nodemailer-outlook");

function sendEmailReport() {
  nodeoutlook.sendEmail({
    auth: {
      user: "xxxxx",
      pass: "password",
    },
    from: "emailid",
    to: "emailid",
    subject: "subject",
    html: "<b>Pls open attached HTML file</b>",
    replyTo: "abhaybharti@gmail.com",
    attachments: [
      { filename: "index.html", path: "../../../playwright-report/index.html" },
    ],
    onError: (e: any) => console.log(e),
    onSuccess: (i: any) => console.log(i),
  });
}
sendEmailReport();
