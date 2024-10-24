import React from 'react'
import './app_cards.css'
const App_cards = () => {
  return (
    <div className='app_cards'>
      <div className="app_cards_date">
        <h3>12/12/2021</h3>
      </div>
        <div className="app_cards_details">
            <p>Time : 10:00 AM</p>
            <p>Doctor : Dr. Ashish Bazad</p>
            <div className="app_cards_buttons">
                <button>Book Another</button>
                <button>Prescription</button>
            </div>
        </div>
    </div>
  )
}

export default App_cards
