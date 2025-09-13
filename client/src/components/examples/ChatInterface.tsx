import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  const handleSendMessage = (message: string) => {
    console.log(`Chat message sent: ${message}`);
  };

  return (
    <div className="h-96 max-w-md">
      <ChatInterface 
        onSendMessage={handleSendMessage}
        isLoading={false}
      />
    </div>
  );
}