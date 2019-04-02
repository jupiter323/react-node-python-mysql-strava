var db = require('./db');

var Sponsor = function (sponsor) {
    var that = new Object();
    that.sponsorID   = sponsor.sponsorID;
    that.sponsorName = sponsor.sponsorName;
    that.sponsorBanner = sponsor.sponsorBanner;
    that.contactName = sponsor.contactName;
    that.contactPhoneNo = sponsor.contactPhoneNo;
    that.contactEmail = sponsor.contactEmail;
    that.totalPrize = sponsor.totalPrize;

    return that;
};

var createSponsor = function (body, callback) {
    
    var newSponsor = {
        sponsorName: body.sponsorName,
        sponsorBanner: body.bannerImg,
        contactName: body.contactName,
        contactPhoneNo: body.contactPhoneNo,
        contactEmail: body.contactEmail,
        totalPrize: body.totalPrize
    };

    sponsorBanner = 'assets/img/demo/sponsor/' + body.bannerImg;

    db.query(`INSERT INTO sponsors (sponsorName, sponsorBanner, contactName, contactPhoneNo, contactEmail, totalPrize ) values (?,?,?,?,?,?)`,
        [body.sponsorName, sponsorBanner, body.contactName, body.contactPhoneNo, body.contactEmail, body.totalPrize],
        function (err) {
            if (err) {                
                if (err.code === 'ER_DUP_ENTRY') {
                    return createSponsor(body, callback);
                }
                return callback(err);
            }

            return callback(null, true, new Sponsor(newSponsor));
        }
    )
}

var registerSponsor = function (body, callback) {
    
    db.query('SELECT * FROM sponsors WHERE sponsorName = ?', [body.sponsorName], function (err, rows) {
        if (err) {
            callback(err);
        }
        if (rows.length) {
            return callback(null, false);
        }
        return createSponsor(body, callback);
    });
}

var findSponsor = function (name, callback) {
    
    db.query('SELECT * FROM sponsors WHERE sponsorName = ?', [name], function (err, rows) {
        
        if (err) {
            
            return callback(err);
        }
        else if(rows.length > 0) {
            
            return callback(null, new Sponsor(rows[0]));
        } else {
            return callback(null);
        }
    });
}

var findSponsorWithID = function (id, callback) {
    
    db.query('SELECT * FROM sponsors WHERE sponsorID = ?', [id], function (err, rows) {
        
        if (err) {
            
            return callback(err);
        }
        else if(rows.length > 0) {
            
            return callback(null, new Sponsor(rows[0]));
        } else {
            return callback(null);
        }
    });
}

var find_all = function (callback) {
    db.query('SELECT * FROM sponsors', [], function (err, rows) {
        if (err)
            return callback(err);
        else
            return callback(null, rows);
    });
}

var updateSponsor = function (body, callback) {
    
    db.query('UPDATE sponsors SET ? WHERE sponsorID = ?'
        , [
            {
                sponsorName: body.sponsorName,
                sponsorBanner: "assets/img/demo/sponsor/"+body.sponsorBanner,
                contactName: body.contactName,
                contactPhoneNo: body.contactPhoneNo,
                // totalPrize: totalPrize
            }, body.id]
        , function (err) {
            return callback(err);
        })
}


var deleteSponsor = function (id, callback) {

    db.query('DELETE FROM sponsors WHERE sponsorID = ?',
      [id]
      , function (err) {
        return callback(err);
      });
  
    
  }

exports.registerSponsor = registerSponsor;
exports.findSponsor = findSponsor;
exports.find_all = find_all;
exports.updateSponsor = updateSponsor;
exports.findSponsorWithID = findSponsorWithID;
exports.deleteSponsor = deleteSponsor