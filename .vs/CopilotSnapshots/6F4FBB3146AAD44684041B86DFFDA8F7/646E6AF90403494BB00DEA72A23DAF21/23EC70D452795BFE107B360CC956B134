using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;

namespace EmployeeManagementSystemAPI.Services
{
    public class AttendanceService
    {
        private readonly IAttendanceRepository _repo;
        public AttendanceService(IAttendanceRepository repo) => _repo = repo;

        public Task<Attendance> CheckInAsync(int employeeId) => _repo.CheckInAsync(employeeId);
        public Task<Attendance> CheckOutAsync(int employeeId) => _repo.CheckOutAsync(employeeId);
        public Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateOnly from, DateOnly to)
            => _repo.GetByEmployeeAsync(employeeId, from, to);
        public Task<bool> UpdateStatusAsync(int id, string status) => _repo.UpdateStatusAsync(id, status);
    }
}
