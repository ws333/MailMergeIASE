import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import termsMarkdown from '../md/terms-of-service.md?raw';
import ContactEmail from './ContactEmail';

function TermsOfService() {
  // Split the markdown at the placeholder
  const [before, after] = termsMarkdown.split('[contact-email]');

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

export default TermsOfService;
