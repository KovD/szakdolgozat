using Microsoft.Data.Sqlite;
using System;

namespace server.Services;

public class SqliteService
{
	private readonly string _connectionString = "Data Source=Database.db";

	public SqliteService()
	{
        Console.WriteLine("SqliteService instance created.");
        InitializeDatabase();
	}

	public void InitializeDatabase()
	{
		using (var connection = new SqliteConnection(_connectionString))
		{
			connection.Open();

			var command = connection.CreateCommand();
			command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Users (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserName TEXT NOT NULL UNIQUE,
                    Password TEXT NOT NULL
                );";

			command.ExecuteNonQuery();
			Console.WriteLine("Database and table created successfully (if not already existing).");
		}
	}
}
