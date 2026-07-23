using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;

namespace EmployeeManagementSystemAPI.Repositories
{
    public interface IAttendanceRepository
    {
        Task<Attendance> CheckInAsync(int employeeId);
        Task<Attendance> CheckOutAsync(int employeeId);
        Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateOnly from, DateOnly to);
        Task<bool> UpdateStatusAsync(int id, string status);
        Task<IEnumerable<AttendancePatternDto>> GetAttendancePatternsAsync();
    }

}
