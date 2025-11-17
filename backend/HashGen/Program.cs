using System;
using BCrypt.Net;

class HashGen
{
    static void Main()
    {
        string password = "AMATERASu5050@#";
        string hashed = BCrypt.Net.BCrypt.HashPassword(password);
        Console.WriteLine("Hashed password:\n" + hashed);
    }
}
