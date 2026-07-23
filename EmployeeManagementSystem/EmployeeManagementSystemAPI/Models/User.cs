using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystemAPI.Models;

public partial class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
