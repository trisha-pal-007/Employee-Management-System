using System;
using System.Collections.Generic;

namespace EmployeeManagementSystemAPI.Models;

public partial class Salary
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public decimal BaseSalary { get; set; }

    public decimal Bonus { get; set; }

    public decimal Deductions { get; set; }

    public DateOnly EffectiveDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Employee Employee { get; set; } = null!;
}
