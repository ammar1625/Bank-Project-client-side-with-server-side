using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;


namespace BankProjectDataAccessLayer
{
    public class AccountDTO
    {
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public DateTime CreationDate { get; set; }

        public AccountDTO(int accountId, int userId, DateTime creationDate)
        {
            this.AccountId = accountId;
            this.UserId = userId;
            this.CreationDate = creationDate;
        }
    }
    public class clsAccountData
    {
        public static AccountDTO GetAccountById(int? accountId)
        {
            AccountDTO Account = null;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetAccountById",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@AccountId",accountId);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader()) 
                        {
                            if (Reader.Read())
                            {
                                Account= new AccountDTO
                                    (
                                     Reader.GetInt32(Reader.GetOrdinal("AccountId")),
                                     Reader.GetInt32(Reader.GetOrdinal("UserId")),
                                     Reader.GetDateTime(Reader.GetOrdinal("CreationDate"))
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
            }

            return Account;
        }

        public static AccountDTO GetAccountByUserId(int UserId)
        {
            AccountDTO Account = null;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetAccountByUserId", Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@UserId", UserId);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            if (Reader.Read())
                            {
                                Account = new AccountDTO
                                    (
                                     Reader.GetInt32(Reader.GetOrdinal("AccountId")),
                                     Reader.GetInt32(Reader.GetOrdinal("UserId")),
                                     Reader.GetDateTime(Reader.GetOrdinal("CreationDate"))
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

            return Account;
        }

        public static int AddNewAccount(AccountDTO Account)
        {
            int NewAccId = -1;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_AddNewAccount",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@UserId", Account.UserId);

                    var OutPutParam = new SqlParameter("@NewAccountId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Command.Parameters.Add(OutPutParam);

                    Connection.Open();

                    try
                    {
                        object Result = Command.ExecuteNonQuery();

                        if (Result != null && int.TryParse(Result.ToString() , out int AffectedRows))
                        {
                            if (AffectedRows > 0)
                            {
                                NewAccId = (int)OutPutParam.Value;
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

            return NewAccId;
        }

        public static bool DeleteAccountByUserId(int UserId)
        {
            int DeletedItems = 0;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_DeleteAccount",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@UserId", UserId);

                    Connection.Open() ;

                    try
                    {
                        object Result = Command.ExecuteNonQuery();
                        
                        if(Result != null && int.TryParse(Result.ToString(), out int AffectedRows))
                        {
                            DeletedItems = AffectedRows;
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

            return (DeletedItems > 0);
        }
    }
}
