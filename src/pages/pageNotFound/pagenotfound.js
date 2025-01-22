import React from 'react'

function pagenotfound() {
  return (
        <div style={styles.container}>
          <h1 style={styles.header}>404</h1>
          <p style={styles.text}>Page Not Found</p>
        </div>
  )
}
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '5rem',
      margin: '0',
    },
    text: {
      fontSize: '1.5rem',
      margin: '10px 0',
    },
    link: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '5px',
    },
  };
export default pagenotfound