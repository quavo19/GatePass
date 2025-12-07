/**
 * Generates a unique ticket number in the format: VIS-YYYYMMDD-XXXXX
 * @returns A ticket number string
 */
export function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;
  
  // Generate a random 5-digit number
  const randomPart = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  
  return `VIS-${datePart}-${randomPart}`;
}

