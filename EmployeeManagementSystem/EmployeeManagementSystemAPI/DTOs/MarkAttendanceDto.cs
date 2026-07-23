using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystemAPI.DTOs
{
    public class MarkAttendanceDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int EmployeeId { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        public TimeOnly? CheckIn { get; set; }
        public TimeOnly? CheckOut { get; set; }

        [Required]
        public string Status { get; set; } = "Present";
    }

}
