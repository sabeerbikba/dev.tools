import cards, { __baseUrl } from "../data/websites";
console.log(cards.length);

export default function Websites() {
    return (
        <>
            <div className="card-container" >
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        heading={card.heading}
                        text={card.text}
                        link={card.link}
                        // image={card.image}
                        imgClassNumber={card.imgClassNumber}
                        
                    />
                ))}
            </div>
        </>
    );
}

function Card({ heading, text, link, imgClassNumber }) {
    return (
        <div className="card text-white">
            <div className="card-body overflow-hidden ">
                <h4 className="card-heading">{heading}</h4>
                <p className="card-text">{text}</p>
            </div>
            <button className="card-button " >
                <a href={link} target="_blank" rel="noreferrer">
                    Visit Site
                    <div className={`card-image  ${'web-bg-image' + imgClassNumber}`} ></div>
                </a>
            </button>
        </div >
    );
}
