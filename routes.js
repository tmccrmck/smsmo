Router.route('/login', function () {
  if (Meteor.user()) {
  	this.redirect('/');
  } else {
  	this.render('login');
  }
});

Router.route('/', function () {
  if (Meteor.user()) {
  	this.render('home');
  } else {
  	this.redirect('/login');
  }
});

Router.route('/message', { where: 'server' })
  .post(function (req, resp){
    var phone = request.body.From;
    var msg = request.body.Body || '';
    msg = msg.toLowerCase().trim();
    console.log(msg)
  })