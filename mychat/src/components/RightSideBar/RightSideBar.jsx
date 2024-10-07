import React from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/Firebase'

const RightSideBar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>Herry <img src={assets.green_dot} className='dot' alt="" /></h3>
        <p>Hey, There I am Herry using chat app.</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media </p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />


        </div>
      </div>
      {/* ye logout auth k upper change hoga */}
      <button onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default RightSideBar
