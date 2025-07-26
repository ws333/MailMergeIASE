import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import privacyMarkdown from '../md/privacy-policy.md?raw';
import ContactEmail from './ContactEmail';

function PrivacyPolicy() {
  // Split the markdown at the placeholder
  const [before, after] = privacyMarkdown.split('[contact-email]');

  return (
    <div className="docs-container">
      <div className="docs-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{before}</ReactMarkdown>
        <ContactEmail />
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{after}</ReactMarkdown>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
