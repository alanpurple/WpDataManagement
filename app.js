const debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const PosData = require('./models/PosData');
const WepickDeal = require('./models/WepickDeal');
const Deal = require('./models/DealW2v');
const Category1 = require('./models/Category1');
const Category2 = require('./models/Category2');
const PrahaDeal = require('./models_praha/DealInfo');

const app = express();

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

Deal.find({ _id: { $gte: 30000, $lt: 500000 } }).then(deals =>
    deals.forEach(deal => {
        if (deal.title)
            if (deal.title.length > 0)
                return;
        PrahaDeal.findOne({ did: deal._id })
            .then(pdeal => {
                if (!pdeal)
                    return;
                if (pdeal.t.ti1)
                    Category1.findById(pdeal.t.ti1).then(ct1 => {
                        if (!ct1)
                            return Category1.create({
                                _id: pdeal.t.ti1,
                                name: pdeal.t.tn1
                            });
                    }).catch(err => console.error(err));
                if (pdeal.t.ti2)
                    Category2.findById(pdeal.t.ti2).then(ct2 => {
                        if (!ct2)
                            return Category2.create({
                                _id: pdeal.t.ti2,
                                name: pdeal.t.tn2
                            });
                    }).catch(err => console.error(err));
                deal.title = pdeal.mn;
                if (pdeal.t.ti1)
                    deal.category1 = pdeal.t.ti1;
                if (pdeal.t.ti2)
                    deal.category2 = pdeal.t.ti2;
                return deal.save().then(() => {
                    if (deal == deals[deals.length - 1])
                        console.log('last one saved');
                });
            })
    })).catch(err => console.error(err));

// log from 4-01 to 4-11
/*for (let i = 1; i < 12; i++) {
    let datestr = '2018-04-';
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
        for (let j = 61; j < 100; j++)
            PosData.aggregate([
                { $match: { $and: [{ TransDate: finalstr }, {WepickRank: j }]} },
                { $sortByCount: '$DealId' },
                {$limit:1}
            ]).then(data => {
                if (i == 11 && k == 23 && j == 99)
                    console.log('almost over');
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
}*/