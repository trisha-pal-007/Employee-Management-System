using EmployeeManagementSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _service;
        public ReportsController(ReportService service) => _service = service;

        [HttpGet("employee-directory")]
        public IActionResult EmployeeDirectory([FromQuery] string format = "pdf")
        {
            var fileBytes = _service.GenerateEmployeeDirectory(format);
            var contentType = GetContentType(format);
            return File(fileBytes, contentType, $"employee-directory.{format}");
        }

        [HttpGet("departments")]
        public IActionResult Departments([FromQuery] string format = "pdf")
        {
            var fileBytes = _service.GenerateDepartmentsReport(format);
            var contentType = GetContentType(format);
            return File(fileBytes, contentType, $"departments.{format}");
        }

        [HttpGet("attendance")]
        public IActionResult Attendance([FromQuery] DateOnly from, [FromQuery] DateOnly to, [FromQuery] string format = "pdf")
        {
            var fileBytes = _service.GenerateAttendanceReport(from, to, format);
            var contentType = GetContentType(format);
            return File(fileBytes, contentType, $"attendance.{format}");
        }

        [HttpGet("salary")]
        public IActionResult Salary([FromQuery] string format = "pdf")
        {
            var fileBytes = _service.GenerateSalaryReport(format);
            var contentType = GetContentType(format);
            return File(fileBytes, contentType, $"salary.{format}");
        }

        private string GetContentType(string format) =>
            format == "pdf" ? "application/pdf" :
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }


}
