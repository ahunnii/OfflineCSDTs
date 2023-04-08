// When user scrolls down the page, change scroll indicator
window.onscroll = function () {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
};

window.onload = function(){
  $( "ul#sidenav" ).clone().appendTo( "ul#mobileNavigation" );
}
let constants = {
  logoutButton: 'logout-btn',
  loginToSaveButton: '.save-cloud-login',

  userName: '#userName',
  userPass: '#userPass',

  login_prompt: 'loginModal',
  login_btn: 'login',
  user_status: 'user-status',
};


function initLoginStatus(data) {
  let base = data.username;
  let loginURL = '/users/' + data.id;
  let classrooms = loginURL + '/classes';

  $(`#${constants.user_status}`).html("<i class='fas fa-user'></i>&nbsp; " + base);

  $(`#user-projects`).attr('href', loginURL);
  $(`#user-classrooms`).attr('href', classrooms);
  $(constants.logoutButton).attr('hidden', false);
  $(`#${constants.logoutButton}`).attr('hidden', false);
  $(`#user-sign-up`).attr('hidden', true);
  

}
var stc = new Cloud();
var username = null;
var userid = null;

stc.getCurrentUser(function (data) {
  if (data.id != null) {
    initLoginStatus(data);
    $(`#${constants.user_status}`).addClass('dropdown-toggle');
    $(`#${constants.user_status}`).attr('data-toggle', 'dropdown');
    $(`#${constants.user_status}`).attr('href', '#');
  }

}, function (error) {
  console.error(error)
});

