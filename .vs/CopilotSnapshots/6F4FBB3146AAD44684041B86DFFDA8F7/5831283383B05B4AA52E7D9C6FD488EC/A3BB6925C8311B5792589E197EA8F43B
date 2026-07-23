using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;
        public EmployeeRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Employee>> GetAllAsync(string? department, string? search)
        {
            var query = _context.Employees.AsQueryable();
            if (!string.IsNullOrEmpty(department))
                query = query.Where(e => e.DepartmentId.ToString() == department);
            if (!string.IsNullOrEmpty(search))
                query = query.Where(e => e.FirstName.Contains(search) || e.LastName.Contains(search));
            return await query.ToListAsync();
        }

        public async Task<Employee?> GetByIdAsync(int id) => await _context.Employees.FindAsync(id);

        public async Task<Employee> AddAsync(CreateEmployeeDto dto)
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

        public async Task<bool> UpdateAsync(UpdateEmployeeDto dto)
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

        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Employee>> BulkAddAsync(List<CreateEmployeeDto> dtos)
        {
            // Prevent inserting duplicate employees by email (case-insensitive).
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

        public async Task BulkDeleteAsync(List<int> ids)
        {
            var employees = _context.Employees.Where(e => ids.Contains(e.Id));
            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
        }
    }


}
