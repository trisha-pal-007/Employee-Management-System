namespace EmployeeManagementSystemAPI.DTOs
{
    public class UpdateDepartmentDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int Id { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
