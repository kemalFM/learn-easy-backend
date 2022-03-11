# LIA-API 

You would like to use the API for this new innovative Project ? 
No Problem. Just follow this steps to use our API. 

## Authentication 
To use our API you will have to contact the support at kontakt@kfm-dm.de. 
  
The url looks always the same: 

https://easy-learn-backend.kfm.digital/[SessionToken]/[UserID]/[routename]  

### Get your Sessiontoken
After you got your credentials you will be able to authenticate yourself at following Entpoint:   
```  
Method: POST  
URL: https://easy-learn-backend.kfm.digital/login  
BODY: 
{
    "Username":"Kemal", 
    "Password": "1"
}
```  

### Response
<table>
<tr>
<th>failed login:  </th>
<th>successfull login </th>
</tr>
<tr>
<td>

{
    "successfull": false
}


</td>
<td>
 
```
 
{
    "successfull": true,
    "user": {
        "uuid": "63366242-[...]-6eddbf85bd2e",
        "role": "ADMIN",
        "username": "kemal",
        "ID": 1
    },
    "sessionToken": "deb2143c7c72e[...]6768a61dc5b68ee984f8be4ce15ee"
}
```

</td>
</tr>
</table>

Store the sessiontoken and and the username in a global storage like (local storage, Redux, Zustand.js). 

### Invalid Sessiontoken
```
{
  "err": "userNotAuthorized"
}
```

## Get Questions

Route: 
```
GET: /getOpenQuestions/(optional:)topic
```
Response: 
<table>
<tr>
<th>Response</th>
<th>Structured Question List</th>
 <th>Question object</th>
</tr>
<tr>
<td>
 
```
{
answered: [Structured Question List]	// All answered Questions
moreThanThreeTimesWrong: [S. Q. L.]	// answered more than 3 times wrong 
notAnsweredQuestions: [S. Q. L.]	// notAnsweredQuestions
rightAnswered: [S. Q. L.]	// rightAnswered
wrongAnswered: [S. Q. L.]	// wrongAnswered
}
```

</td>
 <td>
 
```
{
 "question": Question object,
 "ID": 1,
 "wrongCount": 2, // How often the answer has been answered wrong 
 "rightCount": 11, // How often the answer has been answered right
 "latestResult": true // What was the last answer? (true =  answered right )
}
```

</td>
<td>
 
```
{
        "ID": 1,
        "format": "CHOICE",
        "body": "Wie viele unterschiedliche Möglichkeiten bei der Zusammenstellung der Mahlzeiten gibt es?",
        "additionalText": "",
        "options": ["2","3","4","5","6"],
        "correctOptions": "3",
        "multiple": 1,
        "abstentionsAllowed": 1,
        "image": "https://s3.xopic.de/mooc[...]5ryFd_Folie19.PNG",
        "topic": "BPMN-Grundlagen-2",
        "Result": 0,
        "User": "63366[...]dbf85bd2e",
        "TimeStamp": "2022-03-08T10:48:25.000Z",
        "AnsweredID": 6
      },
```

</td>
</tr>
</table>

## Safe answered question 
### Route 
```
POST: /saveResult
```

```
BODY:
{
    "Question": 1, // Question ID
    "Result": true // Result of answer
}
```

## Topics

```
GET: /getTopics
```
Response:
```
[
    "BPMN-Grundlagen-2",
    "BPMN-Grundlagen-1",
    "BPMN-Grundlagen-3",
    "Exklusive & zusammenführende Gateways",
    "Inklusives Gateway",
    "Entscheidungspunkt in Prozessmodellen",
    "Gateway"
]
```
