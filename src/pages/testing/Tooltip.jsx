function Tooltip() {
    return (
        <>
            <div style={{
                marginLeft: '25px',
                display: 'inline',
                border: '2px solid red',
                color: 'white',
                borderRadius: '8px',
                padding: '7px',
                backgroundColor: 'rgba(255, 0, 0, 0.1)'
            }}>
                <span style={{
                    position: 'relative',
                    left: '-25px',
                    bottom: '-3px',
                    display: 'inline-block',
                    width: 0,
                    height: 0,
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent',
                    borderRight: '10px solid red',
                }}></span>
                sabeer bibka sabeer bikba
            </div>
        </>
    )
}