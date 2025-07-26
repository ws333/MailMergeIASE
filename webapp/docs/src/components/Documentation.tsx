import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import documentationMarkdown from '../md/documentation.md?raw';

function Documentation() {
  return (
    <div className="docs-container">
      <div className="docs-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{documentationMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Documentation;
