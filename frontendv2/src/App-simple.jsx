import React from 'react'

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ffffff', 
      minHeight: '100vh',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      zIndex: 1000
    }}>
      <h1 style={{ 
        color: '#000000', 
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Agri3 Frontend Test - React is Loading!
      </h1>
      <p style={{ 
        color: '#000000',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        If you can see this text, React is working correctly!
      </p>
      <div style={{
        backgroundColor: '#2E7D32',
        color: 'white',
        padding: '10px',
        marginTop: '20px',
        borderRadius: '5px'
      }}>
        Success: Components are rendering properly
      </div>
    </div>
  )
}

export default App
