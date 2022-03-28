

export default function Question(props) {

    const htmlDecode = (input) => {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    
    const choices = props.answers.map(choice => {

        return <button
            key={choice.id}
            id={choice.id}
            className={
                `choice 
                ${choice.selected && "choice-selected"} 
                ${choice.answer === props.correct_answer ? 
                    props.checker && "choice-right" : 
                    props.checker && choice.selected && "choice-wrong"}`
            }
            onClick={(event) => props.select(event, props.id)}>{htmlDecode(choice.answer)}</button>
    })

    return (
        <div className="question">
            <h4>{htmlDecode(props.question)}</h4>
            {choices}
        </div>
    )
} 