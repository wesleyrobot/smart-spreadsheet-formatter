import { useState, useCallback } from 'react'

export const useSpreadsheet = () => {
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])

  const loadData = useCallback((newData, newColumns) => {
    setData(newData)
    setColumns(newColumns)
    setSelectedColumns(newColumns) // Selecionar todas por padrão
  }, [])

  return {
    data,
    columns,
    selectedColumns,
    loadData,
    setSelectedColumns
  }
}
