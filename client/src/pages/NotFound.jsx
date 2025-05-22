import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          <FaHome className="button-icon" />
          Go Home
        </Link>
      </div>
      <div className="not-found-image">
        <img src="/images/404-illustration.svg" alt="Page not found" />
      </div>
    </div>
  )
}

export default NotFound
