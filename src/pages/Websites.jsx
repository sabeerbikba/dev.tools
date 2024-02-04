import cards, { __baseUrl } from "../data/cards";

export default function Websites() {
    return (
        <>
            <div className="card-container" >
                {cards.map((card, index) => (<Card
                    key={index}
                    heading={card.heading}
                    text={card.text}
                    link={card.link}
                    image={ card.image}
                />))}
            </div>
        </>
    );
}

function Card({ heading, text, link, image }) {
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-heading">{heading}</h4>
                <p className="card-text">{text}</p>
            </div>
            <button className="card-button ">
                <a href={link} target="_blank" rel="noreferrer">
                    Visit Site
                    <img className="card-image" src={ __baseUrl + image} />
                </a>
            </button>
        </div>
    );
}
