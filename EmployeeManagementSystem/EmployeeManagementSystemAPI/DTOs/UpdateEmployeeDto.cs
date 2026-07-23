namespace EmployeeManagementSystemAPI.DTOs
{
    public class UpdateEmployeeDto : CreateEmployeeDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int Id { get; set; }
    }
}
