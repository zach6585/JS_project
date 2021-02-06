const LOGIN_URL = "http://localhost:3000";
const PAINTINGS_URL = `${LOGIN_URL}/paintings`;
const SIGNUP_URL = `${LOGIN_URL}/users`


document.addEventListener('DOMContentLoaded', () => {

    class User {
        constructor(username){
            this.username = username;
        }
    }

    let saveUser = async (newUserInfo) => {
        const response = await fetch(SIGNUP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUserInfo),
        });
        const data_2 = await response.json();
        alert("Saved successfullly!");
        location.reload();
        
        }
        
        document.querySelector("button#signup").addEventListener("click", () => {
            
            document.body.innerHTML = ""
            
            let signUpForm = document.createElement("form"); //This will be the form used to signup
            signUpForm.id = "signupform";
            let signUpUsername = document.createElement('input'); //This is the username input field 
            signUpUsername.setAttribute("type", "text");
            signUpUsername.setAttribute("name", "username");
            signUpUsername.setAttribute("placeholder", "username");
            signUpForm.appendChild(signUpUsername);

            let signUpSubmit = document.createElement("input");
            signUpSubmit.setAttribute("type", "submit");
            signUpSubmit.setAttribute("name", "submit");
            signUpForm.appendChild(signUpSubmit);

            document.body.appendChild(signUpForm);

            signUpSubmit.addEventListener("click", (e) => {
                let match = false; //Used to determine if account already exists
                fetch(LOGIN_URL)
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    for (const user of json) {
                        if (signUpUsername.value === user["username"]) {
                            match = true;
                        }
                    }
                    if (match === true){
                        alert("Username already exists! Please enter a unique username");
                        signUpUsername.value = "";
                    }
                    else {
                        let completedUser = new User(); //Completed user 
                        completedUser.username = signUpUsername.value;
                        saveUser(completedUser);
                        
                }
            })
                e.preventDefault();
            }, false);
            
        });
        
        document.querySelector("form#signin").addEventListener("submit", (event) => { //Page where you login
            let usernameInput = document.getElementById("unameinput"); //This is the username input
            fetch(LOGIN_URL)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                let truthyValue = false; //The purpose of this is to determine if the username value is preexisting
                let userID = ""; //This will ultimately be the id associated with the user (assuming user exists)
                if (usernameInput.value !== "") {
                    for (const i of json){
                        if (i.username === usernameInput.value) {
                            userID = i.id;
                            truthyValue = true;
                        }
                    }
                    if (truthyValue === false){
                        alert("Account doesn't exist");
                        usernameInput.value = "";
                }

                    else {
                        decisionPage(userID);
                    }
                
            }
            else {
                alert("Need to input a username");
                usernameInput.value = "";
            }
            });
            
            event.preventDefault();
        }, false);



/*********************************************************************************************************************************************************************/



    
    let decisionPage = (userid) => { //Page where you decide if you want to change an old photo or make a new one
        document.body.innerHTML = "";
        let goAndPaint = document.createElement("button"); //Button that takes you to page where you paint
        goAndPaint.innerHTML = "Start Painting!";
        document.body.appendChild(goAndPaint);
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createElement("br"));
        let seePaintings = document.createElement("button"); //Button that takes you to page where you see/can change old paintings
        seePaintings.innerHTML = "Look at Saved Paintings";
        document.body.appendChild(seePaintings);
        
        
        goAndPaint.addEventListener("click", function() {
            paintPage(userid);   
        });

        seePaintings.addEventListener("click", function(){
            
            fetch(PAINTINGS_URL)
                .then(function(response) {
                return response.json();
                })
            .then(function(json) {
                
                let paintingsAmount = 0; //amount of paintings for user 
                for (const q in json){ 
                    if (json[q]["user_id"] === userid) {
                        paintingsAmount += 1;
                    }
                }
                if (paintingsAmount === 0) {
                    alert("You don't currently have any paintings! Make one and then save to access this page");
                }
                else {
                    allPage(userid, json);
                }
        });
    })
    };


