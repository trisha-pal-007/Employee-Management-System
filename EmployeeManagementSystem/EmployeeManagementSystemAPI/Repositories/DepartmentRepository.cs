using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DepartmentRepository> _logger;
        public DepartmentRepository(AppDbContext context, ILogger<DepartmentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            try
            {
                return await _context.Departments.Include(d => d.Employees).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching departments");
                throw new Exception("An error occurred while fetching departments.", ex);
            }
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Departments.Include(d => d.Employees).FirstOrDefaultAsync(d => d.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching department by id {Id}", id);
                throw new Exception("An error occurred while fetching the department.", ex);
            }
        }

        public async Task<Department> AddAsync(CreateDepartmentDto dto)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding department {@Dto}", dto);
                throw new Exception("An error occurred while adding the department.", ex);
            }
        }

        public async Task<bool> UpdateAsync(UpdateDepartmentDto dto)
        {
            try
            {
                var dept = await _context.Departments.FindAsync(dto.Id);
                if (dept == null) return false;

                dept.Name = dto.Name;
                dept.Description = dto.Description;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating department {@Dto}", dto);
                throw new Exception("An error occurred while updating the department.", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var dept = await _context.Departments.FindAsync(id);
                if (dept == null) return false;

                _context.Departments.Remove(dept);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting department {Id}", id);
                throw new Exception("An error occurred while deleting the department.", ex);
            }
        }

        public async Task<IEnumerable<DepartmentGrowthDto>> GetDepartmentGrowthAsync()
        {
            return await _context.Employees
                .GroupBy(e => new { e.Department.Name, e.HireDate.Year, e.HireDate.Month })
                .Select(g => new DepartmentGrowthDto
                {
                    DepartmentName = g.Key.Name,
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.DepartmentName)
                .ThenBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
        }
    }

  
}
