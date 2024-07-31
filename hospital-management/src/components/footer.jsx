import React from 'react';



const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h4 style={styles.heading}>About Us</h4>
          <p style={styles.paragraph}>
          Hi! We are a team dedicated to connecting you with the best Doctors world-wide to get rid of those pesky diseases that threaten to end your life and make your family inconsolible!
          </p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Follow Us</h4>
          <a href="https://facebook.com" style={styles.link}>Facebook</a>
          <a href="https://twitter.com" style={styles.link}>Twitter</a>
          <a href="https://instagram.com" style={styles.link}>Instagram</a>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p style={styles.paragraph}>Email: info@scholarsphere.com</p>
          <p style={styles.paragraph}>Phone: +1 123 456 7890</p>
        </div>
        <div style={styles.subscribe}>
          <h4 style={styles.heading}>Subscribe</h4>
          <p style={styles.paragraph}>Stay updated with the latest news and offers from ScholarSphere.</p>
          <form style={styles.subscribeForm}>
            <input type="email" placeholder="Enter your email" style={styles.input} />
            <button type="button" style={styles.button}>Subscribe</button>
          </form>
        </div>
      </div>
      <div style={styles.copyright}>
        <p>&copy; HOSPITAL </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#005760',
    padding: '20px 0',
    borderTop: '1px solid #e9ecef',
    color: '#ffffff',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: '0 20px',
  },
  section: {
    flex: '1',
    maxWidth: '300px',
    margin: '10px 0',
  },
  heading: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    color: '#ffffff',
    fontFamily: "'Oswald', sans-serif", // Font family for headings
  },
  paragraph: {
    margin: '0 0 10px 0',
    fontSize: '0.9rem',
    color: '#ffffff',
    fontFamily: "'Rubik', sans-serif", // Font family for body text
  },
  subscribe: {
    flex: '1',
    maxWidth: '300px',
    border: '3px solid #000000',
    padding: '15px',
    borderRadius: '5px',
    backgroundColor: '#005760',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px 0',
  },
  subscribeForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    marginBottom: '10px',
    fontSize: '1rem',
    fontFamily: "'Rubik', sans-serif",
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    background: 'transparent',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '1rem',
    fontFamily: "'Rubik', sans-serif",
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },

  
  link: {
    display: 'block',
    color: '#ffffff',
    textDecoration: 'none',
    marginTop: '5px',
  },
  copyright: {
    textAlign: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #e9ecef',
    color: '#ffffff',
  },
};

export default Footer;