/*********************************************************************************************************************************************************************/


    let allPage = (userid, json) => { //This is for the part where you look at all of your paintings that you've made
        document.body.innerHTML = "";
        const chooseYourPainting = document.createElement('h1'); //This is just the title of the page
        chooseYourPainting.innerHTML = "Your artworks";
        document.body.appendChild(chooseYourPainting);
        document.body.appendChild(document.createElement('br'));
        let yours = []; //This will be an array of the paintings that belong to the current user
        for (const q in json){ 
            if (json[q]["user_id"] === userid) {
                let smallPainting = new Paintings(); //These class objects will be how we recreate the paintings.
                smallPainting.paintingName = json[q]["name"];
                smallPainting.colorData = json[q]["color_data"];
                smallPainting.userID = json[q]["user_id"];
                yours.push(smallPainting);
            }
        } 
        let allEasels = document.createElement('div'); //Div containing all easels
        allEasels.id = "alleasels";
        for(const pnt of yours) {
            let easel = document.createElement('div'); //This will be the space where the painting is within.
            easel.className = "easels";
            
            let paintingTitle = document.createElement('h1'); //The title of the painting
            paintingTitle.innerHTML = pnt.paintingName;
            paintingTitle.innerHTML = paintingTitle.innerHTML.charAt(0).toUpperCase() + paintingTitle.innerHTML.slice(1);
            easel.appendChild(paintingTitle);
            easel.appendChild(document.createElement('br'));

            let unPlacedPainting = pnt.remakePainting(); //This will be the painting that we ultimately put in its position in line
            
            easel.appendChild(unPlacedPainting);
            easel.appendChild(document.createElement('br'));

            

            allEasels.appendChild(easel);
        }

        document.body.appendChild(allEasels);
}



