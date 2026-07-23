using System;

class Program
{
    static void Main()
    {
        string plainPassword = "riya@123"; 
        string hash = BCrypt.Net.BCrypt.HashPassword(plainPassword);
        Console.WriteLine("BCrypt hash: " + hash);
    }
}
