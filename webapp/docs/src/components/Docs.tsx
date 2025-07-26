import { Link } from 'react-router-dom';

function Docs() {
  return (
    <div className="docs-container">
      <h1>Information</h1>
      <ul>
        <li>
          <Link to="/documentation">Documentation</Link>
        </li>
        <li>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/terms-of-service">Terms of Service</Link>
        </li>
      </ul>
    </div>
  );
}

export default Docs;
