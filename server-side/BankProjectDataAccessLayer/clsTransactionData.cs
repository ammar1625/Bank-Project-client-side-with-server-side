using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
     

namespace BankProjectDataAccessLayer
{
    public class TransactionDTO
    {
        public int TransactionId { get; set; }
        public int? FromAccountId { get; set; }
        public int? ToAccountId { get; set; }

        public decimal TransactionAmmount { get; set; }

        public DateTime TransactionDate {  get; set; }

        public TransactionDTO(int TransactionId , int? FromAccountId , int? ToAccountId , decimal TransactionAmmount,
            DateTime TransactionDate) 
        {
            this.TransactionId = TransactionId;
            this.FromAccountId = FromAccountId;
            this.ToAccountId = ToAccountId;
            this.TransactionAmmount = TransactionAmmount;
            this.TransactionDate = TransactionDate;
        }
    }
    public class clsTransactionData
    {
        public static TransactionDTO GetTransactionById(int TransactionId)
        {
            TransactionDTO Transaction = null;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetTransactionById", Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@TransactionId", TransactionId);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            int? AccountFrom;
                            int? AccountTo;

                            if (Reader.Read())
                            {

                                if (Reader["FromAccountId"] == DBNull.Value)
                                {
                                    AccountFrom = null;
                                }
                                else
                                {
                                    AccountFrom = Reader.GetInt32(Reader.GetOrdinal("FromAccountId"));
                                }

                                if (Reader["ToAccountId"] == DBNull.Value)
                                {
                                    AccountTo = null;
                                }
                                else
                                {
                                    AccountTo = Reader.GetInt32(Reader.GetOrdinal("ToAccountId"));
                                }
                                Transaction = new TransactionDTO
                                    (
                                      Reader.GetInt32(Reader.GetOrdinal("TransactionId")),
                                      AccountFrom,
                                      AccountTo,
                                      Reader.GetDecimal(Reader.GetOrdinal("TransactionAmmount")),
                                      Reader.GetDateTime(Reader.GetOrdinal("Transactiondate"))
                                    );
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    finally
                    {
                        Connection.Close();
                    }
                }
            }

            return Transaction;
        }

        public static int AddNewTransction(TransactionDTO transactiondto)
        {
            int TransactionId = -1;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_AddNewTransaction", Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    if (transactiondto.FromAccountId == null)
                    {
                        Command.Parameters.AddWithValue("@fromAccountId", DBNull.Value);
                    }
                    else
                    {
                        Command.Parameters.AddWithValue("@fromAccountId", transactiondto.FromAccountId);
                    }

                    if (transactiondto.ToAccountId == null)
                    {
                        Command.Parameters.AddWithValue("@ToAccountId", DBNull.Value);
                    }
                    else
                    {
                        Command.Parameters.AddWithValue("@ToAccountId", transactiondto.ToAccountId);
                    }


                    Command.Parameters.AddWithValue("@TransactionAmmount", transactiondto.TransactionAmmount);

                    var OutputParam = new SqlParameter("@NewTransactionId", DbType.Int32)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Command.Parameters.Add(OutputParam);

                    Connection.Open();

                    try
                    {
                        object Result = Command.ExecuteNonQuery();

                        if (Result != null && int.TryParse(Result.ToString(), out int Rows))
                        {
                            if (Rows > 0)
                            {
                                TransactionId = (int)OutputParam.Value;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    finally
                    {
                        Connection.Close();
                    }
                }
            }

            return TransactionId;
        }

        public static decimal GetBalanceByAccountId(int AccountId)
        {
            decimal Balance = 0.00m;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetBalancePerAccount",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@AccountId", AccountId);

                    Connection.Open();

                    try
                    {
                        object Result  = Command.ExecuteScalar();

                        if(Result != null && decimal.TryParse(Result.ToString(), out decimal Value))
                        {
                            Balance = Value;
                        }
                    }
                    catch (Exception ex) 
                    {
                    }
                    finally 
                    {
                        Connection.Close();
                    }
                }
            }

            return Balance;
        }

        public static List<TransactionDTO>GetDepositsAndWithdrawsByAccountId(int AccountId)
        {
            List<TransactionDTO> TransactionsList = new List<TransactionDTO>();
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetDepositsAndWithdrawsPerAccount",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@AccountId", AccountId);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            int? FromAcc;
                            int? ToAcc;

                            while (Reader.Read())
                            {
                                if (Reader["FromAccountId"]==DBNull.Value)
                                {
                                    FromAcc = null;
                                }
                                else
                                {
                                    FromAcc = Reader.GetInt32(Reader.GetOrdinal("FromAccountId"));
                                }

                                if (Reader["ToAccountId"] == DBNull.Value)
                                {
                                    ToAcc = null;
                                }
                                else
                                {
                                    ToAcc = Reader.GetInt32(Reader.GetOrdinal("ToAccountId"));
                                }
                                TransactionsList.Add(new TransactionDTO
                                    (
                                      Reader.GetInt32(Reader.GetOrdinal("TransactionId")),
                                      FromAcc,
                                      ToAcc,
                                      Reader.GetDecimal(Reader.GetOrdinal("TransactionAmmount")),
                                      Reader.GetDateTime(Reader.GetOrdinal("TransactionDate"))
                                    )
                                    );
                            }
                        }

                    }
                    catch(Exception ex) 
                    {
                    }
                    finally
                    { 
                        Connection.Close();
                    }
                }

                return TransactionsList;
            }
        }

        public static List<TransactionDTO> GetTransfersByAccountId(int AccountId)
        {
            List<TransactionDTO> TransactionsList = new List<TransactionDTO>();
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString)) 
            {
                using(SqlCommand Command = new SqlCommand("SP_GetTransactionsPerAccount",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@AccountId", AccountId);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {


                            while (Reader.Read())
                            {

                                TransactionsList.Add(new TransactionDTO
                                    (
                                      Reader.GetInt32(Reader.GetOrdinal("TransactionId")),
                                      Reader.GetInt32(Reader.GetOrdinal("FromAccountId")),
                                      Reader.GetInt32(Reader.GetOrdinal("ToAccountId")),
                                      Reader.GetDecimal(Reader.GetOrdinal("TransactionAmmount")),
                                      Reader.GetDateTime(Reader.GetOrdinal("TransactionDate"))
                                    )
                                    );
                            }
                        }
                    }
                    catch (Exception ex) 
                    {
                    }
                    finally
                    {
                        Connection.Close(); 
                    }
                }
            }

            return TransactionsList;
        }
    }
}
