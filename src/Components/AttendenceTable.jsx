import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; 

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api, user } = useAuth(); // Assuming useAuth provides api and user info
  const token = user?.token;

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${api}/attendance/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [api, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(attendanceData) || attendanceData.length === 0) return <div>No attendance records found.</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px', fontWeight: '600' }}>Attendance Records</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>User Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Clock-In Time</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Clock-Out Time</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Total Duration</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map(record => (
            <tr key={record._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{new Date(record.date).toLocaleDateString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{user.username}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{new Date(record.clock_in_time).toLocaleTimeString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{record.clock_out_time ? new Date(record.clock_out_time).toLocaleTimeString() : 'Not clocked out yet'}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{record.total_duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
