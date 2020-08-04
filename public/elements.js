
/*code from W3School */

// Create a "close" button and append it to each list item
var myNodelist = document.querySelectorAll(".watchItem");
for (let i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  span.textContent = "\u00D7"
  span.classList.add('checkButton')
  myNodelist[i].appendChild(span);
}
