(function (){

    const buttonsList = document.querySelector('.buttons');
    const reviveBtn = document.querySelector('#revive');
    
    const animal = document.querySelector('.animal img');
    
    //variables for intervals
    let pressTimer;
    let changeIcon;
    let called;
    
    //flags
    let press = false;
    let ded = false;
    let sad = false;
    
    let needEat = false;
    let needCure = false;
    let needPet = false;
    
    //icons in default state --> add 'waiting'
    const waitingIcons = ['hello_sprite'];
    
    const statistics = {};
    
    
    //update statistics value
    function setStat( name, value ) {
        statistics[ name ] = value;
        document.querySelector( `#${ name }` ).value = value;
    }
    
    
    //turn on the game after death
    function revive () {
        ded = false;
        sad = false;
        //turn on event listeners after death
        document.addEventListener('mouseup', stopCare);
        buttonsList.addEventListener('mousedown', takeCare);
        //return stats to default state
        for (var key in statistics) {
            statistics[key] = 50; 
            document.getElementById(`${key}`).value = statistics[key];
        };
        //run default functions
        decreaseStats();
        defaultMood();
    }
    
    //turn off the game
    function death() {
        ded = true;
        let needEat = false;
        let needCure = false;
        let needPet = false;
        //turn off event listeners
        document.removeEventListener('mouseup', stopCare);
        buttonsList.removeEventListener('mousedown', takeCare);
        clearInterval(called);
        called = 0;
        clearInterval(changeIcon);
        changeIcon = 0;
        clearInterval(pressTimer);
        pressTimer = 0;
        //change icon
        animal.src = "images/deadt_sprite.png";
        //show revive button
        reviveBtn.style.display = "block";
        reviveBtn.addEventListener('click', revive);
    }
    
    
    function checkMood() {
        if (press) return;
        sad = false;
        //find min stat
        const arr = Object.values(statistics);
        const min = Math.min(...arr);
        Object.entries( statistics ).forEach( ( [ name, value ] ) => {
            if (value == 0) {
                death();
                return;
            };
            if (value < 30){
                sad = true;	
                clearInterval(changeIcon);
                changeIcon = 0;
                if (value == min && name === 'eat'){
                    animal.src = "images/hungry_sprite.png";
                }
                if (value == min && name === 'cure'){
                    animal.src = "images/sick_sprite.png";  
                }
                if (value == min && name === 'pet'){
                    animal.src = "images/cry_sprite.png";  
                }
            }
        });
    }
    
    //mouseup
    function stopCare(){
        press = false;
        document.activeElement.blur();
        clearInterval(changeIcon);
        changeIcon = 0;
        clearInterval(pressTimer);
        pressTimer = 0;
        checkMood();
        if (!sad) defaultMood();
    }
    
    //mousedown
    function takeCare (e) {
        if (press) return;
        //turn off default icons
        clearInterval(changeIcon);
        changeIcon = 0;
        press = true;
        //repeat function as long as user holds the button
        pressTimer = setInterval(function() {
            Object.entries( statistics ).forEach( ( [ name, value ] ) => {
                let target = e.target;
                let maxValue = parseFloat(document.querySelector( `#${ name }` ).max);
                //find stat of pushed button
                if (name === target.dataset.need){
                    //increase value
                    value++;
                    if (value > maxValue) return;
                    setStat( name, value );
                    //change icon depending on the stat
                    switch(name){
                        case 'eat':
                            animal.src = "images/eat_sprite.png";
                            needEat = false;
                            break;
                        case 'cure':
                            animal.src = "images/cure_sprite.png";
                            needCure = false;
                            break;
                        case 'pet':
                            animal.src = "images/happy_sprite.png";
                            needPet = false;
                            break;
                        default:
                            defaultMood();
                    }
                }
            });
        }, 80);
    }
    
    //reset icon when user isn't doing anything
    function defaultMood () {
        if (press || ded || sad) return;
        //draw random miliseconds to show random icons
        let miliseconds = Math.floor((Math.random() * (30 - 5) + 5) * 1000);
        changeIcon = setInterval(function(){
            let i = Math.floor(Math.random() * (waitingIcons.length - 0));
            let icon = waitingIcons[i];
            animal.src = `images/${icon}.png`;
        }, miliseconds);
        animal.src = "images/hello_sprite.png";
    }
    
    
    function decreaseStats() {
        reviveBtn.style.display = "none";
        called = setInterval (() => {
            Object.entries( statistics ).forEach( ( [ name, value ] ) => {
                value--;
                setStat( name, value );
            })
            checkMood();
        }, 1000);
    }
    
    window.addEventListener('load', () => {	
        //set initial stats
        const stats = document.querySelectorAll('.stats input');	
        stats.forEach(stat => {
            let name = stat.id;
            let value = stat.value;
            setStat( name, value );
        });

        //run initial functions
        decreaseStats();
        defaultMood();
        
    
    })
    
    buttonsList.addEventListener('mousedown', takeCare, false);
    document.addEventListener('mouseup', stopCare, false);
    
    }());