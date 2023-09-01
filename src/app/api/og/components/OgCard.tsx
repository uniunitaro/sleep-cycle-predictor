import { CSSProperties, FC, ReactNode } from 'react'

const OgCard: FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => {
  return (
    <div
      style={{
        color: 'black',
        background: 'linear-gradient(to right, #38A169, #3182CE)',
        width: '100%',
        height: '100%',
        padding: '50px',
        display: 'flex',
      }}
    >
      <div
        style={{
          display: 'flex',
          background: 'white',
          borderRadius: 50,
          width: '100%',
          height: '100%',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default OgCard
