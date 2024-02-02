import cards from "../data/cards";

export default function Websites() {
    return (
        <>
            <div className="card-container" >
                {cards.map(card => (<Card
                    key={card.id}
                    heading={card.heading}
                    text={card.text}
                    link={card.link}
                />))}
            </div>
        </>
    );
}

function Card({ heading, text, link }) {
    return (
        <div className="card">
            <h4>{heading}</h4>
            <a href={link} target="_blank" rel="noreferrer"><p>{text}</p></a>
        </div>
    );
}