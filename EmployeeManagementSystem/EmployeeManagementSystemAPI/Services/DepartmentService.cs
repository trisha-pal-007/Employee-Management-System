using EmployeeManagementSystemAPI.DTOs;
using EmployeeManagementSystemAPI.Models;
using EmployeeManagementSystemAPI.Repositories;
using Microsoft.Extensions.Logging;
using System;

namespace EmployeeManagementSystemAPI.Services
{
    public class DepartmentService
    {
        private readonly IDepartmentRepository _repo;
        private readonly ILogger<DepartmentService> _logger;

        public DepartmentService(IDepartmentRepository repo, ILogger<DepartmentService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            try
            {
                return await _repo.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DepartmentService.GetAllAsync failed");
                throw new Exception("Failed to retrieve departments.", ex);
            }
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            try
            {
                return await _repo.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DepartmentService.GetByIdAsync failed for id {Id}", id);
                throw new Exception("Failed to retrieve the department.", ex);
            }
        }

        public async Task<Department> AddAsync(CreateDepartmentDto dto)
        {
            try
            {
                return await _repo.AddAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DepartmentService.AddAsync failed {@Dto}", dto);
                throw new Exception("Failed to add the department.", ex);
            }
        }

        public async Task<bool> UpdateAsync(UpdateDepartmentDto dto)
        {
            try
            {
                return await _repo.UpdateAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DepartmentService.UpdateAsync failed {@Dto}", dto);
                throw new Exception("Failed to update the department.", ex);
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
                _logger.LogError(ex, "DepartmentService.DeleteAsync failed for id {Id}", id);
                throw new Exception("Failed to delete the department.", ex);
            }
        }

        public async Task<IEnumerable<DepartmentGrowthDto>> GetDepartmentGrowthAsync()
        {
            var growth = await _repo.GetDepartmentGrowthAsync();
            return growth;
        }

    }
}
