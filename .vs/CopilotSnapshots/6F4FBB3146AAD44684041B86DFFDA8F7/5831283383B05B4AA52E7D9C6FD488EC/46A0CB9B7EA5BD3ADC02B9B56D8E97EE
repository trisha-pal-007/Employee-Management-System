using EmployeeManagementSystemAPI.Data;
using EmployeeManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystemAPI.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly AppDbContext _context;
        public AttendanceRepository(AppDbContext context) => _context = context;

        public async Task<Attendance> CheckInAsync(int employeeId)
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

        public async Task<Attendance> CheckOutAsync(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var attendance = await _context.Attendance
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance == null) throw new InvalidOperationException("No check-in found for today.");

            attendance.CheckOut = TimeOnly.FromDateTime(DateTime.UtcNow);
            await _context.SaveChangesAsync();
            return attendance;
        }

        public async Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateOnly from, DateOnly to)
        {
            return await _context.Attendance
                .Where(a => a.EmployeeId == employeeId && a.Date >= from && a.Date <= to)
                .ToListAsync();
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            var attendance = await _context.Attendance.FindAsync(id);
            if (attendance == null) return false;

            attendance.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
