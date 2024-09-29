
const Settings: React.FC = () => {
    const handleMusicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    }

    return (
        <div className="d-flex container flex-column justify-content-center">
            <h1>Settings</h1>
            <label htmlFor="musicVolume" className="form-label">Music volume</label>
            <input onChange={handleMusicChange} type="range" className="form-range" id="musicVolume" />
            <label htmlFor="soundEffectVolume" className="form-label">Sound effect volume ()</label>
            <input type="range" className="form-range" id="soundEffectVolume" />
        </div>
    )
}

export default Settings
