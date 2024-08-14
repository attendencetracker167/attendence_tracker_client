import ClockIn from '../Components/ClockIn';
import AttendanceTable from '../Components/AttendenceTable';
const ClockInPage = () => {

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>Employee Attendance System</h1>
      </header>
      <main style={styles.mainContent}>
        <ClockIn />
        <AttendanceTable/>
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
  },
  mainContent: {
    flex: '1',
    padding: '20px',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#f1f1f1',
    padding: '10px 20px',
    textAlign: 'center',
    marginTop: 'auto',
  },
};

export default ClockInPage;
