using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;

namespace EmployeeManagementSystemAPI.Services
{
    public class DepartmentService
    {
        private readonly IDepartmentRepository _repo;
        public DepartmentService(IDepartmentRepository repo) => _repo = repo;

        public Task<IEnumerable<Department>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Department?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<Department> AddAsync(CreateDepartmentDto dto) => _repo.AddAsync(dto);
        public Task<bool> UpdateAsync(UpdateDepartmentDto dto) => _repo.UpdateAsync(dto);
        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}
