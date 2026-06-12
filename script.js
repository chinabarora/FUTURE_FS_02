// Typing Animation

const text = [
  "BCA Student",
  "Web development Learner",
  "Future Intern"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type(){

  if(count === text.length){
    count = 0;
  }

  currentText = text[count];
  letter = currentText.slice(0, ++index);

  document.querySelector(".typing").textContent = letter;

  if(letter.length === currentText.length){
    count++;
    index = 0;
  }

  setTimeout(type, 200);

})();


// Dark Mode

const themeBtn = document.getElementById("theme-btn");

themeBtn.onclick = () => {
  document.body.classList.toggle("light-mode");
};

emailjs.init("2ctnD-rvI0NvywY1w");

document.getElementById("contact-form")
.addEventListener("submit", function(event){

event.preventDefault();

emailjs.send(
"service_x4bxcn9",
"template_bol02y8",
{
name: document.getElementById("name").value,
email: document.getElementById("email").value,
github: document.getElementById("github").value,
message: document.getElementById("message").value
})

.then(function(){
alert("Message sent successfully!");
document.getElementById("contact-form").reset();
})

.catch(function(error){
alert("Failed to send");
console.log(error);
});

});