using BankProjectBusinessLayer;
using BankProjectDataAccessLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace BankProjectServerSide.Controllers
{
    [Route("api/Transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        [HttpGet("{transactionId}",Name ="GetTransactionByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<TransactionDTO>GetTransactionById(int transactionId)
        {
            if (transactionId <=0) 
            {
                return BadRequest($"Invalid entered data");
            }

            clsTransaction FoundTransaction = clsTransaction.GetTransactionById(transactionId);
            if (FoundTransaction == null) 
            {
                return NotFound($"the transaction with id {transactionId} is not found");
            }

            return Ok(FoundTransaction.Transactiondto);
        }

        [HttpPost(Name ="AddNewTransaction")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<clsTransaction> AddNewTransaction(TransactionDTO transactiondto) 
        {
            if(transactiondto == null || transactiondto.TransactionAmmount <=0 ||
                (transactiondto.FromAccountId == null && transactiondto.ToAccountId==null))
            {
                return BadRequest("Invalid entered data");
            }

            clsTransaction NewTransaction = new clsTransaction(new TransactionDTO(transactiondto.TransactionId,transactiondto.FromAccountId,transactiondto.ToAccountId,transactiondto.TransactionAmmount,transactiondto.TransactionDate));

            if(NewTransaction.AddNewTransaction())
            {
                transactiondto.TransactionId = NewTransaction.TransactionId;

                return CreatedAtRoute("GetTransactionById", new { transactionId  = transactiondto.TransactionId}, NewTransaction);
            }
            else
            {
                return StatusCode(500, "internal server error");
            }

        }


        [HttpGet("GetBalance",Name ="GetBalancePerAccount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        
        public ActionResult<decimal> GetBalanceByAccountId(int AccountId)
        {
            if(AccountId <=0)
            {
                return BadRequest("invalid entered data");
            }

            decimal Balance = clsTransaction.GetBalanceByAccountId(AccountId);

            return Ok(Balance);

        }

        [HttpGet("GetDepositsAndWithdraws",Name ="DepositsWithdraws")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<clsTransaction> GetDepositsAndWithdrawsByAccountId(int AccountId) 
        {
            if (AccountId <= 0)
            {
                return BadRequest("invalid entered data");
            }
            List<clsTransaction> Transactions = clsTransaction.GetDepositsAndWithdrawsByAccountId(AccountId);
            return Ok(Transactions);
        }


        [HttpGet("GetTransfers", Name = "Transfers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<clsTransaction> GetTransfersByAccountId(int AccountId)
        {
            if (AccountId <= 0)
            {
                return BadRequest("invalid entered data");
            }
            List<clsTransaction> Transfers = clsTransaction.GetTransfersByAccountId(AccountId);
            return Ok(Transfers);
        }
    }
}
