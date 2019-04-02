
const Trivia = require('../model/trivia');
//-------------send to admin----------------//
exports.alltrivia = function (req, res) {

    Trivia.find_all((err, trivias) => {
        res.json({
            success: true,
            message: 'received all products successfully',
            trivias: trivias
        })
    });

}

exports.import_trivia = async function (req, res) {

    let ln = req.body.length
    let existArr = [];
    let isError = false;
    let isExist = false;

    for (let list of req.body) {
        let state = '';
        let p = new Promise((resolve) => {
            Trivia.importTrivia(list, function (err, status, trivia) {
                if (err) {
                    state = 1;
                    resolve(state)
                } else if (status == false) {
                    state = 2;
                    resolve(state)
                } else {
                    resolve(state)
                }
            });

        })

        if (await p == '1') {
            isError = true;
            break;
        }
        else if (await p == '2') {
            isExist = true;
            existArr.push(ln);
            ln--;
        }
        else {
            ln--;
        }

    }

    if (isError) {
        res.status(401).send({ success: false });
    } else if (isExist) {
        res.send({
            success: false,
            message: existArr.toString().slice(0, 11) + "... th trivia is already exist"
        });
    } else {
        res.send({
            success: true,
            message: "All trivias was imported successfully!"
        });
    }

}

exports.update_trivia = function (req, res) {

    if (req.params.mode == 'update') {
        Trivia.updateTrivia(req.body, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "Trivia was changed successfully!"
                });
            }
        });
    } else if (req.params.mode == 'delete') {
        Trivia.deleteTrivia(req.body.id, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "This trivia was deleted successfully!"
                });
            }
        });
    }

}

//--------------send to client-------------------//

