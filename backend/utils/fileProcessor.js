import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

export const processExcelFile = async (filePath, options = {}) => {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath)
    
    // Get sheet names
    const sheetNames = workbook.SheetNames
    
    if (sheetNames.length === 0) {
      throw new Error('No sheets found in the Excel file')
    }
    
    // Use specified sheet or first sheet
    const sheetName = options.sheetName || sheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found`)
    }
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // Use array of arrays format
      defval: null, // Default value for empty cells
      blankrows: false // Skip blank rows
    })
    
    if (jsonData.length === 0) {
      throw new Error('No data found in the Excel file')
    }
    
    // Extract headers and data
    const headers = jsonData[0]
    const rows = jsonData.slice(1)
    
    // Validate headers
    if (!headers || headers.length === 0) {
      throw new Error('No column headers found')
    }
    
    // Clean headers (remove empty/null values)
    const cleanHeaders = headers
      .map((header, index) => header || `Column_${index + 1}`)
      .map(header => String(header).trim())
    
    // Convert rows to objects
    const data = rows.map(row => {
      const obj = {}
      cleanHeaders.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index] : null
      })
      return obj
    })
    
    // Analyze data types
    const dataTypes = analyzeDataTypes(data, cleanHeaders)
    
    return {
      columns: cleanHeaders,
      data: data,
      rowCount: data.length,
      sheetNames: sheetNames,
      selectedSheet: sheetName,
      dataTypes: dataTypes,
      metadata: {
        totalSheets: sheetNames.length,
        fileSize: fs.statSync(filePath).size,
        processedAt: new Date()
      }
    }
  } catch (error) {
    throw new Error(`Failed to process Excel file: ${error.message}`)
  }
}

const analyzeDataTypes = (data, columns) => {
  const types = {}
  
  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined)
    
    if (values.length === 0) {
      types[column] = 'empty'
      return
    }
    
    const sample = values.slice(0, Math.min(100, values.length))
    let numberCount = 0
    let dateCount = 0
    let stringCount = 0
    
    sample.forEach(value => {
      if (typeof value === 'number') {
        numberCount++
      } else if (value instanceof Date || isValidDate(value)) {
        dateCount++
      } else {
        stringCount++
      }
    })
    
    const total = sample.length
    if (numberCount / total > 0.8) {
      types[column] = 'number'
    } else if (dateCount / total > 0.8) {
      types[column] = 'date'
    } else {
      types[column] = 'string'
    }
  })
  
  return types
}

const isValidDate = (value) => {
  if (typeof value === 'string') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }
  return false
}

export const cleanupFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Failed to cleanup file:', error)
  }
}

export const validateExcelFile = (file) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only Excel files (.xls, .xlsx) are allowed.')
  }
  
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`)
  }
  
  return true
}