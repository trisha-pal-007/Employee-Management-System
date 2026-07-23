using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;
        public DepartmentRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Department>> GetAllAsync()
            => await _context.Departments.Include(d => d.Employees).ToListAsync();

        public async Task<Department?> GetByIdAsync(int id)
            => await _context.Departments.Include(d => d.Employees).FirstOrDefaultAsync(d => d.Id == id);

        public async Task<Department> AddAsync(CreateDepartmentDto dto)
        {
            var dept = new Department
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };
            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();
            return dept;
        }

        public async Task<bool> UpdateAsync(UpdateDepartmentDto dto)
        {
            var dept = await _context.Departments.FindAsync(dto.Id);
            if (dept == null) return false;

            dept.Name = dto.Name;
            dept.Description = dto.Description;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }

  
}
