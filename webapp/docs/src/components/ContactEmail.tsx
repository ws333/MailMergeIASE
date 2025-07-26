function ContactEmail() {
  const user = 'support';
  const domain = 'iase.one';
  return (
    <a href={`mailto:${user}@${domain}`}>
      {user}@{domain}
    </a>
  );
}

export default ContactEmail;
