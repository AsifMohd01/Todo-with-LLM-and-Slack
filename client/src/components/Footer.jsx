import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Todo Summary Assistant</h3>
          <p>Manage your tasks efficiently and get AI-powered summaries</p>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Create and manage todos</li>
            <li>AI-powered task summarization</li>
            <li>Slack integration</li>
            <li>Secure authentication</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="#" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Todo Summary Assistant. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
