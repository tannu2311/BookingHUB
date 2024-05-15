
import Sidebar from '../components/common/Sidebar'

function Adminlayout({ children }) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  )
}

export default Adminlayout
