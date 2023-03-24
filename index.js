const express = require("express")
const cors = require("cors")
const fs = require('fs')
const stream = require('stream')
const multer = require('multer')

const storageEngine = multer.diskStorage({
    destination: "./img/test",
    filename: (req, file, cb) => { cb(null, `${Date.now()}--${file.originalname}`); },
});

const upload = multer({ storage: storageEngine })

const app = express()

// app.use(cors({
//     origin: "*"
// }))

app.get("/", async(req, res) => {
    const r = fs.createReadStream('./img/1.png')
    const ps = new stream.PassThrough()
    stream.pipeline(
        r,
        ps,
        (err) => {
            if(err) {
                console.log(err)
                return res.sendStatus(400);
            }
        })
    ps.pipe(res)
})

app.post('/test', upload.single('image'), (request, respond) => {
    console.log(request.file)
        // var image = request.body
        // fs.writeFile('test.png', image, function(err) {
        //     if(err) throw err
        //     console.log('File saved.');
        // });
    respond.end();
});

app.listen(8080, () => {})