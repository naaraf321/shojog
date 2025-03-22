import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the StatisticsData type
export interface StatisticsData {
  totalPoints: number;
  examsTaken: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  streakDays: number;
  rank: number;
  rankPercentile: number;
}

/**
 * Exports statistics data as CSV file
 * @param statistics - The statistics data to export
 * @param fileName - The name of the file to be downloaded
 */
export function exportStatisticsAsCsv(statistics: StatisticsData, fileName: string = "statistics-export"): void {
  // Create CSV content
  const header = Object.keys(statistics).join(",");
  const values = Object.values(statistics).join(",");
  const csvContent = `${header}\n${values}`;

  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element to trigger the download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports statistics data as PDF file using browser's print functionality
 * @param statistics - The statistics data to export
 * @param userName - The user's name for the PDF title
 */
export function exportStatisticsAsPdf(statistics: StatisticsData, userName: string = "User"): void {
  // Create a temporary div to hold printable content
  const printDiv = document.createElement("div");
  printDiv.style.padding = "20px";

  // Add title and user info
  const title = document.createElement("h1");
  title.textContent = `${userName}'s Statistics`;
  title.style.textAlign = "center";
  title.style.marginBottom = "20px";
  printDiv.appendChild(title);

  // Add date
  const date = document.createElement("p");
  date.textContent = `Generated on: ${new Date().toLocaleDateString()}`;
  date.style.textAlign = "center";
  date.style.marginBottom = "30px";
  printDiv.appendChild(date);

  // Create table for statistics
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  // Add table rows for each statistic
  Object.entries(statistics).forEach(([key, value]) => {
    const row = document.createElement("tr");

    const keyCell = document.createElement("td");
    keyCell.textContent = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    keyCell.style.padding = "8px";
    keyCell.style.borderBottom = "1px solid #ddd";
    keyCell.style.fontWeight = "bold";

    const valueCell = document.createElement("td");
    valueCell.textContent = (typeof value === "number" && key.includes("ercentile")) || key === "accuracy" ? `${value}%` : value.toString();
    valueCell.style.padding = "8px";
    valueCell.style.borderBottom = "1px solid #ddd";

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  });

  printDiv.appendChild(table);

  // Add disclaimer
  const disclaimer = document.createElement("p");
  disclaimer.textContent = "This report is generated from ShudhuMCQ Platform";
  disclaimer.style.marginTop = "30px";
  disclaimer.style.fontSize = "12px";
  disclaimer.style.textAlign = "center";
  printDiv.appendChild(disclaimer);

  // Append to body temporarily
  document.body.appendChild(printDiv);

  // Print the div
  window.print();

  // Remove the div after printing
  document.body.removeChild(printDiv);
}
