const debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const PosData = require('./models/PosData');
const WepickDeal = require('./models/WepickDeal');

const app = express();

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// log from 3-11 to 3-31
for (let i = 11; i < 32; i++) {
    let datestr = '2018-03-';
    if (i>9)
        datestr += i+' ';
    else
        datestr += '0' + i + ' ';
    for (let k = 0; k < 24; k++) {
        let finalstr;
        if (k < 10)
            finalstr = datestr + '0' + k;
        else
            finalstr = datestr + k;
        for (let j = 1; j < 61; j++)
            PosData.aggregate([
                { $match: { $and: [{ TransDate: finalstr }, {WepickRank: j }]} },
                { $sortByCount: '$DealId' },
                {$limit:1}
            ]).then(data => {
                if (!data)
                    return;
                else if (data.length == 0)
                    return;
                let idstr = j;
                if (j < 10)
                    idstr = '0' + idstr;
                const slotdata = new WepickDeal({
                    _id: finalstr + ' ' + idstr,
                    cnt: data[0].count,
                    deal: data[0]._id
                });
                return slotdata.save();
            }).catch(err => console.error(err));
    }
}