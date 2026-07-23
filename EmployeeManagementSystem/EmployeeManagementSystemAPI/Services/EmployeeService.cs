using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;
using QuestPDF.Fluent;


namespace EmployeeManagementSystemAPI.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repo;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(IEmployeeRepository repo, ILogger<EmployeeService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync(string? department = null, string? search = null)
        {
            try
            {
                return await _repo.GetAllAsync(department, search);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.GetAllAsync failed (department={Department}, search={Search})", department, search);
                throw new Exception("Failed to retrieve employees.", ex);
            }
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            try
            {
                return await _repo.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.GetByIdAsync failed for id {Id}", id);
                throw new Exception("Failed to retrieve the employee.", ex);
            }
        }

        public async Task<Employee> AddAsync(CreateEmployeeDto dto)
        {
            try
            {
                return await _repo.AddAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.AddAsync failed {@Dto}", dto);
                throw new Exception("Failed to add the employee.", ex);
            }
        }

        public async Task<bool> UpdateAsync(UpdateEmployeeDto dto)
        {
            try
            {
                return await _repo.UpdateAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.UpdateAsync failed {@Dto}", dto);
                throw new Exception("Failed to update the employee.", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                return await _repo.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.DeleteAsync failed for id {Id}", id);
                throw new Exception("Failed to delete the employee.", ex);
            }
        }

        public async Task<IEnumerable<Employee>> BulkAddAsync(List<CreateEmployeeDto> dtos)
        {
            try
            {
                return await _repo.BulkAddAsync(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.BulkAddAsync failed Count={Count}", dtos?.Count ?? 0);
                throw new Exception("Failed to bulk add employees.", ex);
            }
        }

        public async Task BulkDeleteAsync(List<int> ids)
        {
            try
            {
                await _repo.BulkDeleteAsync(ids);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmployeeService.BulkDeleteAsync failed IdCount={Count}", ids?.Count ?? 0);
                throw new Exception("Failed to bulk delete employees.", ex);
            }
        }

        public async Task<IEnumerable<HiringTrendDto>> GetHiringTrendsAsync()
        {
            // Business logic could be added here (e.g., convert month numbers to names)
            var trends = await _repo.GetHiringTrendsAsync();
            return trends;
        }

        public async Task<byte[]> GeneratePerformanceReportPdfAsync()
        {
            var metrics = await _repo.GetPerformanceMetricsAsync();

            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Header().Text("Employee Performance Report").FontSize(20);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(50);
                            c.RelativeColumn();
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("ID");
                            h.Cell().Text("Name");
                            h.Cell().Text("Attendance Rate");
                        });

                        foreach (var m in metrics)
                        {
                            table.Cell().Text(m.EmployeeId.ToString());
                            table.Cell().Text(m.EmployeeName);
                            table.Cell().Text($"{m.AttendanceRate:P}");
                        }
                    });
                });
            });

            return doc.GeneratePdf();
        }

    }

}
