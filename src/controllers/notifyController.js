const NotifyController = {
    async notify(req, res){
        const io = req.app.get('io');

        try {
            io.emit('notify', req.body);
            res.status(201).json({result: 'True', msg: 'Okay'});
        }catch(err) {
            console.log(err);
            res.status(500).json({result: 'False', msg: err.message});
        }
    }
};

module.exports = NotifyController;