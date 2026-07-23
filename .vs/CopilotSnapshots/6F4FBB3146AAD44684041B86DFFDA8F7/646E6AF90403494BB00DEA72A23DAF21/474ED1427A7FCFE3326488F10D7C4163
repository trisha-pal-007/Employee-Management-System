using ClosedXML.Excel;
using EmployeeManagementSystemAPI.Data;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using System.IO;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using EmployeeManagementSystemAPI.Models;

namespace EmployeeManagementSystemAPI.Services
{
    public class ReportService
    {
        private readonly AppDbContext _context;
        public ReportService(AppDbContext context) => _context = context;

        // Employee Directory
        public byte[] GenerateEmployeeDirectory(string format)
        {
            var employees = _context.Employees.Include(e => e.Department).ToList();
            var cleanFormat = format.Trim().ToLower();

            return cleanFormat switch
            {
                "pdf" => GenerateEmployeeDirectoryPdf(employees),
                "excel" => GenerateEmployeeDirectoryExcel(employees),
                _ => throw new ArgumentException("Unsupported format")
            };
        }


        // Departments Report
        public byte[] GenerateDepartmentsReport(string format)
        {
            var departments = _context.Departments.Include(d => d.Employees).ToList();
            return format.ToLower() switch
            {
                "pdf" => GenerateDepartmentsPdf(departments),
                "excel" => GenerateDepartmentsExcel(departments),
                _ => throw new ArgumentException("Unsupported format")
            };
        }

        // Attendance Report
        public byte[] GenerateAttendanceReport(DateOnly from, DateOnly to, string format)
        {
            var records = _context.Attendance
                .Include(a => a.Employee)
                .Where(a => a.Date >= from && a.Date <= to)
                .ToList();

            return format.ToLower() switch
            {
                "pdf" => GenerateAttendancePdf(records),
                "excel" => GenerateAttendanceExcel(records),
                _ => throw new ArgumentException("Unsupported format")
            };
        }

        // Salary Report
        public byte[] GenerateSalaryReport(string format)
        {
            var salaries = _context.Salaries.Include(s => s.Employee).ToList();
            return format.ToLower() switch
            {
                "pdf" => GenerateSalaryPdf(salaries),
                "excel" => GenerateSalaryExcel(salaries),
                _ => throw new ArgumentException("Unsupported format")
            };
        }

