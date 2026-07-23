using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AttendanceRepository> _logger;
        public AttendanceRepository(AppDbContext context, ILogger<AttendanceRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Attendance> CheckInAsync(int employeeId)
        {
            try
            {
                var attendance = new Attendance
                {
                    EmployeeId = employeeId,
                    Date = DateOnly.FromDateTime(DateTime.UtcNow),
                    CheckIn = TimeOnly.FromDateTime(DateTime.UtcNow),
                    Status = "Present",
                    CreatedAt = DateTime.UtcNow
                };
                _context.Attendance.Add(attendance);
                await _context.SaveChangesAsync();
                return attendance;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during check-in for employee {EmployeeId}", employeeId);
                throw new Exception("An error occurred while checking in.", ex);
            }
        }

        public async Task<Attendance> CheckOutAsync(int employeeId)
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var attendance = await _context.Attendance
                    .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

                if (attendance == null) throw new InvalidOperationException("No check-in found for today.");

                attendance.CheckOut = TimeOnly.FromDateTime(DateTime.UtcNow);
                await _context.SaveChangesAsync();
                return attendance;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during check-out for employee {EmployeeId}", employeeId);
                throw new Exception("An error occurred while checking out.", ex);
            }
        }

        public async Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateOnly from, DateOnly to)
        {
            try
            {
                return await _context.Attendance
                    .Where(a => a.EmployeeId == employeeId && a.Date >= from && a.Date <= to)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching attendance for employee {EmployeeId} from {From} to {To}", employeeId, from, to);
                throw new Exception("An error occurred while retrieving attendance records.", ex);
            }
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            try
            {
                var attendance = await _context.Attendance.FindAsync(id);
                if (attendance == null) return false;

                attendance.Status = status;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating attendance status for id {Id}", id);
                throw new Exception("An error occurred while updating attendance status.", ex);
            }
        }

        public async Task<IEnumerable<AttendancePatternDto>> GetAttendancePatternsAsync()
        {
            return await _context.Attendance
                .GroupBy(a => new { a.EmployeeId, a.Employee.FirstName, a.Status })
                .Select(g => new AttendancePatternDto
                {
                    EmployeeId = g.Key.EmployeeId,
                    EmployeeName = g.Key.FirstName,
                    Status = g.Key.Status,
                    Count = g.Count()
                })
                .ToListAsync();
        }

    }
}
