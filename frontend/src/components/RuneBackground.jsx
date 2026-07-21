import './RuneBackground.css'

const particles = [
  ['ᚠ', '8%', '14%', '2.4rem', '0s', '19s', '-12deg'],
  ['ᚢ', '21%', '42%', '1.4rem', '-8s', '24s', '8deg'],
  ['ᚦ', '38%', '20%', '1.8rem', '-3s', '22s', '-6deg'],
  ['ᚨ', '52%', '69%', '2.1rem', '-12s', '27s', '14deg'],
  ['ᚱ', '69%', '35%', '1.5rem', '-6s', '20s', '-9deg'],
  ['ᚲ', '84%', '57%', '2.6rem', '-15s', '29s', '7deg'],
  ['ᚷ', '94%', '18%', '1.3rem', '-10s', '23s', '-15deg'],
  ['ᛉ', '13%', '82%', '2rem', '-5s', '26s', '10deg'],
  ['ᛏ', '43%', '91%', '1.2rem', '-17s', '21s', '-4deg'],
  ['ᛟ', '76%', '87%', '1.9rem', '-9s', '25s', '12deg'],
]

const ringRunes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᛟ']

export default function RuneBackground() {
  return (
    <div className="rune-background" aria-hidden="true">
      <div className="northern-glow glow-one" />
      <div className="northern-glow glow-two" />

      <div className="rune-orbit orbit-one">
        <i />
        {ringRunes.map((rune, index) => <span style={{ '--angle': `${index * 45}deg`, '--counter-angle': `${index * -45}deg` }} key={rune}>{rune}</span>)}
      </div>
      <div className="rune-orbit orbit-two">
        <i />
        {ringRunes.slice().reverse().map((rune, index) => <span style={{ '--angle': `${index * 45}deg`, '--counter-angle': `${index * -45}deg` }} key={rune}>{rune}</span>)}
      </div>

      {particles.map(([rune, x, y, size, delay, duration, rotate], index) => (
        <span
          className="rune-particle"
          style={{ '--x': x, '--y': y, '--size': size, '--delay': delay, '--duration': duration, '--rotate': rotate }}
          key={`${rune}-${index}`}
        >{rune}</span>
      ))}
    </div>
  )
}
