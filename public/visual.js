


//circle background movement
const circleIcon = document.querySelector('.circleIcon');
const titleCont = document.querySelector('.title');


document.addEventListener('scroll', circleIconEvent);

function circleIconEvent(){
    if (screen.width<=900){
        return;
    }
    let fracDone;
    if(window.scrollY>=window.innerHeight){
       fracDone =1;
    }
    else{
        fracDone =  window.scrollY/window.innerHeight;
    }

    const xValue = -(window.innerWidth/2)*fracDone;
    const yValue = -(window.innerHeight/5)*fracDone;
    const scaleValue = 1-1*fracDone;
    const rotateValue = -20*fracDone;
    
    circleIcon.style.transform = `translate(${xValue}%, ${yValue}%)  scale(${scaleValue},${scaleValue})`;
    titleCont.style.transform = `translate(${yValue}%, ${yValue}%) scale(${scaleValue},${scaleValue}) rotate(${rotateValue}deg)`;
    
   

}





const backToTop = document.querySelector('.backToTop');
const logoIcon = document.querySelector('.title .logo');
backToTop.addEventListener('mouseover', revealBackToTop);
backToTop.addEventListener('mouseout', hideBackToTop);
backToTop.addEventListener('click', scrollToTop);
logoIcon.addEventListener('click', scrollToTop);


//back to top button
function revealBackToTop(){
    backToTop.classList.remove('hidden');
}

function hideBackToTop(){
    backToTop.classList.add('hidden');
}

function scrollToTop(){
    window.scrollTo(0, 0);
}


//navBar, for all three page
const allNavIcon = document.querySelectorAll('.navBar div.navBubbleNor');
const firstNavIcon = document.querySelectorAll('.navBar div:nth-child(1)');
const secNavIcon = document.querySelectorAll('.navBar div:nth-child(2)');
const thirdNavIcon = document.querySelectorAll('.navBar div:nth-child(3)');



allNavIcon.forEach(nav=>nav.addEventListener('mouseover',navIconAdd));
allNavIcon.forEach(nav=>nav.addEventListener('mouseout',navIconRemove));

function navIconAdd(){
    this.classList.add('selectedNav');
}

function navIconRemove(){
    this.classList.remove('selectedNav');
}


firstNavIcon.forEach(icon=> icon.addEventListener('click', navToFirst));

function navToFirst(){
    let xValue = document.querySelector('.landing').getBoundingClientRect().top;
    xValue += window.scrollY;
    window.scrollTo(0,xValue);
}



secNavIcon.forEach(icon=> icon.addEventListener('click', navToSec));

function navToSec(){
    let xValue = document.querySelector('.addContent').getBoundingClientRect().top;
    xValue += window.scrollY;
    window.scrollTo(0, xValue);
}




thirdNavIcon.forEach(icon=> icon.addEventListener('click', navToThird));

function navToThird(){
    let xValue = document.querySelector('.displayContent').getBoundingClientRect().top;
    xValue += window.scrollY;
    window.scrollTo(0, xValue);
}


//alert popup

const exitAlert = document.querySelector('.exitAlert');
const alertPopup = document.querySelector('.alertPopup');

exitAlert.addEventListener('click',()=>alertPopup.classList.add('hidden'));

