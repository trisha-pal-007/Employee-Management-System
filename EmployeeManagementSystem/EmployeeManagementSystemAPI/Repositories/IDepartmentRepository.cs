using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;

namespace EmployeeManagementSystemAPI.Repositories
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task<Department> AddAsync(CreateDepartmentDto dto);
        Task<bool> UpdateAsync(UpdateDepartmentDto dto);
        Task<bool> DeleteAsync(int id);

        Task<IEnumerable<DepartmentGrowthDto>> GetDepartmentGrowthAsync();
    }

}
