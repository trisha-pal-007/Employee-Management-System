using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystemAPI.DTOs
{
    public class CreateDepartmentDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
