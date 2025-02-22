import React, { useState } from "react";
import { 
    View, 
    Text, 
    Image,
    TextInput, 
    TouchableOpacity, 
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { getFinancialAdvice } from "../services/api";
import Markdown from 'react-native-markdown-display';

const MessageType = {
    QUESTION: 'question',
    RESPONSE: 'response'
};



const createMessage = (content, type) => ({
    id: Date.now(),
    content,
    type,
    timestamp: new Date()
});

const SuggestedQuestion = ({ text, onPress }) => (
    <TouchableOpacity style={styles.suggestionButton} onPress={onPress}>
        <Text style={styles.suggestionIcon}>✨</Text>
        <Text style={styles.suggestionText}>{text}</Text>
    </TouchableOpacity>
);

export default function AIChatScreen() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [messageStatus, setMessageStatus] = useState('');
    const [messages, setMessages] = useState([]);

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

  

    const handleAskAI = async (question) => {
        const queryText = question || input;
        if (!queryText) return;
        
        try {
            setLoading(true);
            setCurrentQuestion(queryText);
            setMessageStatus('sent');
            
            // Add user question to messages
            const questionMessage = createMessage(queryText, MessageType.QUESTION);
            setMessages(prevMessages => [...prevMessages, questionMessage]);
            
            const advice = await getFinancialAdvice(queryText);
            
            if (advice) {
                // Add AI response to messages
                const responseMessage = createMessage(advice, MessageType.RESPONSE);
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setLastUpdated(new Date());
                console.log('Messages updated:', [...messages, questionMessage, responseMessage]); // Debug log
            } else {
                setMessageStatus('error');
            }
        } catch (error) {
            setMessageStatus('error');
            console.error('Error getting response:', error);
        } finally {
            setLoading(false);
            setInput("");
            setTimeout(() => setMessageStatus(''), 3000);
        }
    };

    

    


    const suggestedQuestions = [
        "How can I save money?",
        "What's a good budget for a student?",
        "Plan my Finance"
    ];

    

return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
           
            <View style={styles.header}>
                <Text style={styles.title}>Hello, Ask Me{'\n'}Financial Advice...</Text>
                <Text style={styles.subtitle}>Last updated : {formatDate(lastUpdated)}</Text>
            </View>


            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
               
                
                {!messages.length && !loading && (
                    <View style={styles.suggestionsContainer}>
                        {suggestedQuestions.map((question, index) => (
                            <SuggestedQuestion 
                                key={index}
                                text={question}
                                onPress={() => handleAskAI(question)}
                            />
                        ))}
                    </View>
                )}

                {messages.map((message) => (
                    <View 
                        key={message.id}
                        style={[
                            styles.messageContainer,
                            message.type === MessageType.QUESTION ? 
                                styles.questionContainer : 
                                styles.responseContainer
                        ]}
                    >
                        {message.type === MessageType.QUESTION ? (
                            <Text style={styles.questionText}>{message.content}</Text>
                        ) : (
                            <View style={styles.responseWrapper}>
                                <ScrollView 
                                    style={styles.responseScroll}
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={true}
                                >
                                    <Markdown style={markdownStyles}>
                                        {message.content}
                                    </Markdown>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                ))}

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Getting your answer...</Text>
                    </View>
                )}
                
                <View style={styles.bottomPadding} />
            </ScrollView>



            
            <View style={styles.inputContainer}>
               
                <TouchableOpacity style={styles.iconButton}>
                <Image  source={{ uri:"https://img.icons8.com/material-outlined/24/microphone.png"}} style={{ width: 24, height: 24 }}/>
                </TouchableOpacity>
                
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask me financial advice..."
                    placeholderTextColor="#999"
                />
                
                
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={() => handleAskAI()}
                >
                   <Image 
        source={{ uri: "https://img.icons8.com/ios-filled/50/sent.png" }} 
        style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>

            
        </SafeAreaView>
    );
}

const markdownStyles = {
    body: {
        color: '#333',
        fontSize: 16,
        flex: 1,
    },
    heading1: {
        fontSize: 24,
        color: '#1976D2',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    heading2: {
        fontSize: 20,
        color: '#1976D2',
        fontWeight: 'bold',
        marginVertical: 8,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 22,
        marginVertical: 8,
        flexwrap: 'wrap',
    },
    list: {
        marginVertical: 8,
    },
    listItem: {
        marginVertical: 4,
    },
    listUnorderedItemIcon: {
        fontSize: 16,
        color: '#1976D2',
    },
    code_inline: {
        backgroundColor: '#f5f5f5',
        padding: 4,
        borderRadius: 4,
        fontFamily: 'monospace',
    },
    code_block: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        fontFamily: 'monospace',
        marginVertical: 8,
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: '#1976D2',
        paddingLeft: 10,
        marginLeft: 10,
        marginVertical: 8,
    },
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    responseScroll: {
        maxHeight: 300, 
        marginVertical: 5,
    },
   
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 90, 
    },
    
    bottomPadding: {
        height: 60, 
    },
 messageContainer: {
        marginVertical: 8,
        marginHorizontal: 10,
        width: '80%',
    },
    
    questionContainer: {
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 15,
        alignSelf: 'flex-end',
        maxWidth: '80%',
    },
    
    responseContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        alignSelf: 'flex-start',
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    questionText: {
        fontSize: 16,
        color: '#1976D2',
        fontWeight: '500',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100, 
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF', 
        padding: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
        marginHorizontal: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        fontSize: 12,
        marginTop: 5,
    },
    suggestionsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    suggestionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    suggestionIcon: {
        marginRight: 10,
        fontSize: 16,
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 80, // Increase bottom margin to stay above navigation
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1000, // Ensure input stays on top
    },
    iconButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: 10,
        color: '#333',
    },
    sendButton: {
        padding: 8,
    },
   
    responseText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22, 
        textAlign: 'left', 
    }
});
