using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystemAPI.DTOs
{
    public class CreateEmployeeDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int DepartmentId { get; set; }

        [Required]
        public string Position { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }

        [Required]
        public DateTime HireDate { get; set; }
    }

}
