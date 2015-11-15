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
  .get(function (){
    var phone = request.body.From;
    var msg = request.body.Body || '';
    msg = msg.toLowerCase().trim();
    console.log(msg)
  })
  .post(function (){
    var phone = request.body.From;
    var msg = request.body.Body || '';
    msg = msg.toLowerCase().trim();
    console.log(msg)
  })