function changetext(){
    let para = document.querySelector('.my_para');
    para.innerHTML = "Text is Changed";
    let hello = document.querySelector('.hello');
    let newbtn = document.createElement('button');
    newbtn.innerHTML = 'NEW Button';
    newbtn.classList.add('btn2');
    newbtn.setAttribute('onclick',"btnpressed();")
    hello.appendChild(newbtn);
    alert('Change is done');
}
