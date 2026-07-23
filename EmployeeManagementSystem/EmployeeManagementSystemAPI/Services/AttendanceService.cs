using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;
using Microsoft.Extensions.Logging;
using System;

namespace EmployeeManagementSystemAPI.Services
{
    public class AttendanceService
    {
        private readonly IAttendanceRepository _repo;
        private readonly ILogger<AttendanceService> _logger;

        public AttendanceService(IAttendanceRepository repo, ILogger<AttendanceService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<Attendance> CheckInAsync(int employeeId)
        {
            try
            {
                return await _repo.CheckInAsync(employeeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AttendanceService.CheckInAsync failed for employee {EmployeeId}", employeeId);
                throw new Exception("Failed to check in.", ex);
            }
        }

        public async Task<Attendance> CheckOutAsync(int employeeId)
        {
            try
            {
                return await _repo.CheckOutAsync(employeeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AttendanceService.CheckOutAsync failed for employee {EmployeeId}", employeeId);
                throw new Exception("Failed to check out.", ex);
            }
        }

        public async Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateOnly from, DateOnly to)
        {
            try
            {
                return await _repo.GetByEmployeeAsync(employeeId, from, to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AttendanceService.GetByEmployeeAsync failed for employee {EmployeeId}", employeeId);
                throw new Exception("Failed to retrieve attendance records.", ex);
            }
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            try
            {
                return await _repo.UpdateStatusAsync(id, status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AttendanceService.UpdateStatusAsync failed for id {Id}", id);
                throw new Exception("Failed to update attendance status.", ex);
            }
        }
        public async Task<IEnumerable<AttendancePatternDto>> GetAttendancePatternsAsync()
        {
            return await _repo.GetAttendancePatternsAsync();
        }

    }
}
