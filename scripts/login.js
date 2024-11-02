"use strict";


//Dom Elements
 let SignUpLinkEl = document.querySelector(".link");
let LogInEmailInputEl = document.querySelector(".e-mail-input");
let LogInPassWordInputEl = document.querySelector(".password-input");
let LogInBtnEl = document.querySelector(".log-in-btn");
let ErrorMsgCtr = document.querySelector(".error-ctr");
let LogInErrorMessageEl = document.querySelector(".error-msg");

let LogInOverLayEl = document.querySelector(".overlay");
let OpenAccountFormEl = document.querySelector('.open-account-model');

let FirstNameInputEl = document.querySelector('.f-name');
let LastNameInputEl = document.querySelector('.l-name');
let SignUpEmailInputEl = document.querySelector('.e-mail');
let PhoneInputEl = document.querySelector('.phone');
let BirthDateInPutEl = document.querySelector('.birth-date');
let UserNameInPutEl = document.querySelector('.user-name');
let PassWordInPutEl = document.querySelector('.password');
let ComfirmPassWordInPutEl = document.querySelector('.comfirm-password');
let SubmitBtnEl = document.querySelector(".submit");
let ErrorMessageEl = document.querySelector(".empty-field-error");
let CloseBtnEl = document.querySelector(".close-btn");
let MessageBoxEl = document.querySelector(".comfirm-msg");
let ComfirmMEssageEl = document.querySelector(".message");
let YesBtnEl = document.querySelector(".yes");
let NoBtnEl = document.querySelector(".no");

let FieldsEl = document.querySelectorAll(".input-field");


//User Class
 class clsUser
{
     UserId 
     FirstName 
     LastName 
     UserName 
     Password 
     Email 
     Phone 
     BirthDate 

   constructor( UserId,  FirstName,  LastName,  UserName,  PassWord,  Email,
         Phone,  BirthDate)
    {
        this.UserId = UserId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.UserName = UserName;
        this.Password = PassWord;
        this.Email = Email;
        this.Phone = Phone;
        this.BirthDate = BirthDate;
    }
}

//Account Class
 class clsAccount
{
      AccountId 
      UserId 
      CreationDate 

     constructor(accountId, userId,creationDate)
    {
        this.AccountId = accountId;
        this.UserId = userId;
        this.CreationDate = creationDate;
    }
}

 let CurrentUser  ;

 

let CurrentDate = new Date();

function saveToLocalStorage(key, value)
{
    localStorage.setItem(key,JSON.stringify(value));
}

 function showOpenAccountForm()
{
    SignUpLinkEl.addEventListener("click",(e)=>{
    e.preventDefault();
    LogInOverLayEl.classList.remove("hidden");
    OpenAccountFormEl.classList.remove("hidden");
    })
}

function ShowWronLoginInfosMsg()
{
    ErrorMsgCtr.classList.remove("hidden");
}

function hideWrongLoginInfoMsg()
{
    ErrorMsgCtr.classList.add("hidden");
}

function hideOpenAccountForm()
{
    CloseBtnEl.addEventListener("click",()=>{
        LogInOverLayEl.classList.add("hidden");
        OpenAccountFormEl.classList.add("hidden");
        clearFields();
    })
}
function SetBirthDateLimits()
{
    BirthDateInPutEl.max = `${CurrentDate.getFullYear()-18}-12-31`;
} 

function changeInputBackGround(field)
{
    field.style.backgroundColor = "rgba(220, 20, 60, 0.351)";
    field.style.border = "solid 1px red"
}

function ResetLoginInputsBackGround(emailInput, passwordInput)
{
    emailInput.style.backgroundColor = "aliceblue";
    passwordInput.style.backgroundColor = "aliceblue";
    emailInput.style.border = "solid 1px gray";
    passwordInput.style.border = "solid 1px gray";
}

function resetInputBackGround()
{
    FieldsEl.forEach((field)=>{
        if(field.value)
         {
            field.style.backgroundColor = "aliceblue"; 
             field.style.border = "solid 1px gray"
         }
           
     })
   

}


function CheckFieldsEmpty()
{
    let isEmpty = false;
    FieldsEl.forEach((field)=>{
       if(!field.value)
        {
            changeInputBackGround(field);
           isEmpty =  true; 
        }
          
    })

        return isEmpty;
}

