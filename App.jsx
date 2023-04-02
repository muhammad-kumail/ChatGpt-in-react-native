import * as React from 'react';
import * as RN from 'react-native';
const { Configuration, OpenAIApi } = require("openai");
import axios from 'axios';
const configuration = new Configuration({
  apiKey: "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"
})

export default function App() {
  const [chatGptQ, setChatGptQ] = React.useState({
    question: '',
    answer: ''
  })
  const [isLoading, setIsLoading] = React.useState(false);
  const getGptResponse = async () => {
    if(chatGptQ.question.length === 0){
      setChatGptQ({...chatGptQ,answer: "You didn't Asked any Question"})
      return;
    }
    setIsLoading(true);
    try {

      const openai = new OpenAIApi(configuration)
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: chatGptQ.question,
        max_tokens: 200,
      })
      console.log('Generated')
      updateAns(completion.data.choices[0].text);
    } catch (error) {
      console.log(error.message)
      setChatGptQ({ ...chatGptQ, answer: error.message })
      setIsLoading(false);
    }
  }
  const updateAns = (txt) =>{
    let i = 3;
    const intervalId = setInterval(() => {
      if (i < txt.length) {
        setChatGptQ({ ...chatGptQ, answer: txt.slice(2,i) });
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
    setIsLoading(false);
  }
  return (
    <RN.View style={styles.container}>
      <RN.TextInput
        style={styles.inputField}
        placeholder='Send a message'
        placeholderTextColor={'#8e8e8e'}
        onChangeText={(val) => setChatGptQ({ ...chatGptQ, question: val })}
        onSubmitEditing={getGptResponse}
      />
      <RN.ScrollView style={styles.ansBox}>
        <RN.Text style={styles.ansText}>{chatGptQ.answer}</RN.Text>
      </RN.ScrollView>
      <RN.TouchableOpacity style={styles.button} activeOpacity={0.4}
        onPress={getGptResponse} disabled={isLoading}>
          {isLoading?<RN.ActivityIndicator size={22} color={'white'}/>:
            <RN.Text style={styles.btnText}>Generate</RN.Text>
          }
      </RN.TouchableOpacity>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    padding: 5
  },
  button: {
    backgroundColor: '#1ba680',
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center'
  },
  btnText: {
    fontSize: 16,
    color: 'white',
  },
  inputField: {
    backgroundColor: '#444654',
    padding: 10,
    fontSize: 16,
    color: 'white'
  },
  ansBox: {
    backgroundColor: '#444654',
    marginVertical: 10,
    padding: 10
  },
  ansText: {
    color: 'white',
    fontSize: 16,
  }
})
