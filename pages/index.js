import { useEffect } from 'react'
import Script from 'next/script'

function HomePage() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyCAcFLo5bKDhF7C4zAlXET-MzgaNaufv6M',
    authDomain: 'breakout-7da79.firebaseapp.com',
    databaseURL: 'https://breakout-7da79.firebaseio.com',
    projectId: 'breakout-7da79',
    storageBucket: 'breakout-7da79.appspot.com',
    messagingSenderId: '343490549392',
  }

  useEffect(() => {
    firebase.initializeApp(config)
  }, [])

  return (
    <div>
      <script src="https://www.gstatic.com/firebasejs/5.4.0/firebase.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.3.0/firebase-database.js"></script>
      <Script></Script>

      <div id="main">
        <div id="arcade"></div>
        <canvas id="myCanvas" width="700px" height="700px"></canvas>
        <input type="text" id="nameBox" autoFocus />
        <canvas id="grid" width="608px" height="608px"></canvas>
      </div>

      <Script type="text/javascript" src="script.js" strategy="afterInteractive"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.js"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></Script>
    </div>
  )
}

export default HomePage
