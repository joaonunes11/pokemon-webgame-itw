//<!-- ITW Grupo 48: Número: 55982, Tânia Miranda, PL26
//                   Número: 53745, João Nunes, PL26 
//                   Número: 40292, Francisco Silva, PL26 -->
function store(){

    var name = document.getElementById('name');
    var pw = document.getElementById('pw');

    if(name.value.length == 0){
        alert('Por favor insira um email');

    }else if(pw.value.length == 0){
        alert('Por favor insira uma password');

    }else if(name.value.length == 0 && pw.value.length == 0){
        alert('Por favor insira um email e password');

    }else{
        localStorage.setItem('name', name.value);
        localStorage.setItem('pw', pw.value);
        alert('A tua conta foi criada.');
    }
}

//checking
function check(){
    var storedName = localStorage.getItem('name');
    var storedPw = localStorage.getItem('pw');

    var userName = document.getElementById('userName');
    var userPw = document.getElementById('userPw');
    var userRemember = document.getElementById("rememberMe");

    if(userName.value == storedName && userPw.value == storedPw){
        alert('Tu estás logado.');
    }else{
        alert('Erro no login');
    }
}