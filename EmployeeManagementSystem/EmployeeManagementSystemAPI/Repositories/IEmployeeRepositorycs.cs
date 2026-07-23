using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;

namespace EmployeeManagementSystemAPI.Repositories
{
    public interface IEmployeeRepository
    {
        // Single operations
        Task<IEnumerable<Employee>> GetAllAsync(string? department = null, string? search = null);
        Task<Employee?> GetByIdAsync(int id);
        Task<Employee> AddAsync(CreateEmployeeDto dto);
        Task<bool> UpdateAsync(UpdateEmployeeDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<HiringTrendDto>> GetHiringTrendsAsync();
        Task<IEnumerable<PerformanceMetricDto>> GetPerformanceMetricsAsync();

        // Bulk operations
        Task<IEnumerable<Employee>> BulkAddAsync(List<CreateEmployeeDto> dtos);
        Task BulkDeleteAsync(List<int> ids);
    }
}
