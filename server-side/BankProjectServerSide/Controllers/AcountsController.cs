using BankProjectBusinessLayer;
using BankProjectDataAccessLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BankProjectServerSide.Controllers
{
    [Route("api/Accounts")]
    [ApiController]
    public class AcountsController : ControllerBase
    {
        [HttpGet("{AccountId}",Name ="GetAccountById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccountDTO> FindAccountById(int AccountId)
        {
            if (AccountId <= 0) 
            {
                return BadRequest("invalid entered data");
            }

            clsAccount AccountToFind = clsAccount.FindAccountById(AccountId);
            if (AccountToFind == null)
            {
                return NotFound($"the account with id : {AccountId} is not found!");
            }
            else
            return Ok(AccountToFind.AccDto);
        }

        [HttpGet("UserId", Name = "GetAccountByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<clsAccount> FindAccountByUserId(int UserId)
        {
            if (UserId <= 0)
            {
                return BadRequest("invalid entered data");
            }

            clsAccount AccountToFind = clsAccount.FindAccountByUserId(UserId);
            if (AccountToFind == null)
            {
                return NotFound($"the account with id : {UserId} is not found!");
            }
            else
                return Ok(AccountToFind);
        }

        [HttpPost(Name ="AddNewAccount")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccountDTO> AddNewAccount(AccountDTO account) 
        {
            if(account.UserId <=0 || account == null)
            {
                return BadRequest("invalid entered data");
            }

            clsAccount NewAccount = new clsAccount(new AccountDTO(account.AccountId, account.UserId, account.CreationDate));


            if (NewAccount.AddNewAccount())
            {
                account.AccountId = NewAccount.AccountId;
                return CreatedAtRoute("GetAccountById", new { AccountId = account.AccountId }, account);
            }
            else
            {
                return StatusCode(500, "internal server error");
            }
        }

        [HttpDelete("{UserId}",Name ="DeleteAccount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeleteAccountByUserId(int UserId)
        {
            if (UserId <= 0 ||UserId == null)
            {
                return BadRequest("invalid entered data");
            }

            //find the account to delete
            clsAccount AccountToDelete = clsAccount.FindAccountByUserId(UserId);

            if(AccountToDelete == null)
            {
                return NotFound($"the account with userid {UserId} is not found ");
            }

            if(clsAccount.DeleteAccountByUserId(UserId))
            {
                return Ok($"the account that belongs to the user N° {UserId} has been deleted successfully");
            }
            else
            {
                return StatusCode(500, "internal server error");
            }
        }
    }
}
