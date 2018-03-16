const fs = require('fs');
const csvtojson = require('csvtojson');
const request = require('request').defaults({encoding: null});
const http = require('http');
http.globalAgent.maxSockets = 5;

const csvFilePath = './a31644trim.txt'
let inv = [];
csvtojson()
    .fromFile(csvFilePath)
        .on('json', (jsonObj)=>{
            //console.log(jsonObj);
            inv.push(jsonObj);
            //console.log(inv[0])
        })
        .on('done', (error)=>{
            console.log('done')
            //console.log(inv[0])
            initPull(inv);
        });

function initPull(invArr){
    //console.log(invArr)
    invArr.forEach((item)=> {
        item.pdata = [];
        //console.log(item.URLs.split(",")[0])
        //item.URLs.request()
        let pics = item.URLs.split(',');
        pics.forEach((pic)=> {

            //request.get(pic).pipe(request.post('http://mysite.com/img.png'))
            request.get(pic, (error, response, body)=>{
                //console.log(response);
                if(!error && response.statusCode == 200){
                    let pdata = new Buffer(body).toString('base64'); //"data:" + response.headers["content-type"] + ";base64," +
                    //console.log('pic request done')
                    //console.log(pdata)
                    item.pdata.push(pdata);
                    //console.log('pdata pushed')
                    console.log(item.pdata.length);
                    if(item.pdata.length == pics.length){
                        postpics(item.StockNum, item.pdata);
                    }
                }
            })
        })

    })
}

function postpics(stockNum, picData){
    console.log('post pics called', stockNum)
    //for(let i = 0; i<1; i++){
        let opts = {
            url: 'http://seotest.cmorecars.com/service/picture/add',
            headers: {
                contentType: 'application/json',
                agent: 'false'
            },
            formData: {
                'data[user]': 'feed',
                'data[password]': '3aHZ634u2eCuW5Ms',
                'data[account]': 'seotest',
                'data[picture][new]': 'true',
                'data[picture][caption]': '',
                'data[picture][sortOrder]': '0',
                'data[picture][data]': picData[0].toString(),
                'data[picture][stockNo]': '2730',
                'data[picture][accountNo]': 'seotest',
            }
        }    
       // console.log(args);
       console.log(picData[0])
        request.post(opts, function optionalCallBack(error, response, body){
            console.log('post submitted')
            if(response.statusCode == 200){
                console.log('pic added');
            } else {
                console.log('status', response.statusCode)
            }
        })
   // }
}