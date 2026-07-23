using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeService _service;
        public EmployeeController(EmployeeService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? department, [FromQuery] string? search)
        {
            var employees = await _service.GetAllAsync(department, search);
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _service.GetByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> BulkCreate([FromBody] List<CreateEmployeeDto> employees)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.BulkAddAsync(employees);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
        {
            await _service.BulkDeleteAsync(ids);
            return NoContent();
        }

        [HttpGet("hiring-trends")]
        public async Task<IActionResult> GetHiringTrends()
        {
            var trends = await _service.GetHiringTrendsAsync();
            return Ok(trends);
        }

        [HttpGet("performance-report")]
        public async Task<IActionResult> GetPerformanceReport()
        {
            var pdf = await _service.GeneratePerformanceReportPdfAsync();
            return File(pdf, "application/pdf", "PerformanceReport.pdf");
        }


    }


}
