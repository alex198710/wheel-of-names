import React from "react"

const CustomButton = ({ name, onClick, color }: any) => (
    <button
      className="main"
      onClick={onClick}
      style={{ height: "8vh", fontSize: "22px", backgroundColor: color }}
    >
      <div className="content">{name}</div>
    </button>
  )
  export default CustomButton
