using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeManagementSystemAPI.Services;

namespace EmployeeManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _service;
        public AttendanceController(AttendanceService service) => _service = service;

        [HttpPost("checkin/{employeeId}")]
        public async Task<IActionResult> CheckIn(int employeeId)
            => Ok(await _service.CheckInAsync(employeeId));

        [HttpPost("checkout/{employeeId}")]
        public async Task<IActionResult> CheckOut(int employeeId)
            => Ok(await _service.CheckOutAsync(employeeId));

        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId, [FromQuery] DateOnly from, [FromQuery] DateOnly to)
            => Ok(await _service.GetByEmployeeAsync(employeeId, from, to));

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var updated = await _service.UpdateStatusAsync(id, status);
            return !updated ? NotFound() : NoContent();
        }

        [HttpGet("attendance-patterns")]
        public async Task<IActionResult> GetAttendancePatterns()
        {
            var patterns = await _service.GetAttendancePatternsAsync();
            return Ok(patterns);
        }

    }

}
