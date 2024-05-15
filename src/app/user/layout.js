import Sidebar from "../components/common/Sidebar"



function layout({ children }) {
  return (
    <div>
      <Sidebar/>
      {children}

    </div>
  )
}

export default layout
