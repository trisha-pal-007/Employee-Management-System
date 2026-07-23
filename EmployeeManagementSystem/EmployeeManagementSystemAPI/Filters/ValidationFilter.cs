using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace EmployeeManagementSystemAPI.Filters;

public class ValidationFilter : IActionFilter
{
    private readonly ILogger<ValidationFilter> _logger;

    public ValidationFilter(ILogger<ValidationFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState
                .Where(kv => kv.Value.Errors.Count > 0)
                .ToDictionary(
                    kv => kv.Key,
                    kv => kv.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            _logger.LogWarning("Validation failed for {Path}: {@Errors}", context.HttpContext.Request.Path, errors);

            context.Result = new BadRequestObjectResult(new
            {
                message = "Validation failed",
                errors
            });
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // no-op
    }
}
