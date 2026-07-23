using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;

namespace EmployeeManagementSystemAPI.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repo;
        public EmployeeService(IEmployeeRepository repo) => _repo = repo;

        public Task<IEnumerable<Employee>> GetAllAsync(string? department = null, string? search = null)
            => _repo.GetAllAsync(department, search);

        public Task<Employee?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<Employee> AddAsync(CreateEmployeeDto dto) => _repo.AddAsync(dto);
        public Task<bool> UpdateAsync(UpdateEmployeeDto dto) => _repo.UpdateAsync(dto);
        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

        public Task<IEnumerable<Employee>> BulkAddAsync(List<CreateEmployeeDto> dtos)
            => _repo.BulkAddAsync(dtos);

        public Task BulkDeleteAsync(List<int> ids)
            => _repo.BulkDeleteAsync(ids);
    }


}
