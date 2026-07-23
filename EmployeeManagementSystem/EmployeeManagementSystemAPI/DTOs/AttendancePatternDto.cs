namespace EmployeeManagementSystemAPI.DTOs
{
    public class AttendancePatternDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Status { get; set; }
        public int Count { get; set; }
    }

}
