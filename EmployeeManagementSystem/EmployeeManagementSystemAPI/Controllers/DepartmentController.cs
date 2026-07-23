using EmployeeManagementSystemAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeManagementSystemAPI.Services;

namespace EmployeeManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _service;
        public DepartmentController(DepartmentService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dept = await _service.GetByIdAsync(id);
            return dept == null ? NotFound() : Ok(dept);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDepartmentDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(dto);
            return !updated ? NotFound() : NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return !deleted ? NotFound() : NoContent();
        }

        [HttpGet("department-growth")]
        public async Task<IActionResult> GetDepartmentGrowth()
        {
            var growth = await _service.GetDepartmentGrowthAsync();
            return Ok(growth);
        }

    }

}
