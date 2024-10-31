"use strict";

let currentUser =JSON.parse(localStorage.getItem("User"))|| {};

//dom elements
let headerUserNameEl  = document.querySelector(".user");
let balanceEl  = document.querySelector(".ammount");



async function getAccountByUserId(userId)
{
    try
    {
        let accResponse =await fetch(`http://localhost:5104/api/Accounts/UserId?UserId=${userId}`);

        if(!accResponse.ok)
            {
                throw new Error(`${accResponse.statusText}`);
            }
        
        let accData = await accResponse.json();
        return accData;
    }
    catch(err)
    {

    }

    return null;
}

async function getBalanceByAccountId(accountId)
{
    try
    {
        let balanceResponse = await fetch(`http://localhost:5104/api/Transactions/GetBalance?AccountId=${accountId}`);

        if(!balanceResponse.ok)
            {
                throw new Error(`${balanceResponse.statusText}`);
            }
        
        let balanceData =await balanceResponse.json();
        return balanceData;
    }
    catch(err)
    {

    }

    return null;
}

let currentAccount = await getAccountByUserId(currentUser.userId);


function formatMoney(ammount)
{
    return ammount.toFixed(2);
}

function updateBalance()
{
    getBalanceByAccountId(currentAccount.accountId).then(function(res){
        balanceEl.textContent =formatMoney(res);
    });
}

function updateUserFirstName()
{
    headerUserNameEl.textContent = currentUser.firstName;
}

function loadHeadersData()
{
    updateBalance();
    updateUserFirstName();
}

loadHeadersData();