/*********************************************************************************************************************************************************************/


    class Paintings {
        constructor(paintingName, colorData, userID) {
        this.paintingName = null; //The name of the painting that the painter assigns. It defaults to null until you name it.
        this.colorData = colorData; //The array of color positions
        this.userID = userID; //The userID
        }

        addColor(color, position, zIndex) {
            if (color === "red") {
               this.colorData.red.push([position[0], position[1], zIndex]);
            } 
            else if (color === "blue") {
                this.colorData.blue.push([position[0], position[1], zIndex]);
            }
            else if (color === "yellow") {
                this.colorData.yellow.push([position[0], position[1], zIndex]);
            }  
            else {
                this.colorData.eraser.push([position[0], position[1], zIndex]);
            }
        }

        remakePainting() {
            let newPaintArea = document.createElement('div');
            for (const kolor in this.colorData){
                for(const sircle of this.colorData[kolor]) {
                    let teensyCircle = document.createElement('div');
                    teensyCircle.className = "smallcircles";
                    teensyCircle.style.background = kolor;
                    teensyCircle.style.position = "absolute";
                    teensyCircle.style.left = `${sircle[0]/5-20}px`;
                    teensyCircle.style.top = `${sircle[1]/5}px`; 
                    teensyCircle.style.zIndex = `${sircle[2]}`;
                    newPaintArea.appendChild(teensyCircle);
                    newPaintArea.className = "smallpaintareas";
                }
            }
            return newPaintArea;
        }
    }


    let paintPage = (userid) => { //This is for the part where you can actually paint
        
        document.body.innerHTML = "";
        


        let hamburgerMenu = document.createElement('div'); //This will be the hamburger menu that you use to save drawing 
        hamburgerMenu.id = "menu"; 
        for(let i = 0; i < 3; i++){
            let innerDiv = document.createElement('div'); //These are the individual lines of the hamburger menu
            innerDiv.className = "lines";
            hamburgerMenu.appendChild(innerDiv);
            hamburgerMenu.appendChild(document.createElement('br'));
        }
        document.body.appendChild(hamburgerMenu);

        let zIndex = 0; //The z-index of a color circle. The way for the colordata to render the page in the correct way when recreating a painting



        let paintColors = document.createElement('div'); //This is the div of the big circles that you click to change the value of paintBrush (the color of the paint)
        paintColors.className = "paintcolors";

        document.body.appendChild(paintColors);
        
        let redPaint = document.createElement("div"); //The red circle to click
        redPaint.id = "redcircle";
        paintColors.appendChild(redPaint);
        paintColors.appendChild(document.createElement("br"));

        redPaint.addEventListener("click", function(){
            paintBrush = "red";
        });
        
        let bluePaint = document.createElement("div"); //The blue circle to click
        bluePaint.id = "bluecircle";
        paintColors.appendChild(bluePaint);
        paintColors.appendChild(document.createElement("br"));
        
        bluePaint.addEventListener("click", function(){
            paintBrush = "blue";
        });


        let yellowPaint = document.createElement("div"); //The yellow circle to click
        yellowPaint.id = "yellowcircle";
        paintColors.appendChild(yellowPaint); 
        
        yellowPaint.addEventListener("click", function(){
            paintBrush = "yellow";
        });    

        let eraser = document.createElement("img"); //This is the 'eraser.' It paints in white, which matches the color of the background, effectively being an eraser
        eraser.id = "eraser";
        eraser.src = "/home/zach6585/painting-api/frontend/assets/images/eraserreal.jpg";
        paintColors.appendChild(eraser);

        eraser.addEventListener("click", function() {
            paintBrush = "white";
        });


        let paintArea = document.createElement('div'); //The box within which you are restricted to put paint in
        paintArea.id = "paintarea";
        paintArea.style.borderStyle = "solid";
        
        document.body.appendChild(paintArea);

        let paintBrush = ""; //The color of the current paintbrush
        let paintingData = new Paintings(); //This is the current painting information
        paintingData.colorData = {red: [], blue: [], yellow: [], eraser: []};
        paintingData.userID = userid;

        let paintingFunction = (event) => { //This is the function that determines what it means to paint.
            if (paintBrush !== "") {
                if (event.pageX < 1185 && event.pageX > 100 && event.pageY < 935) {
                let paint = document.createElement("div"); //This will be the individual circle of paint
                paintArea.appendChild(paint);
                paint.className = "paintcircles";
                paint.style.background = paintBrush;
                paint.style.position = "absolute";
                paint.style.left = `${event.pageX}px`;
                paint.style.top = `${event.pageY}px`;
                paintingData.addColor(paintBrush, [event.pageX, event.pageY], zIndex);
                zIndex += 1;
            }
        }
        };

        let isMouseDown = false; //This will determine if mouse is down or not so that movemouse only happens when mouse is down

        document.addEventListener('mousedown', (e) => {
                isMouseDown = true;
            });
        document.addEventListener("mouseup", (e) => {
                isMouseDown = false;            
        });
        
        paintArea.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                paintingFunction(e);
            }
        });

        
        let saveStuff = document.createElement('div'); //This is where the save buttons will be put
        saveStuff.id = 'savestuff';
        const saveToAllPaintings = document.createElement('button'); //This is the button that saves to collection of paintings
        saveToAllPaintings.innerHTML = "Save to All Paintings";
        saveToAllPaintings.id = "saveall";
        
        
        
        saveStuff.appendChild(saveToAllPaintings);
        saveStuff.appendChild(document.createElement('br'));
        
        
        
        let saveName = document.createElement('TEXTAREA'); //This is the box where the user will input the name of the painting
        saveName.id = "savename";
        saveName.placeholder = "Name your Painting!";
        let nameLabel = document.createElement('label'); //Label for text area
        nameLabel.id = "nmlbl";
        nameLabel.innerHTML = "Painting Name";
        if (paintingData.paintingName === null){
            saveStuff.appendChild(nameLabel);
            saveStuff.appendChild(saveName);
        }
        saveStuff.style.display = "none";
        document.body.appendChild(saveStuff);
        
        
        let currentState = false; //This will determine whether or not the hamburger menu had been clicked
        hamburgerMenu.addEventListener('click', function(){ //This brings up and gets rid of the save buttons
            if (currentState === false){
            paintArea.style.opacity = "0.3";
            paintColors.style.opacity = "0.3";
            currentState = true;
            saveStuff.style.display = "block";
            }
            else {
                paintArea.style.opacity = "1";
                paintColors.style.opacity = "1";
                currentState = false;
                saveStuff.style.display = "none";
            }
        });
        

        
        


        saveToAllPaintings.addEventListener('click', function(){
            if (saveName.value === "") {
                alert("Can't save without a name!");
            }
            else {
                if (paintingData.colorData["red"].length === 0 && paintingData.colorData["blue"].length === 0 && paintingData.colorData["yellow"].length === 0) {
                    alert("Can't submit an empty painting!");
                }
                else {
                    paintingData.paintingName = saveName.value;
                    saveTA(paintingData); 
                    decisionPage(paintingData.userID);
                    }
            }
            });

        let saveTA = async (data) => {
            const response = await fetch(PAINTINGS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const data_1 = await response.json();
            alert("Saved successfullly!");
            decisionPage(userid);
        };

          
          


        
    };






/*********************************************************************************************************************************************************************/

    
    
});


