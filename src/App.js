
import React from "react"
import blobA from "./images/blobA.png"
import blobB from "./images/blobB.png"
import Question from "./components/Question.js"
import Spinner from "./components/Spinner"
import { nanoid } from "nanoid"

export default function App() {

    const [start, setStart] = React.useState(false)
    const [quiz, setQuiz] = React.useState(false)
    const [checker, setChecker] = React.useState(false)
    const [number, setNumber] = React.useState(0)
    const [correctAnswers, setCorrectAnswers] = React.useState(0)
    const [quizArray, setQuizArray] = React.useState([])
    const [loading, setLoading] =  React.useState(false)
    const [startForm, setStartForm] = React.useState({
        difficulty: '',
        category: '',
        amount: 'amount=5'
    })

    function handleStartForm(event) {
        const {name, value, type, checked} = event.target
        setStartForm(prevForm => ({
                ...prevForm,
                [name]: type === "checkbox" ? checked : value 
        }))
        setNumber(prev => prev+1)
    }

    function select(event,parentId) {
        const {id} = event.target
        return setQuizArray(prevArray =>(prevArray.map(item => ({
            ...item,
            all_answers: item.id === parentId ? item.all_answers.map(prevAnswer => {
                return prevAnswer.id === id ?
                    {...prevAnswer,
                    selected: !prevAnswer.selected} :
                    {...prevAnswer, 
                    selected: false}                       
            }):
            item.all_answers
        }))))
    } 

    function correctNumber() {
        let num = 0
        // increment number of correct answers
        quizArray.map(item => {
            return item.all_answers.map(choice => {
                return choice.selected === true &&
                 choice.answer === item.correct_answer && 
                 num++
            })
         })
         return num
    }


    function shuffle(array){
        return array.sort(() => 0.5 - Math.random())
    }

    function checkAnswer() {
        if(!checker){
            setChecker(true)
            setCorrectAnswers(correctNumber())
        }else{
            // change number to fetch new data
            setQuizArray([])
            setNumber(prev => prev+1)
            setChecker(false)
            setCorrectAnswers(0)
        }
    }
    
    const startQuiz = () => {
        setStart(prev => !prev)
        setTimeout(() => { 
            setQuiz(prev => !prev) 
            
        }, 1000)
    }
    
    React.useEffect(() => { 

        const getQuestions = async () => {
            setLoading(true)
            let response = await fetch(`https://opentdb.com/api.php?${startForm.amount}${startForm.category}${startForm.difficulty}&type=multiple`)
            let data = await response.json()
            setLoading(false)
            getData(data)
        }

        const getData = (data) => setQuizArray(data.results.map(item => {
            let arr = [...item.incorrect_answers,item.correct_answer]
            let shuffledArr = shuffle(arr)
            // only answers and questions remain in the new data.
            return {
                id: nanoid(),
                correct_answer: item.correct_answer,
                question: item.question,
                // modifying the data to include all answers in one key "all_answers"
                // and give each answer a "selected: false" property.
                all_answers: shuffledArr.map(choice => ({id: nanoid(), answer: choice, selected: false}))
            }
        }))

        getQuestions()

    },[number])

    const questions = quizArray.map(item => {

        return (
            <Question 
            key={item.id}
            id={item.id}
            select={select}
            checker={checker}
            answers={item.all_answers}
            correct_answer={item.correct_answer}
            question={item.question}
            />
        )
    })

    return (
        <main className="main">
            <img className={`blobB ${start && "move-blobB"}`} src={blobB} alt="blob"/>

            {!quiz && <div className={`start ${start && "disappear"}`}>
                <h1>Quizziyy</h1>
                <h4>Play and test your trivia skills</h4>

                <label htmlFor="category">Select category</label>
                <select 
                    id="category"
                    value={startForm.category}
                    onChange={handleStartForm}
                    name="category">
                    <option value="">- Any -</option>
                    <option value="&category=12">Music</option>
                    <option value="&category=11">Film</option>
                    <option value="&category=15">Video games</option>
                    <option value="&category=21">Sports</option>
                    <option value="&category=22">Geography</option>
                    <option value="&category=23">History</option>
                    <option value="&category=26">Celebrities</option>
                </select>

                <fieldset>
                <legend>Set difficulty</legend>
                
                <input 
                    type="radio"
                    id="easy"
                    name="difficulty"
                    value="&difficulty=easy"
                    checked={startForm.difficulty === "&difficulty=easy"}
                    onChange={handleStartForm}
                />
                <label htmlFor="easy">Easy</label>

                <input 
                    type="radio"
                    id="medium"
                    name="difficulty"
                    value="&difficulty=medium"
                    checked={startForm.difficulty === "&difficulty=medium"}
                    onChange={handleStartForm}
                />
                <label htmlFor="medium">Medium</label>
                
                <input 
                    type="radio"
                    id="hard"
                    name="difficulty"
                    value="&difficulty=hard"
                    checked={startForm.difficulty === "&difficulty=hard"}
                    onChange={handleStartForm}
                />
                <label htmlFor="hard">Hard</label>
                
            </fieldset>


                <button
                    className={`blue-button ${start && "disappear"}`}
                    onClick={startQuiz}><h3>Start Quiz</h3></button>
            </div>}

            {quiz && <div className="quiz-container">
                <button className="back" onClick={()=> {setQuiz(false);setStart(false)}}>&#8678;</button>
                <div>{questions}</div>
                {loading ? <Spinner /> :
                <div className="button-score">
                {checker &&<h5>You scored {correctAnswers}/5 correct answers</h5>}
                <button className="blue-button check-answers" onClick={checkAnswer}>
                {checker? "Play again" : "Check answers"}</button>
                </div>}
            </div>}
             
            <img className={`blobA ${start && "move-blobA"}`} src={blobA} alt="blob"/>
        </main>
    )
}