        // ---------------- PDF Generators ----------------
        private byte[] GenerateEmployeeDirectoryPdf(List<Employee> employees)
        {
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Header().Text("Employee Directory").FontSize(20).Bold();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(150);
                            c.ConstantColumn(200);
                            c.ConstantColumn(150);
                        });
                        table.Header(h =>
                        {
                            h.Cell().Text("Name").Bold();
                            h.Cell().Text("Email").Bold();
                            h.Cell().Text("Department").Bold();
                        });
                        foreach (var e in employees)
                        {
                            table.Cell().Text($"{e.FirstName} {e.LastName}");
                            table.Cell().Text(e.Email);
                            table.Cell().Text(e.Department?.Name ?? "N/A");
                        }
                    });
                });
            });
            return doc.GeneratePdf();
        }

        private byte[] GenerateDepartmentsPdf(List<Department> departments)
        {
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Header().Text("Departments Report").FontSize(20).Bold();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(150);
                            c.ConstantColumn(250);
                            c.ConstantColumn(100);
                        });
                        table.Header(h =>
                        {
                            h.Cell().Text("Name").Bold();
                            h.Cell().Text("Description").Bold();
                            h.Cell().Text("Employee Count").Bold();
                        });
                        foreach (var d in departments)
                        {
                            table.Cell().Text(d.Name);
                            table.Cell().Text(d.Description ?? "N/A");
                            table.Cell().Text(d.Employees.Count.ToString());
                        }
                    });
                });
            });
            return doc.GeneratePdf();
        }

        private byte[] GenerateAttendancePdf(List<Attendance> records)
        {
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Header().Text("Attendance Report").FontSize(20).Bold();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(150);
                            c.ConstantColumn(100);
                            c.ConstantColumn(100);
                            c.ConstantColumn(100);
                            c.ConstantColumn(100);
                        });
                        table.Header(h =>
                        {
                            h.Cell().Text("Employee").Bold();
                            h.Cell().Text("Date").Bold();
                            h.Cell().Text("CheckIn").Bold();
                            h.Cell().Text("CheckOut").Bold();
                            h.Cell().Text("Status").Bold();
                        });
                        foreach (var r in records)
                        {
                            table.Cell().Text($"{r.Employee.FirstName} {r.Employee.LastName}");
                            table.Cell().Text(r.Date.ToString());
                            table.Cell().Text(r.CheckIn?.ToString() ?? "-");
                            table.Cell().Text(r.CheckOut?.ToString() ?? "-");
                            table.Cell().Text(r.Status);
                        }
                    });
                });
            });
            return doc.GeneratePdf();
        }

        private byte[] GenerateSalaryPdf(List<Salary> salaries)
        {
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Header().Text("Salary Report").FontSize(20).Bold();

                    page.Content().Column(col =>
                    {
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(); // First Name
                                columns.RelativeColumn(); // Last Name
                                columns.RelativeColumn(); // Base Salary
                                columns.RelativeColumn(); // Bonus
                                columns.RelativeColumn(); // Deductions
                                columns.RelativeColumn(); // Effective Date
                            });

                            // Header row
                            table.Cell().Element(cell => cell.Text("First Name").Bold());
                            table.Cell().Element(cell => cell.Text("Last Name").Bold());
                            table.Cell().Element(cell => cell.Text("Last Salary").Bold());
                            table.Cell().Element(cell => cell.Text("Base Salary").Bold());
                            table.Cell().Element(cell => cell.Text("Bonus").Bold());
                            table.Cell().Element(cell => cell.Text("Deductions").Bold());
                            table.Cell().Element(cell => cell.Text("Effective Date").Bold());


                            // Data rows
                            foreach (var salary in salaries)
                            {
                                table.Cell().Element(cell => cell.Text(salary.Employee.FirstName).WrapAnywhere());
                                table.Cell().Element(cell => cell.Text(salary.Employee.LastName).WrapAnywhere());
                                table.Cell().Element(cell => cell.Text($"{salary.BaseSalary:C}"));
                                table.Cell().Element(cell => cell.Text($"{salary.Bonus:C}"));
                                table.Cell().Element(cell => cell.Text($"{salary.Deductions:C}"));
                                table.Cell().Element(cell => cell.Text(salary.EffectiveDate.ToString("yyyy-MM-dd")));

                            }
                        });
                    });
                });
            });

            return doc.GeneratePdf();

        }

        // ---------------- Excel Generators ----------------
        private byte[] GenerateEmployeeDirectoryExcel(List<Employee> employees)
        {
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Employees");
            ws.Cell(1, 1).Value = "Name";
            ws.Cell(1, 2).Value = "Email";
            ws.Cell(1, 3).Value = "Department";
            int row = 2;
            foreach (var e in employees)
            {
                ws.Cell(row, 1).Value = $"{e.FirstName} {e.LastName}";
                ws.Cell(row, 2).Value = e.Email;
                ws.Cell(row, 3).Value = e.Department?.Name ?? "N/A";
                row++;
            }
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }

        private byte[] GenerateDepartmentsExcel(List<Department> departments)
        {
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Departments");
            ws.Cell(1, 1).Value = "Name";
            ws.Cell(1, 2).Value = "Description";
            ws.Cell(1, 3).Value = "Employee Count";
            int row = 2;
            foreach (var d in departments)
            {
                ws.Cell(row, 1).Value = d.Name;
                ws.Cell(row, 2).Value = d.Description ?? "N/A";
                ws.Cell(row, 3).Value = d.Employees.Count;
                row++;
            }
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }

        private byte[] GenerateAttendanceExcel(List<Attendance> records)
        {
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Attendance");
            ws.Cell(1, 1).Value = "Employee";
            ws.Cell(1, 2).Value = "Date";
            ws.Cell(1, 3).Value = "CheckIn";
            ws.Cell(1, 4).Value = "CheckOut";
            ws.Cell(1, 5).Value = "Status";
            int row = 2;
            foreach (var r in records)
            {
                ws.Cell(row, 1).Value = $"{r.Employee.FirstName} {r.Employee.LastName}";
                // convert DateOnly -> DateTime so ClosedXML recognizes it as a date
                ws.Cell(row, 2).Value = r.Date.ToDateTime(TimeOnly.MinValue);
                ws.Cell(row, 3).Value = r.CheckIn?.ToString() ?? "-";
                ws.Cell(row, 4).Value = r.CheckOut?.ToString() ?? "-";
                ws.Cell(row, 5).Value = r.Status;
                row++;
            }
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }

        private byte[] GenerateSalaryExcel(List<Salary> salaries)
        {
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Salary");
            ws.Cell(1, 1).Value = "Employee";
            ws.Cell(1, 2).Value = "Base";
            ws.Cell(1, 3).Value = "Bonus";
            ws.Cell(1, 4).Value = "Deductions";
            ws.Cell(1, 5).Value = "Effective Date";
            int row = 2;
            foreach (var s in salaries)
            {
                ws.Cell(row, 1).Value = $"{s.Employee.FirstName} {s.Employee.LastName}";
                ws.Cell(row, 2).Value = s.BaseSalary;
                ws.Cell(row, 3).Value = s.Bonus;
                ws.Cell(row, 4).Value = s.Deductions;
                // convert DateOnly -> DateTime
                ws.Cell(row, 5).Value = s.EffectiveDate.ToDateTime(TimeOnly.MinValue);
                row++;
            }
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }
    }

}
