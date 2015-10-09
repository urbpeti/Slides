$(function () {
  $.post("/showslides",function(data, status){
    var slides = JSON.parse(data);
    //for (var i = 0; i < slides.length; i++) {
      var name =slides.title
      var id = slides._id
      var btn = document.createElement("BUTTON");
      var t = document.createTextNode(name);
      btn.appendChild(t);
      document.body.appendChild(btn);
    //}
  })
})
