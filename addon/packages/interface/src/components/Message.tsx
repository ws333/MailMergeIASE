type Props = {
    message: string;
};

function Message({ message }: Props) {
    return (
        <div className="container_message">
            {message.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
        </div>
    );
}

export default Message;