function ShowErrorMessage(message="you must fill all the fields !")
{
    ErrorMessageEl.textContent = message;
    ErrorMessageEl.classList.remove("hidden");
}

function hideErrorMessage()
{
    ErrorMessageEl.classList.add("hidden");
}

function changeInputValueColor(field)
{
    field.style.color = "red";
}

function resetInputValueColor(field)
{
    field.style.color = "#313030";
}

async function isUserNameAlreadyExists(userName)
{
    try
    {
        let response = await fetch(`http://localhost:5104/api/Users/IsUserExistsByUserName?UserName=${userName}`);

        if(!response.ok)
            {
                throw new Error(`${response.statusText}`);
            }

        let data = await response.json();
        return data;
    }
    catch(err)
    {
    }
    return null;
}

async function IsEmailExists(email)
{
    try
    {
        let response =await fetch(`http://localhost:5104/api/Users/ExistsByEmail?Email=${email}`);

        if(!response.ok)
            {
                throw new Error(`${response.statusText}`);
            }

        let data = await response.json();
        return data;
    }
    catch(err)
    {

    }
    return null;
}

function ValidateEmailField()
{
    SignUpEmailInputEl.addEventListener("input",()=>{
        IsEmailExists(SignUpEmailInputEl.value).then(function(res){
             
            
            if(res)
                {
                    changeInputValueColor(SignUpEmailInputEl);
                    changeInputBackGround(SignUpEmailInputEl);
                    ShowErrorMessage("Email arlready taken by an other user");
                    changeElementEnabledStatus(SubmitBtnEl, true);
                   

                }
                else
                {
                    hideErrorMessage();
                    resetInputBackGround(SignUpEmailInputEl);
                    resetInputValueColor(SignUpEmailInputEl); 
                    changeElementEnabledStatus(SubmitBtnEl,false);
                }
                
        })
    });
}

function changeElementEnabledStatus(el , status)
{
    el.disabled = status;
    if(status)
        {
            el.style.opacity = '0.5';
        }
        else
        el.style.opacity = '1';
}

async function AddNewUser(newUser)
{
    try
    {
        let response = await fetch(`http://localhost:5104/api/Users`, 
            {
                method : "post",
                headers : {
                    'Content-type':'application/json'
                },
                body: JSON.stringify(newUser)
            });

        if(!response.ok)
            {
                throw new Error(`${response.statusText}`);
            }

        let data = await response.json();
        return data;
    }
    catch(err)
    {
        console.log(err);
    }

    return null;
}

async function AddNewAccount(newAccount)
{
    try
    {
        let response = await fetch(`http://localhost:5104/api/Accounts`, 
            {
                method : "post",
                headers : {
                    'Content-type':'application/json'
                },
                body: JSON.stringify(newAccount)
            });

            if(!response.ok)
                {
                    throw new Error(`${response.statusText}`);
                }

            let data = await response.json();
            return data;
    }
    catch(err)
    {

    }

    return null;
}

function displayMessageBox()
{
    MessageBoxEl.classList.remove("hidden");
}

function closeMessageBox()
{
   setTimeout(()=>{
        MessageBoxEl.classList.add("hidden");
   },2500);
}

function resetComFirmMessageText()
{
    ComfirmMEssageEl.textContent = 'do you want to perform this acction?';
}

function ShowUserAddedMessage(message)
{
    ComfirmMEssageEl.textContent = message;
}

