import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import CustomHeader from './CustomHeader';
import './Table.css';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#406599',
      color: '#f7f8fa',
      fontWeight: 'bold',
      fontSize: '14px',
      border: '1px solid #e3e3e3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
    },
  },
  rows: {
    style: {
      minHeight: '62px',
      border: '0.7px solid #e8dcdc',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      border: '0.5px solid #e8dcdc',
      display: 'flex',
      alignItems: 'center',
    },
  },
};

const TableContainer = styled.div`
  margin: 20px;
  font-family: Arial, Helvetica, sans-serif;
  & .rdt_TableHeader {
    background-color: #f5f5f5;
  }
`;

const Table = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://adibf21.uaenorth.cloudapp.azure.com:8383/api/items');
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (columnId, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: value,
    }));

    const filteredResults = data.filter((item) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
      });
    });

    if (filteredResults.length === 0) {
      alert('No results found');
      setFilteredData(data);
    } else {
      setFilteredData(filteredResults);
    }
  };

  const columns = [
    { 
      id: 'name', 
      name: <CustomHeader column={{ id: 'name', name: 'Name' }} onFilterChange={handleFilterChange} />,
      selector: row => row.name,
      sortable: true,
      grow: 2,
    },
    { 
      id: 'bookLanguage', 
      name: <CustomHeader column={{ id: 'bookLanguage', name: 'Language' }} onFilterChange={handleFilterChange} />,
      selector: row => row.bookLanguage,
      sortable: true,
      grow: .8,
    },
    { 
      id: 'description', 
      name: <CustomHeader column={{ id: 'description', name: 'Description' }} onFilterChange={handleFilterChange} />,
      selector: row => row.description,
      sortable: true,
      grow: 2,
    },
    { 
      id: 'barcodeName', 
      name: <CustomHeader column={{ id: 'barcodeName', name: 'Barcode Name' }} onFilterChange={handleFilterChange} />,
      selector: row => row.barcodeName,
      sortable: true,
      grow: 1,
    },
    { 
      id: 'price', 
      name: <CustomHeader column={{ id: 'price', name: 'Price' }} onFilterChange={handleFilterChange} />,
      selector: row => row.unitPrice,
      sortable: true,
      grow: .5,
    },
    { 
      id: 'created', 
      name: <CustomHeader column={{ id: 'created', name: 'Created At' }} onFilterChange={handleFilterChange} />,
      selector: row => row.createdAt,
      sortable: true,
      grow: 2,
    },
    { 
      id: 'updated', 
      name: <CustomHeader column={{ id: 'updated', name: 'Updated At' }} onFilterChange={handleFilterChange} />,
      selector: row => row.updatedAt,
      sortable: true,
      grow: 1.5,
    },
    { 
      id: 'actions', 
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <FaEye style={{ cursor: 'pointer' }} onClick={() => handleView(row.id)} />
          <FaEdit style={{ cursor: 'pointer' }} onClick={() => handleEdit(row.id)} />
          <FaTrash style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.id)} />
        </div>
      ),
      grow: 1,
    },
  ];

  const handleView = (id) => {
    console.log('View clicked for id:', id);
  };

  const handleEdit = (id) => {
    console.log('Edit clicked for id:', id);
  };

  const handleDelete = async (id) => {
    alert('Delete..?');
    try {
      await axios.delete(`http://adibf21.uaenorth.cloudapp.azure.com:8383/api/items/${id}`);
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TableContainer>
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
      />
    </TableContainer>
  );
};

export default Table;
