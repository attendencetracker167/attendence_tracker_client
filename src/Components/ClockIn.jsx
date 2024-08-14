import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth'; // Assuming you have this hook

const ClockIn = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [duration, setDuration] = useState(null);
  const { api, user } = useAuth(); // Assuming useAuth provides api and user info
  const token = user?.token;

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load state from session storage
    const storedClockInTime = sessionStorage.getItem('clockInTime');
    const storedClockOutTime = sessionStorage.getItem('clockOutTime');
    const storedIsClockedIn = sessionStorage.getItem('isClockedIn') === 'true';

    if (storedClockInTime) {
      setClockInTime(new Date(storedClockInTime));
      setIsClockedIn(storedIsClockedIn);
    }

    if (storedClockOutTime) {
      setClockOutTime(new Date(storedClockOutTime));
      setIsClockedIn(false); // Ensure state reflects user is not clocked in
      sessionStorage.removeItem('isClockedIn'); // Clear previous clock-in state
    }

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    try {
      if (!token) {
        throw new Error('Authentication token is missing or expired.');
      }

      const response = await axios.post(`${api}/attendance/clockin`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { clock_in_time } = response.data.attendanceRecord;
      const parsedClockInTime = new Date(clock_in_time);

      setClockInTime(parsedClockInTime);
      setIsClockedIn(true);
      sessionStorage.removeItem('clockOutTime'); // Clear any previous clock-out time
      sessionStorage.setItem('clockInTime', clock_in_time);
      sessionStorage.setItem('isClockedIn', 'true');
    } catch (error) {
      console.error('Error clocking in:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while clocking in. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await axios.post(`${api}/attendance/clockout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { clock_out_time } = response.data.attendanceRecord;
      const parsedClockOutTime = new Date(clock_out_time);

      setClockOutTime(parsedClockOutTime);
      setIsClockedIn(false);

      const clockIn = new Date(sessionStorage.getItem('clockInTime'));
      const durationMillis = parsedClockOutTime - clockIn;
      const hours = Math.floor(durationMillis / (1000 * 60 * 60));
      const minutes = Math.floor((durationMillis % (1000 * 60 * 60)) / (1000 * 60));
      setDuration(`${hours} hours, ${minutes} minutes`);

      sessionStorage.setItem('clockOutTime', clock_out_time);
      sessionStorage.removeItem('clockInTime'); // Clear clock-in time after clock-out
      sessionStorage.removeItem('isClockedIn'); // Clear clock-in status after clock-out
    } catch (error) {
      console.error('Error clocking out:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while clocking out. Please try again.',
        icon: 'error',
      });
    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div style={styles.container}>
      <h2>Attendance Clock-In</h2>
      <p>Current Time: {formatTime(currentTime)}</p>
      {!isClockedIn ? (
        <button onClick={handleClockIn} style={styles.button}>Clock In</button>
      ) : (
        <div style={styles.clockInDetails}>
          <p>You clocked in at: {clockInTime ? formatTime(clockInTime) : ''}</p>
          <button onClick={handleClockOut} style={styles.button2}>Clock Out</button>
        </div>
      )}
      {clockOutTime && (
        <div style={styles.clockOutDetails}>
          <p>You clocked out at: {formatTime(clockOutTime)}</p>
          <p>Duration: {duration}</p>
          <p>Thank you! Have a great day!</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    background: '#4CAF50',
    borderRadius: '4px',
    color: '#fff',
    marginTop: '10px',
    cursor: 'pointer',
  },
  button2: {
    padding: '10px 20px',
    fontSize: '16px',
    background: '#e74c3c',
    borderRadius: '4px',
    color: '#fff',
    marginTop: '10px',
    cursor: 'pointer',
  },
  clockInDetails: {
    marginTop: '20px',
    fontSize: '18px',
    color: 'green',
  },
  clockOutDetails: {
    marginTop: '20px',
    fontSize: '18px',
    color: 'red',
  },
};

export default ClockIn;
