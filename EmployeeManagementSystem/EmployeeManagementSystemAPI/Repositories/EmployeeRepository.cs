using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EmployeeRepository> _logger;
        public EmployeeRepository(AppDbContext context, ILogger<EmployeeRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync(string? department, string? search)
        {
            try
            {
                var query = _context.Employees.AsQueryable();
                if (!string.IsNullOrEmpty(department))
                    query = query.Where(e => e.DepartmentId.ToString() == department);
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(e => e.FirstName.Contains(search) || e.LastName.Contains(search));
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees (department={Department}, search={Search})", department, search);
                throw new Exception("An error occurred while fetching employees.", ex);
            }
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Employees.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employee by id {Id}", id);
                throw new Exception("An error occurred while fetching the employee.", ex);
            }
        }

        public async Task<Employee> AddAsync(CreateEmployeeDto dto)
        {
            try
            {
                var employee = new Employee
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    DepartmentId = dto.DepartmentId,
                    Position = dto.Position,
                    Salary = dto.Salary,
                    HireDate = DateOnly.FromDateTime(dto.HireDate)
                };
                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding employee {@Dto}", dto);
                throw new Exception("An error occurred while adding the employee.", ex);
            }
        }

        public async Task<bool> UpdateAsync(UpdateEmployeeDto dto)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(dto.Id);
                if (employee == null) return false;

                employee.FirstName = dto.FirstName;
                employee.LastName = dto.LastName;
                employee.Email = dto.Email;
                employee.Phone = dto.Phone;
                employee.DepartmentId = dto.DepartmentId;
                employee.Position = dto.Position;
                employee.Salary = dto.Salary;
                employee.HireDate = DateOnly.FromDateTime(dto.HireDate);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee {@Dto}", dto);
                throw new Exception("An error occurred while updating the employee.", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null) return false;
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee {Id}", id);
                throw new Exception("An error occurred while deleting the employee.", ex);
            }
        }

        public async Task<IEnumerable<Employee>> BulkAddAsync(List<CreateEmployeeDto> dtos)
        {
            // Prevent inserting duplicate employees by email (case-insensitive).
            try
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Load existing emails from the database into a HashSet for fast lookup
                var existingEmails = await _context.Employees
                    .Select(e => e.Email)
                    .ToListAsync();
                var existingSet = new HashSet<string>(existingEmails, StringComparer.OrdinalIgnoreCase);

                var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                var employees = new List<Employee>();

                foreach (var dto in dtos)
                {
                    var email = dto.Email?.Trim();
                    if (string.IsNullOrEmpty(email))
                        continue; // skip entries without an email

                    // Skip if email already exists in DB or already added from this batch
                    if (existingSet.Contains(email) || seen.Contains(email))
                        continue;

                    seen.Add(email);

                    var employee = new Employee
                    {
                        FirstName = dto.FirstName,
                        LastName = dto.LastName,
                        Email = email,
                        Phone = dto.Phone,
                        DepartmentId = dto.DepartmentId,
                        Position = dto.Position,
                        Salary = dto.Salary,
                        HireDate = DateOnly.FromDateTime(dto.HireDate),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    employees.Add(employee);
                }

                if (employees.Count == 0)
                {
                    // Nothing to add; commit transaction and return empty list
                    await transaction.CommitAsync();
                    return employees;
                }

                _context.Employees.AddRange(employees);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return employees;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk adding employees. Count={Count}", dtos?.Count ?? 0);
                throw new Exception("An error occurred while bulk adding employees.", ex);
            }
        }

        public async Task BulkDeleteAsync(List<int> ids)
        {
            try
            {
                var employees = _context.Employees.Where(e => ids.Contains(e.Id));
                _context.Employees.RemoveRange(employees);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deleting employees. IdCount={Count}", ids?.Count ?? 0);
                throw new Exception("An error occurred while bulk deleting employees.", ex);
            }
        }

        public async Task<IEnumerable<HiringTrendDto>> GetHiringTrendsAsync()
        {
            return await _context.Employees
                .GroupBy(e => new { e.HireDate.Year, e.HireDate.Month })
                .Select(g => new HiringTrendDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
        }

        public async Task<IEnumerable<PerformanceMetricDto>> GetPerformanceMetricsAsync()
        {
            return await _context.Employees
                .Select(e => new PerformanceMetricDto
                {
                    EmployeeId = e.Id,
                    EmployeeName = e.FirstName + " " + e.LastName,
                    AttendanceRate = e.Attendances.Count == 0
                        ? 0
                        : (double)e.Attendances.Count(a => a.Status == "Present") / e.Attendances.Count
                })
                .ToListAsync();
        }



    }


}
