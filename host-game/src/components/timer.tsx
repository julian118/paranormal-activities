import React, { useEffect, useState } from 'react'

const Timer: React.FC<{ duration: number }> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)

    if (duration > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timerId)
    }
  }, [duration])

  return <div>{timeLeft > 0 ? timeLeft : 'Time is up!'}</div>
}

export default Timer
