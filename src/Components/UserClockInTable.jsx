import  { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; 

const UserClockInTable = () => {
  const [users, setUsers] = useState([]);
  const [clockInData, setClockInData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api, user } = useAuth(); // Assuming useAuth provides api and user info
  const token = user?.token;
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/user`);
          setUsers(response?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchClockInData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${api}/attendance/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClockInData(response.data);
        console.log(response.data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchClockInData();
  }, [api, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px', fontWeight: '600' }}>User Clock-In Records</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="user-select" style={{ marginRight: '10px' }}>Filter by Username:</label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Username</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Clock-In Time</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Clock-Out Time</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Total Duration</th>
            </tr>
          </thead>
          {clockInData.filter((record)=> record.user._id.toLowerCase().includes(selectedUser)).length > 0 ? (

          <tbody>
            {clockInData.filter((record)=> record.user._id.toLowerCase().includes(selectedUser)).map(record => (
              <tr key={record._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{new Date(record.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{record.user.username}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{new Date(record.clock_in_time).toLocaleTimeString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{record.clock_out_time ? new Date(record.clock_out_time).toLocaleTimeString() : 'Not clocked out yet'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{record.total_duration}</td>
              </tr>
            ))}
          </tbody>):(
            <tbody>
              <td colSpan={5} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                
           <div className="xs:max-sm:text-lg">
          <h1 className="font-semibold capitalize">No Web Clocks Data Found</h1>
        </div>
          
                </td>

            </tbody>)
          }
        </table>
      </div>
    </div>
  );
};

export default UserClockInTable;