function clearFields()
{
    FieldsEl.forEach(field =>{
        field.value = '';
    });
}
function PerformSubmit()
{

    SubmitBtnEl.addEventListener("click",()=>{
        if(CheckFieldsEmpty())
            {
                ShowErrorMessage();
                resetInputBackGround();
            }
            else
            {
                resetInputBackGround();
                hideErrorMessage();
                let User  = new clsUser(0 , FirstNameInputEl.value , LastNameInputEl.value, UserNameInPutEl.value,
                   PassWordInPutEl.value , SignUpEmailInputEl.value , PhoneInputEl.value , BirthDateInPutEl.value) 
                if(ComfirmPassWordInPutEl.value != PassWordInPutEl.value)
                    {
                        ShowErrorMessage("Wrong Comfirmed password");
                    }
                    else
                    {
                        //display comfirm message
                        displayMessageBox();

                        //listen to yes button
                        YesBtnEl.addEventListener("click",function(){
                            //fetch posyt api
                            AddNewUser(User)
                            .then(function(userres){
                                setTimeout(()=>{
                                    //fetch add new account after adding user
                                    AddNewAccount(new clsAccount(0,userres.userId,  new Date("2020/01/01"))).then(function(accountres){
                                        ShowUserAddedMessage(`User Addded Successfully user id : ${userres.userId} - account id : ${accountres.accountId}`);

                                    });
                                },1000)
                                
                                
                             });
    
                             hideErrorMessage();
                             closeMessageBox();
                             clearFields();
                             setTimeout(()=>{
                                CloseBtnEl.click();
                             },2600);
                        });

                        //listen to no button
                        NoBtnEl.addEventListener("click",()=>{
                            ShowUserAddedMessage(`operation has been canceled`);
                            closeMessageBox();
                        });
                        
                        resetComFirmMessageText();
                    }
               
            }
    });
}
function ValidateUserNameInput()
{

    UserNameInPutEl.addEventListener("input",function(){
        if(!UserNameInPutEl.value)
            return;
        isUserNameAlreadyExists(UserNameInPutEl.value).then(function(res){
                if(res)
                {
                
                    ShowErrorMessage("User name Already exists");
                    changeInputBackGround(UserNameInPutEl);
                    changeInputValueColor(UserNameInPutEl);
                    changeElementEnabledStatus(SubmitBtnEl, true);
                }
                else
                {
                        hideErrorMessage();
                        resetInputBackGround(UserNameInPutEl);
                        resetInputValueColor(UserNameInPutEl); 
                        changeElementEnabledStatus(SubmitBtnEl,false);
                }
        })
    })
}

async function HasPermissionToLogIn(email,password)
{
    try
    {
        let UserLogInresponse = await fetch(`http://localhost:5104/api/Users/${email},${password}`);

        if(!UserLogInresponse.ok)
            {
                throw new Error(`${UserLogInresponse.statusText}`);
            }

        let data = UserLogInresponse.json();

        return data;
    }
    catch(err)
    {

    }

    return null;
}

async function GetCurrentUser(email,password)
{
    try
    {
        let userResponse = await
         fetch(`http://localhost:5104/api/Users/FindUserByEmailPassWord?Email=${email}&PassWord=${password}`);

         if(!userResponse.ok)
            {
                throw new Error(`${userResponse.statusText}`);
            }

        let userData =await userResponse.json();

        return userData;
    }
    catch(err)
    {

    }

    return null;
}

function PerformLogin()
{
    LogInBtnEl.addEventListener("click",()=>{

        //if the log in fields are both empty show error message and return
        if(!LogInEmailInputEl.value || !LogInPassWordInputEl.value)
            {
                LogInErrorMessageEl.textContent = "❌ all the fields above are required !";
                ShowWronLoginInfosMsg();
                changeInputBackGround(LogInEmailInputEl);
                changeInputBackGround(LogInPassWordInputEl);
                return;
            }
           
        HasPermissionToLogIn(LogInEmailInputEl.value , LogInPassWordInputEl.value).then(function(loginRes){
        
        
            if(loginRes)
                {
                    ResetLoginInputsBackGround(LogInEmailInputEl,LogInPassWordInputEl);
                    hideWrongLoginInfoMsg();
    
                    setTimeout(()=>{
                        GetCurrentUser(LogInEmailInputEl.value,LogInPassWordInputEl.value).then(function(currentUserRes){
                        CurrentUser = currentUserRes;
                        saveToLocalStorage("User", CurrentUser);
                        LogInEmailInputEl.value = "";
                        LogInPassWordInputEl.value ="";
                        location.href= "http://127.0.0.1:5500/home.html";
                       /*  window.open("http://127.0.0.1:5500/home.html","_blank"); */
                        });
                    },3000)
                }
                else
                {
                
                    LogInErrorMessageEl.textContent = "❌ wrong e-mail/password please try again";
                    ShowWronLoginInfosMsg();
    
                    changeInputBackGround(LogInEmailInputEl);
                    changeInputBackGround(LogInPassWordInputEl);
    
                }
        });
    
    });

}

SetBirthDateLimits();
showOpenAccountForm();
hideOpenAccountForm();

ValidateUserNameInput();
ValidateEmailField();
PerformSubmit();
PerformLogin();








