function login (){
  var email = $("#email").val();
  var pass = $("#password").val();
  $.post("/login-handler", {email: email , password: pass},function(data, status){
    console.log(data,status);
    var dat = JSON.parse(data)
    if(dat.type === 'error')
      alert(dat.message);
    else{
      window.location.href = '/';
    }
  })
}

$(function (){
  $('#login').on('click',login)
})
