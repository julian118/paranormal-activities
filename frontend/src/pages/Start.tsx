import { useState } from "react"

function Start() {
    // variables
    const maxNameLength: number = 15
    const maxRoomCodeLength: number = 4

    const [roomcode, setRoomCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [nameCharacterAmount, setNameCharacterAmount] = useState<number>(0)

    const handlePlayClick = () => {
        console.log("Roomcode:", roomcode)
        console.log("Name:", name)
    }

    const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.toUpperCase()
        const isAlphabet = (str: string) => /^[A-Z]+$/.test(str);

        if (inputValue.length <= maxRoomCodeLength && isAlphabet(inputValue)) {
            setRoomCode(inputValue)
        }
    }
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value

        setNameCharacterAmount(inputValue.length)

        if ((inputValue.length + 1) <= maxNameLength) {
             setName(inputValue)
        }
    }

    return (
        <div className="container">  
            <br />      
            <h1>Join a game</h1>
            <hr />
            <label htmlFor="roomcode">Room code:</label>

            <input 
            type="text" 
            placeholder="enter roomcode" 
            className="form-control" 
            id="roomcode"
            value={roomcode}
            onChange={handleRoomCodeChange}
            />

            <br />
            <span className="d-flex justify-content-between align-items-center">
                <label htmlFor="name">Name:</label>
                <label>{nameCharacterAmount}/{maxNameLength}</label>
            </span>
            

            <input 
            type="text" 
            placeholder="Enter a nickname" 
            className="form-control" 
            id="name "
            value={name}
            onChange={handleNameChange}
            />

            <br />
            <button 
            type="submit" 
            onClick={handlePlayClick}
            className="btn btn-primary form-control">play</button>
        </div>
        
    )
}


export default Start